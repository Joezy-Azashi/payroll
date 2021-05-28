import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import Typography from "@material-ui/core/Typography";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import DialogPageLoader from "../Components/DialogPageLoader";
import DialogContent from "@material-ui/core/DialogContent";
import { useDispatch, useSelector } from "react-redux";
import { deleteDefinitionsWithThunk, fetchDefinitionsWithThunk } from "../Services/_redux/definitions/index"
import { definitionsReducer, handleStatusUpdate } from "../Services/_redux/definitions/definition_slice"

function DecisionDialogDeduc({ defiToPass, handleClose }) {
  const definitions = useSelector(definitionsReducer)
  const requestState = definitions.request
  const dispatch = useDispatch()
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)

  const handleAlertState = (alertOpen, alertType, alertMessage) => {
    setAlertType(alertType)
    setAlertMessage(alertMessage)
    setAlertOpen(alertOpen)
}
  const handleClosePen = () => {
    handleClose()
  };

  const handleRequestDialog = () => {
    
  }

  // FUNCTION TO DELETE TAG
  const deleteTag = async (id) => {
    await dispatch(deleteDefinitionsWithThunk({ data: defiToPass.tagId}))
    await dispatch(fetchDefinitionsWithThunk())
    await dispatch(handleStatusUpdate({data: null}))
    handleClosePen()
  };

  return (
    <div>
      <DialogContent >
      <Typography className="text-center">
          Are you sure you want to delete this record?
        </Typography>
        <div className="row text-center mt-3">
          <div className="col-md-6">
            <Button onClick={handleClosePen} className="float-right btn-amalitech" color="primary">No</Button>
          </div>
          <div className="col-md-6">
            <Button
                  className="float-left btn-amalitech"
                  color="primary"
                  onClick={(e) => {
                    deleteTag(defiToPass.tagId);
                  }}
              >
                Yes
              </Button>
          </div>
        </div>

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
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => handleAlertState(false, "", "")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alertType}>{alertMessage}</Alert>
      </Snackbar>
      </DialogContent>
    </div>
  );
}

export default DecisionDialogDeduc;
