import React, { useState, useEffect } from "react";
import { Search } from "@material-ui/icons";
import Card from "@material-ui/core/Card";
import {TextField, Button, Grid} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import AddDeductionForm from "../Components/AddDeductionForm";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Api from "../Services/api";
import useTable from "../Components/useTable";
import { BounceLoader } from "react-spinners";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import moment from "moment"
import TableContainer from "@material-ui/core/TableContainer";
import * as roles from '../Services/roles'
import { Alert } from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeductionsWithThunk } from "../Services/_redux/deductions/index"
import { deductionsReducer, handleStateAlert, handleSuccessStateDed } from "../Services/_redux/deductions/deduction_slice"


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const headCells = [
  { id: "number", label: "NO.", disableSorting: true },
  { id: "displayName", label: "NAME OF EMPLOYEE", disableSorting: true },
  { id: "employeeNumber", label: "EMPLOYEE ID", disableSorting: true },
  { id: "deductionName", label: "DEDUCTION NAME", disableSorting: true },
  { id: "totalAmount", label: "TOTAL AMOUNT", disableSorting: true },
  { id: "monthlyDeduction", label: "MONTHLY DEDUCTION", disableSorting: true },
  { id: "startDate", label: "START DATE", disableSorting: true },
  { id: "endDate", label: "END DATE", disableSorting: true },
  { id: "status", label: "STATUS", disableSorting: true },
];

function AddDeduct() {
  const deductions = useSelector(deductionsReducer)
  const dispatch = useDispatch()
  const [status,setStatus] = useState(deductions.status)
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [getDeductions, setGetDeductions] = useState({});
  const [pageReady, setPageReady] = useState(false);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const handleCloseForm = () => {
    setOpen(false);
  };

  const handleOpenDeduc = () => {
    setOpen(true);
  };

  // FUNCTION TO GET LIST OF DEDUCTION IN THE SYSTEM
  const getAllDeduction = async (page) => {
    const allDeductions = await Api().get(`/deductions/?&page=${page}`);
    setGetDeductions(allDeductions.data);
    setPageReady(true);
  };
  const updateData = (page) => {
    getAllDeduction(page - 1)
      .then(() => {})
      .catch(() => {});
  };

  // FUNCTION FOR SEARCH
  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter(
            (x) => x.displayName?.toLowerCase().match(target.value.toLowerCase()) ||
              x.employeeNumber?.toLowerCase().match(target.value.toLowerCase()) ||
              x.description?.toLowerCase().match(target.value.toLowerCase()) ||
              x.startDate?.toLowerCase().match(target.value.toLowerCase()) ||
              x.endDate?.toLowerCase().match(target.value.toLowerCase())
          );
      },
    });
  };

  const {
    TblHeadTwo,
    TablePaginations,
    recordsAfterPagingAndSorting,
  } = useTable(deductions.data, headCells, filterFn, updateData);

  useEffect(async() => {
    const page = deductions.pageable?.pageNumber || 0;
    await dispatch(fetchDeductionsWithThunk({page:page}))
    setStatus(deductions.status)
  }, []);


  const hanldeSuccesStateAlert = (openAlert, alertType, message) => {
    dispatch(handleSuccessStateDed({ openAlert, alertType, message }))
  }


  return (
    <div className="ml-4 mr-4">
      <h3 className="row justify-content-start lead-title pl-3">Deductions</h3>

      <div className="row">
          <div className="col-md-2 mb-2">
                <FormControl
                  size="small"
                  fullWidth="true"
                  className=""
                  color="primary"
                >
                  <TextField
                    size="small"
                    type="search"
                    onInput={(event) => handleSearch(event)}
                    variant={"outlined"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                      style: { backgroundColor: "white" },
                    }}
                    label="Search"
                  />
                </FormControl>
          </div>
          <div className="col-md-8 mb-2">

          </div>
        <div className="col-md-2 mb-2">
          {
            roles.canAdd() ? (
              <Button
                className="adddeductionbtn float-right mb-2"
                variant="contained"
                color="primary"
                size="small"
                onClick={handleOpenDeduc}
              >
                Add Deduction
              </Button>
            ) : null
          }
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleCloseForm}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="form-dialog-title" className="text-center">
          New Deductions
        </DialogTitle>
        <DialogContent>
          <AddDeductionForm open={open} handleCloseForm={handleCloseForm}/>
        </DialogContent>
      </Dialog>

      <div className="row">
      <div className="col-md-12">
        <TableContainer component={Card} style={{maxHeight:"70vh", overflow: "scroll"}}>
          <Table stickyHeader aria-label="simple table">
            <TblHeadTwo />

            {
              deductions.preloader ? (
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
                        recordsAfterPagingAndSorting()?.map((deduct, i) => {
                        return (
                            <TableBody>
                              <TableRow key={deduct.id}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell component="th" scope="row">
                                  {deduct.displayName}
                                </TableCell>
                                <TableCell>{deduct.employeeNumber}</TableCell>
                                <TableCell>{deduct.description}</TableCell>
                                <TableCell>GHS {deduct.amountDue.toFixed(2)} </TableCell>
                                <TableCell>GHS {deduct.monthlyDeduction.toFixed(2)}</TableCell>
                                <TableCell> {moment(`${deduct.startDate}`).format('MMM  YYYY')}</TableCell>
                                <TableCell> {moment(`${deduct.endDate}`).format('MMM  YYYY')}</TableCell>
                                <TableCell>
                                  <Button
                                      style={{cursor: "default"}}
                                      className="in-progress-button"
                                      variant="contained"
                                      color="primary"
                                      size="small"
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
        </TableContainer>
        </div>
        </div>
        <div className="row justify-content-center d-flex text-center w-100">
          <div className="col-md-12 p-3 text-center justify-content-center d-flex">
            {recordsAfterPagingAndSorting()?.length > 0 ? (
              <TablePaginations />
            ) : null}
          </div>
        </div>
        <Snackbar
          open={deductions.successMessage.openAlert}
          autoHideDuration={3000}
          onClose={() => hanldeSuccesStateAlert(false, "", "")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
          <Alert severity={deductions.successMessage.alertType}>{deductions.successMessage.message}</Alert>
        </Snackbar>
      </div>
  );
}

export default AddDeduct;
