import React, {useEffect, useState} from 'react'
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { Collapse, IconButton, Snackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import EmailIcon from '@material-ui/icons/Email';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogPageLoader from "../Components/DialogPageLoader";
import { useDispatch, useSelector } from "react-redux";
import {logoutUser} from "../Services/auth";
import {getErrorCode} from "../Services/employeeService";
import {userReducer,handleStatusUpdate} from "../Services/_redux/Users/users_slice";
import {editUserWithThunk, fetchAllUsersWithThunk} from "../Services/_redux/Users/index";

function EditUserDialog({edittopass, handleClose}) {

    const user = useSelector(userReducer);
    const dispatch = useDispatch();
    const [editUser, setEditUser] = useState(edittopass)
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [role, setRole] = useState("")
    const [alert, setAlert] = useState({
      open: false,
      message: '',
      severity: 'success'
  })
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const handleAlertState = (alertOpen, alertType, alertMessage) => {
      setAlertType(alertType)
      setAlertMessage(alertMessage)
      setAlertOpen(alertOpen)
  }

    const closeEdit = () => {
      handleClose()
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

// FUNCTION TO EDIT USERS ON THE SYSTEM
    const editPost = async (e) => {
        e.preventDefault()
        const editdetails = {
          name: name === '' ? editUser.name : name,
          currentEmail: editUser.email,
          newEmail : email === "" ? editUser.email : email,
            role: [
                {
                  role: role === "" ? editUser.roles[0].role : role
                }
              ],
        }
        await dispatch(editUserWithThunk(editdetails))
        await dispatch(fetchAllUsersWithThunk());
        await dispatch(handleStatusUpdate({ data : null}))
        closeEdit()
    }

    useEffect(() => {
      if (user.status === 'Failed'){
          if(getErrorCode(user.error.error.message).includes('416')) {
              const error = {
                  response: {
                      status: 416
                  }
              }
              handleErrorResponse(error)
          }
          else if (getErrorCode(user.error.error.message).includes('401')) {
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
  }, [user.status]);


    return (
        <div>
      <div style={{ padding: "30px" }}>
        <DialogTitle className="row justify-content-center mb-4">Edit User</DialogTitle>
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
        <DialogContent>
          <form onSubmit={editPost}>
            <div className="row mb-5">
              <div className="col-md-12">
              <InputLabel>Email</InputLabel>
            <Input
                startAdornment={
                  <InputAdornment position="start">
                    <EmailIcon color="primary"/>
                  </InputAdornment>
                }
                  id="email"
                  label="Email"
                  fullWidth
                  defaultValue={editUser?.email || email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-5">
              <InputLabel>Name</InputLabel>
                <Input
                startAdornment={
                  <InputAdornment position="start">
                    <PermContactCalendarIcon color="primary"/>
                  </InputAdornment>
                }
                  id="name"
                  label="Name"
                  fullWidth
                  defaultValue={editUser?.name || name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
              <InputLabel>Role</InputLabel>
                <FormControl fullWidth>
                  <Select
                    startAdornment={
                      <InputAdornment position="start">
                        <GroupAddIcon color="primary"/>
                      </InputAdornment>
                    }
                    className=""
                    size="small"
                    defaultValue={editUser?.roles[0]?.role || role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="MANAGER">Manager</MenuItem>
                    <MenuItem value="ACCOUNTANT">Accountant</MenuItem>
                    <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                    <MenuItem value="SENIOR_ACCOUNTANT">
                      Senior Accountant
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="row justify-content-center mt-3">
              <Button
                className="text-capitalize btn-amalitech mt-4"
                variant="contained"
                size="small"
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </div>
      <Dialog
        open={user.request.preloader}
        fullWidth
        maxWidth="xs"
        disableBackdropClick
      >
        <DialogPageLoader />
      </Dialog>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => handleAlertState(false, '', '')}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert  severity={alertType}>
                {alertMessage}
            </Alert>
        </Snackbar>
    </div>
    )
}

export default EditUserDialog
