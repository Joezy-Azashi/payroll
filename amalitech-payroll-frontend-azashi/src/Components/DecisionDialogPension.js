import React, {useState} from "react";
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import { useDispatch, useSelector } from "react-redux";
import { deleteSsnitWithThunk, fetchSsnitWithThunk } from "../Services/_redux/statutory/index"
import { statutoryReducer, handleStatusUpdate } from "../Services/_redux/statutory/statutory_slice"


function DecisionDialog({penToPass, handleClosePen}) {
    const dispatch = useDispatch(statutoryReducer)

    const handleClosePenDialog = () => {
      handleClosePen()
      };

    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')
    const [alertOpen, setAlertOpen] = useState(false)

      const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }

    // FUNCTION TO DELETE PENSION
    const deletePension = async (id) => {
    const data = {
        id : penToPass.id
    }
    await dispatch(deleteSsnitWithThunk({data:data}))
    await dispatch(fetchSsnitWithThunk())
    await dispatch(handleStatusUpdate({data: null}))
    handleClosePenDialog()
  }


  return (
    <div>
      <DialogTitle id="alert-dialog-title">
        {"Are you sure you want to delete this record?"}
      </DialogTitle>
      <DialogActions>
      <Button onClick={handleClosePenDialog} color="primary">
            No
        </Button>
        <Button
            color="primary"
            autoFocus
            onClick={(e) => {
              deletePension( penToPass.id )
            }}
        >
            Yes
        </Button>
      </DialogActions>
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

export default DecisionDialog;
