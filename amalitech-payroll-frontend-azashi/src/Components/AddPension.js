import React, { useState} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Alert } from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import DialogPageLoader from "../Components/DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import { logoutUser } from '../Services/auth'
import { useDispatch, useSelector } from "react-redux";
import { addSsnitWithThunk, editSsnitWithThunk, fetchSsnitWithThunk } from "../Services/_redux/statutory/index"
import { statutoryReducer, handleStatusUpdate } from "../Services/_redux/statutory/statutory_slice"


export default function AddPension({ editMode, penToPass, handleCloseForm }) {
  const dispatch = useDispatch(statutoryReducer)
  const statutories = useSelector(statutoryReducer)
  const requestState = statutories.request

  const [label, setLabel] = useState("");
  const [percentage, setPercentage] = useState("");
  const [penDisplay, setPenDisplay] = useState(penToPass);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [requestDialog, setRequestDialog] = useState(false);

  // FUNCTION FOR THE ALERT DISPLAY
  const handleAlertState = (alertOpen, alertType, alertMessage) => {
    setAlertType(alertType);
    setAlertMessage(alertMessage);
    setAlertOpen(alertOpen);
  };

  const handleCloseForm1 = () => {
    handleCloseForm();
  };

  const handleRequestDialog = () => {
    setRequestDialog(false)
}
  // FUNCTION TO ADD OR EDIT PENSION
  const addOrUpdate = async () => {
    if (!editMode) {
      addForm();
    } else {
      editForm();
    }
  };

  // FUNCTION TO ADD PENSION
  const addForm = async () => {
    const tax = {
      label,
      percentage,
    };
    await dispatch(addSsnitWithThunk(tax))
    await dispatch(fetchSsnitWithThunk())
    await dispatch(handleStatusUpdate({data: null}))
    handleCloseForm1()
  };

  // FUNCTION TO EDIT PENSION
  const editForm = async (e) => {
    const tax = {
      id: penDisplay.id,
      label: label === "" ? penDisplay.label : label,
      percentage: percentage === "" ? penDisplay.percentage : percentage,
    };
    await dispatch(editSsnitWithThunk(tax))
    await dispatch(fetchSsnitWithThunk())
    await dispatch(handleStatusUpdate({data: null}))
    handleCloseForm1()
  };


  return (
    <div>
      <form onSubmit={addForm}>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={6}>
              <TextField
                label="Label"
                id="outlined-size-small"
                variant="outlined"
                size="small"
                disabled
                value={penDisplay.label || ""}
                onChange={(e) => {
                  setLabel(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                label="Rate (%)"
                id="outlined-size-small"
                variant="outlined"
                size="small"
                defaultValue={penDisplay.percentage || ""}
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
            <div className="col-md-6 ">
              <Button onClick={addOrUpdate} className="btn-amalitech float-left" color="primary">
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
          onClose={handleRequestDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
          disableBackdropClick                    
              ><DialogPageLoader />
               {requestState.preloader}
      </Dialog>
    </div>
  );
}
