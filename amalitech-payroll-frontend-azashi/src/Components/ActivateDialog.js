import React, { useEffect, useState} from 'react'
import {Button, DialogContent, Typography, Snackbar} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import {userStatusWithThunk,fetchAllUsersWithThunk} from "../Services/_redux/Users/index";
import {userReducer} from "../Services/_redux/Users/users_slice";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogPageLoader from "../Components/DialogPageLoader";
import {getErrorCode} from "../Services/employeeService";
import {logoutUser} from "../Services/auth";

function ActivateDialog( { handleClose, active }) {
    const user = useSelector(userReducer);
    const dispatch = useDispatch();
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')
    const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }

    const closeDialog = () => {
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

    // FUNCTION TO ACTIVATE AND DEACTIVATE USER
    const Activate = async () => {
        const data = {
            active : !active.active,
            currentEmail: active.email
        }
         await dispatch(userStatusWithThunk(data))
         await dispatch(fetchAllUsersWithThunk())
         closeDialog()

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
            <DialogContent className="text-center">
          <Typography className="text-center">
            {active.active === true ? "Are you sure you want to deactivate account?" : "Are you sure you want to activate account?"}
          </Typography>
          <div className="row justify-content-center mt-4 mb-3">
            <div>
              <Button
                className="text-capitalize btn-amalitech mr-2"
                variant="contained"
                size="small"
                type="submit"
                onClick={closeDialog}
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button
                className="text-capitalize btn-amalitech ml-2"
                variant="contained"
                size="small"
                type="submit"
                onClick={Activate}
              >
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
        <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => handleAlertState(false, '', '')}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert  severity={alertType}>
                {alertMessage}
            </Alert>
        </Snackbar>
        <Dialog
        open={user.preloader}
        fullWidth
        maxWidth="xs"
        disableBackdropClick
        >
          <DialogPageLoader />
        </Dialog>
        </div>
    )
}

export default ActivateDialog
