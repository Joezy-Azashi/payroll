import React, { useState, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, MenuItem, Snackbar } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import DialogPageLoader from "../Components/DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { logoutUser } from '../Services/auth'
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Collapse } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { addDefinitionsWithThunk, editDefinitionsWithThunk, fetchDefinitionsWithThunk } from "../Services/_redux/definitions/index"
import { definitionsReducer, handleStatusUpdate, handlePreloader } from "../Services/_redux/definitions/definition_slice"
import {getErrorCode} from "../Services/employeeService";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

export default function AddDeductions({defiToPass, editMode, handleClose }) {
    const definitions = useSelector(definitionsReducer)
    const requestState = definitions.request
    const dispatch = useDispatch()

    const [tag, setTag] = useState("");
    const [tagToDisplay, setTagToDisplay] = useState(defiToPass)
    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')
    const [alertOpen, setAlertOpen] = useState(false)
    const [requestDialog, setRequestDialog] = useState(false);
    const [tagType, setTagType] = useState('')
    const [tagTypeTodisplay, settagTypeTodisplay] = useState(defiToPass)
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
    }, 4000)
}

    // FUNCTION FOR THE ALERT DISPLAY
    const handleAlertState = (alertOpen, alertType, alertMessage) => {
    setAlertType(alertType)
    setAlertMessage(alertMessage)
    setAlertOpen(alertOpen)
}

  const handleCloseForm = () => {
    handleClose()
  };


  const handleRequestDialog = () => {
      setRequestDialog(false)
  }

 // FUNCTION TO ADD OR EDIT DEDUCTION DEFINITION
  const addOrUpdate = async () =>{

      if(!editMode){
          addForm()
      }else{
          editForm()
      }
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

  // FUNCTION TO ADD TAGS
  const addForm = async (e) => {
    const addTag = {
      tag,
      tagType
    };
    console.log("addTag", addTag)
    if(addTag.tagType === '' && addTag.tag === ''){
      setAlert({
        open: true,
        message: 'Enter definition type and name',
        severity: 'error'
    })
    closeAlert()
    return
    }else if(addTag.tagType === ''){
      setAlert({
        open: true,
        message: 'Select Definition type',
        severity: 'error'
    })
    closeAlert()
    return
    }else if (addTag.tag === ''){
      setAlert({
        open: true,
        message: 'Enter definition name',
        severity: 'error'
    })
    closeAlert()
    return
    }else{
      await dispatch(addDefinitionsWithThunk(addTag))
      await dispatch(fetchDefinitionsWithThunk())
      await dispatch(handleStatusUpdate({data: null}))
      handleClose()
    }
  };

  useEffect(() => {
    if (definitions.status === 'Failed'){
        if(getErrorCode(definitions.error.error.message).includes('416')) {
            const error = {
                response: {
                    status: 416
                }
            }
            handleErrorResponse(error)
        }
        else if (getErrorCode(definitions.error.error.message).includes('401')) {
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
}, [definitions.status]);

   // FUNCTION TO EDIT TAGS
  const editForm = async () => {
    const editTag = {
      tagId: defiToPass.tagId,
      tag: (tag === "") ? defiToPass.tag : tag,
      tagType: (tagType === "") ? defiToPass.tagType : tagType
    };

    

    await dispatch(editDefinitionsWithThunk(editTag))
    await dispatch(fetchDefinitionsWithThunk())
    handleClose()
  };

  return (
    <div>
      
      <form >
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
          <Grid item xs={12} className="mb-2 mt-2">
              <InputLabel id="demo-simple-select-outlined-label">
                Select Definition Type
              </InputLabel>
              <Select
                style={{height: "39px"}}
                variant="outlined"
                className="label-length"
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                size="small"
                defaultValue={tagTypeTodisplay.tagType || ""}
                onChange={(e) => {setTagType(e.target.value)
                }}
              >
                {/* <MenuItem value="">
                {!editMode ? <em>None</em> : ''}
                </MenuItem> */}
                <MenuItem value="Bonus">
                  Bonus
                </MenuItem>
                <MenuItem value="Allowance">
                  Allowance
                </MenuItem>
                <MenuItem value="Deduction">
                  Deductions
                </MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                type="text"
                className="label-length"
                label="Name"
                id="outlined-size-small"
                variant="outlined"
                size="small"
                defaultValue={tagToDisplay.tag || ''}
                onChange={(e) => {
                  setTag(e.target.value);
                }}
              />
            </Grid>
          </Grid>
          <div className="row w-100 p-1 m-1 justify-content-center text-center mt-3">
          <div className="col-12 text-center">
             <Button color="primary" className="btn-amalitech mr-2" onClick={handleCloseForm}  >
                Cancel
            </Button>
            <Button  color="primary" className="btn-amalitech ml-2" onClick={() => {
              addOrUpdate()
              
            }} >
             { (!editMode)? "Add":'Update'} 
              
            </Button>
            </div>
            </div>
        </div>
      </form>

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
