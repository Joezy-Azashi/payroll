import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Collapse, FormControl, IconButton } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import CloseIcon from '@material-ui/icons/Close';
import DialogPageLoader from "../Components/DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { MenuItem } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import { logoutUser } from '../Services/auth';
import { useDispatch, useSelector } from "react-redux";
import { addTaxWiththunk, editTaxWthThunk, fetchTaxWithThunk } from "../Services/_redux/statutory/index"
import { statutoryReducer, handleStatusUpdate } from "../Services/_redux/statutory/statutory_slice"
import {getErrorCode} from "../Services/employeeService";



export default function AddTax({ editMode, taxToPass, handleCloseForm }) {
  const dispatch = useDispatch(statutoryReducer)
  const statutories = useSelector(statutoryReducer)
  const requestState = statutories.request

  const [label, setLabel] = useState("");
  const [amount, setAmout] = useState("");
  const [percentage, setPercentage] = useState("");
  const [openAddForm, setOpenAddForm] = useState(false);
  const [taxDisplay, settaxDisplay] = useState(taxToPass);
  const [requestDialog, setRequestDialog] = useState(false);
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)
  const [value, setValue] = useState("1");

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
})

const closeAlert = () => {
  setTimeout(() => {
      setAlert({
          open: false,
          message: '',
          severity: ''
      })
  }, 3000)
}

  const handleCloseForm1 = () => {
    handleCloseForm();
  };

  const handleAlertState = (alertOpen, alertType, alertMessage) => {
    setAlertType(alertType)
    setAlertMessage(alertMessage)
    setAlertOpen(alertOpen)
}

  const handleRequestDialog = () => {
    setRequestDialog(false)
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

  const addOrUpdate = async () => {
    if (!editMode) {
      addForm();
    } else {
      editForm();
    }
  };

  // FUNCTION TO ADD TAX
  const addForm = async (e) => {
    const taxCreate = []
    const tax = {
      amount,
      label,
      percentage
    };
    taxCreate.push(tax)
    if(tax.amount === '' || tax.label === ''){
      setAlert({
        open: true,
        message: 'Label and Income feilds cannot be empty',
        severity: 'error'
    })
    closeAlert()
    }else{
      await dispatch(addTaxWiththunk(taxCreate))
      await dispatch(fetchTaxWithThunk())
      await dispatch(handleStatusUpdate({data: null}))
      handleCloseForm1()
    }
  };

    // FUNCTION TO EDIT TAX
  const editForm = async () => {
    const tax = {
      id: taxToPass.id,
      amount: amount === "" ? taxDisplay.amount : amount,
      label: label === "" ? taxDisplay.label : label,
      percentage: percentage === "" ? taxDisplay.percentage : percentage,
    };
    await dispatch(editTaxWthThunk(tax))
    await dispatch(fetchTaxWithThunk())
    await dispatch(handleStatusUpdate({data: null}))
    handleCloseForm1()
  };

  useEffect(() => {
    setValue(1)
  }, [value,])

  return (
    <div>
      <form onSubmit={addForm}>
      <div>
                    <Collapse in={alert.open}>
                    <Alert
                        severity={`${alert.severity}`}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setAlert({
                                        open: false,
                                        message: '',
                                        severity: ''
                                    });
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        {alert.message}
                    </Alert>
                    </Collapse>
                </div>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {!editMode ? (
                <FormControl variant="outlined" fullWidth>
                <InputLabel id="label">Label</InputLabel>
                <Select
                style={{height: "40px"}}
                  id="label"
                  defaultValue={taxDisplay.label}
                  onChange={(e) => {setLabel(e.target.value)
                  }}
                  label="Age"
                >
                <MenuItem value="Level 1">Level 1</MenuItem>
                <MenuItem value="Level 2">Level 2</MenuItem>
                <MenuItem value="Level 3">Level 3</MenuItem>
                <MenuItem value="Level 4">Level 4</MenuItem>
                <MenuItem value="Level 5">Level 5</MenuItem>
                <MenuItem value="Level 6">Level 6</MenuItem>
                </Select>
              </FormControl>
              ) : (

              <OutlinedInput
              style={{height: "40px"}}
              id="label"
              label="Label"
              variant="outlined"
              defaultValue={taxDisplay.label}
              fullWidth
              disabled
              />
              )}
              
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-amount">Income</InputLabel>
          <OutlinedInput
          style={{height: "40px"}}
            id="income"
            defaultValue={taxDisplay.amount || ""}
            onChange={(e) => {
              setAmout(e.target.value);
            }}
            startAdornment={<InputAdornment position="start">GH&#162;</InputAdornment>}
            labelWidth={60}
          />
        </FormControl>
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
              fullWidth
                label="Rate (%)"
                id="outlined-size-small"
                variant="outlined"
                size="small"
                defaultValue={parseFloat(taxDisplay.percentage) || 0}
                onChange={(e) => {
                  setPercentage(e.target.value);
                }}
              />
            </Grid>
          </Grid>
          <div className="row mt-3 mb-2">
            <div className="col-md-6">
              <Button onClick={handleCloseForm1} className="btn-amalitech float-right" color="primary">
                Cancel
              </Button>
            </div>
            <div className="col-md-6">
              <Button 
                onClick={addOrUpdate}
               color="primary"
               className="btn-amalitech float-left"
               >
                {!editMode ? "Add" : "Update"}
              </Button>
              </div>
          </div>
        </div>
      </form>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => handleAlertState(false, "", "")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alertType}>{alertMessage}</Alert>
      </Snackbar>
      <Dialog
          open={requestState.preloader}
          onClose={() => handleRequestDialog()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
          disableBackdropClick                    
              ><DialogPageLoader />
              {requestState.preloader}
      </Dialog>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => handleAlertState(false, '', '')}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert  severity={alertType}>
                {alertMessage}
            </Alert>
        </Snackbar>
    </div>
  );
}
