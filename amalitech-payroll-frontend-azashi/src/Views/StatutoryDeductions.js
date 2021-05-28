import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import Tab from "@material-ui/core/Tab";
import TabContext from '@material-ui/lab/TabContext';
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@material-ui/lab";
import AddTax from "../Components/AddTax";
import DialogContent from "@material-ui/core/DialogContent";
import AddPension from "../Components/AddPension"
import DecisionDialogPension from "../Components/DecisionDialogPension";
import DecisionDialogTax from '../Components/DecisionDialogTax';
import { BounceLoader } from "react-spinners";
import * as roles from '../Services/roles'
import { logoutUser } from "../Services/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaxWithThunk, fetchSsnitWithThunk } from "../Services/_redux/statutory/index"
import { statutoryReducer,  handleStateAlert, hanldeSuccesState} from "../Services/_redux/statutory/statutory_slice"
import {getErrorCode} from "../Services/employeeService";



const useStyles = makeStyles((theme) => ({
    button: {
    margin: theme.spacing(1.5, 0.3, 1, 0.1)
    },
    root: {
        flexGrow: 1,
    },

}));

function StatutoryDeductions() {
  const dispatch = useDispatch()
  const statutories = useSelector(statutoryReducer)
  const statutorTax = statutories.tax
  const statutoryPension = statutories.ssnit
  const taxState = statutories.tax
  const ssnitState = statutories.request

  const classes = useStyles();
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const [open1, setOpen1] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [openAddForm, setOpenAddForm] = useState(false);
  const [editMode, seteditMode] = useState(false)
  const [taxToPass, setTaxToPass] = useState({})
  const [penToPass, setPenToPass] = useState({})


  const handleClickOpenTax = () => {
    setOpen1(true);
  };

  const handleClosePen = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen1(false);
  }

  const handleAddForm = () => {
    seteditMode(false)
    setTaxToPass({})
    setPenToPass({})
    setOpenAddForm(true);
  };

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

  const handleCloseForm = () => {
    setOpenAddForm(false);
  };


  // USEEFFECT USED TO MAKE CALLS FOR FETCHING OF DATA
  useEffect( () => {
    dispatch(fetchTaxWithThunk())
    dispatch(fetchSsnitWithThunk())
  }, []);
  

useEffect(() => {
  if (statutories.ssnit.status === 'Failed'){
      if(getErrorCode(statutories.ssnit.error.error.message).includes('416')) {
          const error = {
              response: {
                  status: 416
              }
          }
          handleErrorResponse(error)
      }
      else if (getErrorCode(statutories.ssnit.error.error.message).includes('401')) {
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
}, [statutories.ssnit.status]);

useEffect(() => {
  if (statutories.tax.status === 'Failed'){
      if(getErrorCode(statutories.tax.error.error.message).includes('416')) {
          const error = {
              response: {
                  status: 416
              }
          }
          handleErrorResponse(error)
      }
      else if (getErrorCode(statutories.tax.error.error.message).includes('401')) {
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
}, [statutories.tax.status]);

  const hanldeSuccesStateAlert = (openAlert, alertType, message) => {
    dispatch(hanldeSuccesState({ openAlert, alertType, message }))
  }

  const handleAlertState = (openAlert, alertType, message) => {
    dispatch(
      handleStateAlert({ openAlert, alertType, message })
    );
  };


  return (
    <div className="ml-4">
        <h3 className=" row justify-content-start lead-title pt-0 mr-2">
          Statutory Deductions
        </h3>

        <div className="">
          <TabContext value={value}>
            <TabList onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Tax" value="1" />
              <Tab label="SSNIT" value="2" />
            </TabList>
            <TabPanel value="1">
              <div className="row justify-content-end mr-3 pb-3">
               {
                 roles.canAdd() ? (
                  <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleAddForm}
                  className="addnewbtn"
                >
                  Add New
                </Button>
                 ): null
               }
                <Dialog
                  open={openAddForm}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogTitle id="form-dialog-title" className="text-center">{!editMode ? "Add Statutory Deductions" : "Edit Statutory Deductions"}</DialogTitle>
                  <DialogContent>
                  <AddTax editMode={editMode} taxToPass={taxToPass} handleCloseForm={handleCloseForm} />
                  </DialogContent>
                </Dialog>
              </div>
              {/* Contents of Tax comes here */}
              <TableContainer className="row" component={Card} style={{maxHeight:"70vh"}}>
                <Table stickyHeader aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell >
                        LABEL
                      </TableCell>
                      <TableCell align="center" >
                        CHARGEABLE INCOME
                      </TableCell>
                      <TableCell align="center">
                        RATE (%)
                      </TableCell>
                      {
                        roles.canEdit() ? (
                          <TableCell align="right">ACTIONS</TableCell>
                        ) : null
                      }
                     
                    </TableRow>
                  </TableHead>

                  {statutorTax.preloader ? (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="w-100 d-flex justify-content-center text-center">
                              <BounceLoader size={90} color="#cf4f1f" loading />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : statutorTax?.data?.length <= 0 ? (
                    <TableRow>
                    <TableCell colSpan={4}>
                      <div className="w-100 d-flex justify-content-center text-center">
                            <p><strong>No Data Available</strong></p>
                      </div>
                    </TableCell>
                  </TableRow>
                  ) : statutorTax?.data?.map((taxes) => {
                    return (
                      <TableBody>
                        <TableRow key={taxes.id}>
                          <TableCell component="th" scope="row">
                            {taxes.label}
                          </TableCell>
                          <TableCell align="center">{taxes.amount}</TableCell>
                          <TableCell align="center">{taxes.percentage}</TableCell>
                          {
                            roles.canEdit() ? (
                              <TableCell align="right">
                              <EditIcon
                                   color="primary" className="mr-2 cursor-pointer"
                                   onClick={()=>
                                     {
                                       seteditMode(true)
                                       setTaxToPass(taxes)
                                       setOpenAddForm(true);
                                     }
                                   }
                                 />
   
                               <DeleteIcon
                                   color="primary" className="mr-2 cursor-pointer"
                                   onClick={() => {
                                     handleClickOpenTax()
                                     setTaxToPass(taxes)
                                   }
                                 }
                                />
                             </TableCell>
                            ) : null
                          }
                      
                        </TableRow>
                      </TableBody>
                    );
                  })}
                </Table>
              </TableContainer>
              {/* Contents of Tax ends here */}
            </TabPanel>
            <TabPanel value="2">
              <div className="row justify-content-end">
                <Dialog
                  open={openAddForm}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogTitle id="form-dialog-title" className="text-center"> {!editMode ? "Add Statutory Deductions" : "Edit Statutory Deductions"}</DialogTitle>
                  <DialogContent>
                    <AddPension editMode={editMode} penToPass={penToPass} handleCloseForm={handleCloseForm}  />
                  </DialogContent>
                </Dialog>
              </div>
              {/* Contents of SSNIT comes here */}
              <TableContainer className="tax-container" component={Card} style={{maxHeight:"70vh"}}>
                <Table stickyHeader className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>LABEL</TableCell>
                      <TableCell align="center">RATE (%)</TableCell>
                      {
                        roles.canEdit() ? (
                          <TableCell align="right">ACTIONS</TableCell>
                        ) : null
                      }
                    
                    </TableRow>
                  </TableHead>

                  {ssnitState.preloader ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                          <div className="w-100 justify-content-center d-flex text-center">
                            <BounceLoader size={90} color="#cf4f1f" loading />
                          </div>
                        </TableCell>
                    </TableRow>
                  ) : statutoryPension?.data.length <= 0 ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <div className="w-100 justify-content-center d-flex text-center">
                          <p id="" className="">
                            <strong>No data available.</strong>
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : statutoryPension?.data?.map((pensions) => {
                    return (
                      <TableBody>
                        <TableRow key={pensions.id}>
                          <TableCell component="th" scope="row">
                            {pensions.label}
                          </TableCell>
                          <TableCell align="center">
                            {pensions.percentage}
                          </TableCell>
                          {
                            roles.canEdit() ? (
                              <TableCell align="right">
                              <EditIcon
                                   color="primary" className="mr-2 cursor-pointer"
                                   onClick={()=>
                                     {
                                       seteditMode(true)
                                       setPenToPass(pensions)
                                       setOpenAddForm(true);
                                     }
                                   }
                                    />
                             </TableCell>
                            ) : null
                          }
                         
                        </TableRow>
                      </TableBody>
                    );
                  })}
                </Table>
              </TableContainer>
              {/* Contents of SSNIT ends here */}
            </TabPanel>
          </TabContext>
        </div>


      {/* THE DECISON DIALOG BOX STARTS HERE FOR TAX DELETION */}
          <div>
            <Dialog
              open={open1}
              onClose={handleClosePen}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DecisionDialogTax taxToPass={taxToPass}  open1={open1} handleClose={handleClose}/>
            </Dialog>
          </div>

      {/* THE DECISON DIALOG BOX STARTS HERE FOR PENSION DELETION  */}

          <div>
            <Dialog
              open={open}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DecisionDialogPension penToPass={penToPass} handleClosePen={handleClosePen} />
            </Dialog>
          </div>

          <Snackbar
          open={statutories.succuessMessage.openAlert}
          autoHideDuration={3000}
          onClose={() => hanldeSuccesStateAlert(false, "", "")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
          <Alert severity={statutories.succuessMessage.alertType}>{statutories.succuessMessage.message}</Alert>
        </Snackbar>
        <Snackbar
          open={statutories.tax.openAlert}
          autoHideDuration={3000}
          onClose={() => handleAlertState(false, "", "")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={statutories.tax.alertType}>{statutories.tax.message}</Alert>
        </Snackbar>
        <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => handleAlertState(false, '', '')}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert  severity={alertType}>
                {alertMessage}
            </Alert>
        </Snackbar>

      {/* THE DECISON DIALOG BOX ENDS HERE FOR PENSION DELETION */}

    </div>
  );
}

export default StatutoryDeductions;
