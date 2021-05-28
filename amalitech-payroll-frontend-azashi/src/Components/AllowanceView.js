import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TableRow, TableCell, TableBody, TableContainer, Snackbar } from "@material-ui/core";
import "../index.css";
import Card from "@material-ui/core/Card";
import useTable from "../Components/useTable";
import { BounceLoader } from "react-spinners";
import Table from "@material-ui/core/Table";
import Api from "../Services/api";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import AddAllowanceForm from "../Components/AddAllowanceForm";
import { Search } from '@material-ui/icons';
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import moment from "moment"
import * as roles from '../Services/roles'
import { useDispatch, useSelector } from "react-redux";
import { additionsReducer, handleStateAlert, hanldeSuccesState } from "../Services/_redux/additions/addition_slice";
import { fetchAllowancesWithThunk } from "../Services/_redux/additions/index";
import { logoutUser } from "../Services/auth";
import { Alert } from "@material-ui/lab";
import {getErrorCode} from "../Services/employeeService";


const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
  },
  button: {
    margin: theme.spacing(1.5, 0.3, 1, 0.1),
  },
  root: {
    flexGrow: 1,
  },
  incomecolumn: {
    width: "40%",
  },
}));

const headCells = [
  { id: "number", label: "NO.", disableSorting: true },
  { id: "displayName", label: "NAME OF EMPLOYEE", disableSorting: true },
  { id: "employeeNumber", label: "EMPLOYEE ID", disableSorting: true },
  { id: "deductionName", label: "ALLOWANCE NAME", disableSorting: true },
  { id: "taxable", label: "TAXABLE", disableSorting: true },
  { id: "totalAllowance", label: "TOTAL AMOUNT", disableSorting: true },
  { id: "monthlyAllowance", label: "MONTHLY ALLOWANCE", disableSorting: true },
  { id: "startDate", label: "START DATE", disableSorting: true },
  { id: "endDate", label: "END DATE", disableSorting: true },
  { id: "status", label: "STATUS", disableSorting: true },
];

function AllowanceView() {
  const classes = useStyles();
  const additions = useSelector(additionsReducer);
  const allowanceState = additions.allowance;
  const dispatch = useDispatch();
  const [open1, setOpen1] = useState(false);
  const [allowance, setAllowance] = useState({})
  const [pageReady, setPageReady] = useState(false);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)

  const handleAlertState = (alertOpen, alertType, alertMessage) => {
    setAlertType(alertType)
    setAlertMessage(alertMessage)
    setAlertOpen(alertOpen)
}

const handleErrorResponse = (error) => {
  if (error.response.status === 401) {
      handleAlertState(true, 'error', 'You are not authorized to perform this operation')
  } else if (error.response.status === 416) {
      logoutUser()
      window.location.reload()
  } else {
      handleAlertState(true, 'error', 'Error occurred while performing this operation')
  }
}

  const handleCloseAllowance = () => {
    setOpen1(false);
  };
  
  const handleOpenAllowance = () => {
    setOpen1(true);
  };

  //   FUNCTION TO FETCH ALL ALLOWANCES
  const getAllAllowance = async (page) => {
      Api().get(`/allowances/?&page=${page}`).then((response) => {
          setAllowance(response.data);
          setPageReady(true);
      }).catch((error) => {
          console.log(error)
      })
  };

  const updateData = (page) => {
    getAllAllowance(page - 1)
      .then(() => {})
      .catch(() => {});
  };

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
        fn: items => {
            if (target.value === "")
                return items;
            else
                return items.filter(
                    x => x.displayName?.toLowerCase().match(target.value.toLowerCase()) ||
                        x.employeeNumber?.toLowerCase().match(target.value.toLowerCase()) ||
                        x.description?.toLowerCase().match(target.value.toLowerCase()) ||
                        x.startDate?.toLowerCase().match(target.value.toLowerCase()) ||
                        x.endDate?.toLowerCase().match(target.value.toLowerCase())
                )
        }
    })
}

const {
  TblContainer,
  TblHeadTwo,
  TablePaginations,
  recordsAfterPagingAndSorting,
} = useTable(allowanceState.data, headCells, filterFn, updateData);

  useEffect(() => {
    const page = allowance.pageable?.pageNumber || 0;
    // getAllAllowance(page);
    dispatch(fetchAllowancesWithThunk({ page }));
  }, []);

  const hanldeSuccesStateAlert = (openAlert, alertType, message) => {
    dispatch(hanldeSuccesState({ openAlert, alertType, message }))
  }

  useEffect(() => {
    if (additions.allowance.status === 'Failed'){
        if(getErrorCode(additions?.allowance?.error?.error?.message).includes('416')) {
            const error = {
                response: {
                    status: 416
                }
            }
            handleErrorResponse(error)
        }
        else if (getErrorCode(additions?.allowance?.error?.error?.message).includes('401')) {
            const error = {
                response: {
                    status: 401
                }
            }
            handleErrorResponse(error)
        } else {
            const error = {
                response: {
                    status: 400
                }
            }
            handleErrorResponse(error)
        }
  
    }
  }, [additions.allowance.status]);


  return (
    <div>
      <div className="row justify-content-between">
          <div className="col-md-2 mb-2">
              <FormControl
                size="small"
                fullWidth="true"
                className=""
                color="primary" style={{backgroundColor:"#ffffff"}}
                >
                  <TextField size="small" type="search" onInput={(event) => handleSearch(event)} variant={"outlined"}
                    InputProps={{ startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                      ),
                      style: { backgroundColor: 'white' } }} label="Search" />
                </FormControl>
            </div>
            <div className="col-md-8 mb-2">

            </div>
            <div className="col-md-2 mb-3">
            {
              roles.canAdd() ? (
                <Button
                className="float-right addallowancebtn"
                variant="contained"
                color="primary"
                size="small"
                onClick={handleOpenAllowance}
              >
                Add Allowance
              </Button>
              ) : null
            }
         
          </div>
        
      </div>
      <Dialog
        open={open1}
        onClose={handleCloseAllowance}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="form-dialog-title" className="text-center">
          New Allowance
        </DialogTitle>
        <DialogContent>
          <AddAllowanceForm open={open1} handleCloseAllowance={handleCloseAllowance} />
        </DialogContent>
      </Dialog>

      <div className="row">
        <div className="col-md-12">
      <TableContainer component={Card}>
        <TblContainer>
          <Table className={classes.table} aria-label="simple table">
            <TblHeadTwo />

            {allowanceState.preloader ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <div className="w-100 d-flex justify-content-center text-center">
                    <BounceLoader size={90} color="#cf4f1f" loading />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
                recordsAfterPagingAndSorting()?.length <= 0 ? (
                    <TableRow>
                        <TableCell colSpan={9}>
                            <div className="w-100 d-flex justify-content-center text-center">
                                <p id="" className="">
                                    <strong>No data available.</strong>
                                </p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : (
                    recordsAfterPagingAndSorting()?.map((allowance, i) => {
                        console.log("allowance",allowance)
                        return (
                            <TableBody>
                                <TableRow key={allowance.employeeNumber}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {allowance.displayName}
                                    </TableCell>
                                    <TableCell>{allowance.employeeNumber}</TableCell>
                                    <TableCell>{allowance.description}</TableCell>
                                    <TableCell>{allowance.taxable === true ? "Yes" : "No"}</TableCell>
                                    <TableCell>GHS {allowance.totalAllowance.toFixed(2)}</TableCell>
                                    <TableCell>GHS {allowance.monthlyAllowance.toFixed(2)}</TableCell>
                                    <TableCell> {moment(`${allowance.startDate}`).format('MMM  YYYY')}</TableCell>
                                    <TableCell> {moment(`${allowance.endDate}`).format('MMM  YYYY')}</TableCell>
                                    <TableCell>
                                        <Button
                                            className="in-progress-button"
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            style={{cursor: "default"}}
                                        >
                                            In progress
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        );
                    })
                )
            )
            }
          </Table>
        </TblContainer>
        </TableContainer>
        <div className="row justify-content-center d-flex text-center w-100">
          <div className="col-md-12 p-3 text-center justify-content-center d-flex">
            {recordsAfterPagingAndSorting()?.length > 0 ? (
              <TablePaginations />
            ) : null}
          </div>
        </div>
      </div>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => handleAlertState(false, '', '')}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert  severity={alertType}>
                {alertMessage}
            </Alert>
        </Snackbar>

      <Snackbar
          open={additions.succuessMessage.openAlert}
          autoHideDuration={3000}
          onClose={() => hanldeSuccesStateAlert(false, "", "")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
          <Alert severity={additions.succuessMessage.alertType}>{additions.succuessMessage.message}</Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default AllowanceView;
