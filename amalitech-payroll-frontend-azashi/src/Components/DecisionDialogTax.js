import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Alert } from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { deleteTaxWithThunk, fetchTaxWithThunk } from "../Services/_redux/statutory/index"
import { statutoryReducer, handleStatusUpdate } from "../Services/_redux/statutory/statutory_slice"
import Typography from "@material-ui/core/Typography";

function DecisionDialog({ taxToPass, handleClose }) {
  const dispatch = useDispatch(statutoryReducer)
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const handleAlertState = (alertOpen, alertType, alertMessage) => {
    setAlertType(alertType);
    setAlertMessage(alertMessage);
    setAlertOpen(alertOpen);
  };

  const closeDialog = () => {
    handleClose();
  };


  // FUNCTION TO DELETE TAXES
  const deleteTax = async (id) => {
    const data = {
      id: taxToPass.id,
    };
    await dispatch(deleteTaxWithThunk({ data: data }))
    await dispatch(fetchTaxWithThunk())
    await dispatch(handleStatusUpdate({data: null}))
    closeDialog()
  };

  return (
    <div style={{padding: "20px"}}>
      <Typography className="mt-2">
        Are you sure you want to delete this record?
      </Typography>
      <div className="row w-100 p-0 m-0 justify-content-center text-center mt-4">
        <div className="col-12 text-center">
          <Button onClick={closeDialog} color="primary" className="btn-amalitech mr-2">
            No
          </Button>
          <Button
          className="btn-amalitech ml-2"
            color="primary"
            onClick={(e) => {
              deleteTax(taxToPass.id);
            }}
          >
            Yes
          </Button>
        </div>
      </div>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => handleAlertState(false, "", "")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alertType}>{alertMessage}</Alert>
      </Snackbar>
    </div>
  );
}

export default DecisionDialog;
