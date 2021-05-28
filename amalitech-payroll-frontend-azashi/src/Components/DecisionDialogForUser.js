import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import Snackbar from "@material-ui/core/Snackbar";
import DialogPageLoader from "../Components/DialogPageLoader";
import DialogContent from "@material-ui/core/DialogContent";
import { Alert } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import {
  userReducer,
  hanldeSuccesState,handleStatusUpdate
} from "../Services/_redux/Users/users_slice";
import { deleteUserWithThunk, fetchAllUsersWithThunk } from "../Services/_redux/Users/index";
import {getErrorCode} from "../Services/employeeService";
import {logoutUser} from "../Services/auth";

function DecisionDialogForUser({ handleClose, users }) {
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
    handleClose();
  };

  //function to handle errors
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


  // FUNCTION TO DELETE USERS IN THE SYSTEM
  const userDelete = async () => {
      const data = [
        users.uid
      ]
    await dispatch(deleteUserWithThunk(data))
    await dispatch(fetchAllUsersWithThunk())
    await dispatch(handleStatusUpdate({data: null}))
    closeDialog()
  };

  const hanldeSuccesStateAlert = (openAlert, alertType, message) => {
    dispatch(hanldeSuccesState({ openAlert, alertType, message }));
  };

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
          Are you sure you want to delete user?
        </Typography>
        <div className="row justify-content-center mt-4 mb-3">
          <div className="col-md-12">
            <Button
              className="text-capitalize btn-amalitech mr-2"
              variant="contained"
              size="small"
              onClick={closeDialog}
            >
              NO
            </Button>
            <Button
              className="text-capitalize btn-amalitech ml-2"
              variant="contained"
              size="small"
              type="submit"
              onClick={(e) => {
                userDelete(users.uid);
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* page loader dialog */}
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
      <Snackbar
        open={user.successMessage.openAlert}
        // autoHideDuration={6000}
        onClose={() => hanldeSuccesStateAlert(false, "", "")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={user.successMessage.alertType}>
          {user.successMessage.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default DecisionDialogForUser;
