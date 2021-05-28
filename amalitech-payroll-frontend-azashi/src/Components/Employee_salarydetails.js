import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import {Alert} from "@material-ui/lab";
import {Collapse, IconButton} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export default function Employee_salarydetails ({selectedEmployee, updateData} ){
  const [open, setOpen] = React.useState(false);
  const [updateDataIn, setUpdateDataIn] = React.useState();

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'

    })
  const handleClose = () => {
    setOpen(false);
  };

    return (
        <div className="dialog-width">
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
          <div>
            <input
              id="name"
              type="text"
              className="form-control mb-4"
            value={`${selectedEmployee.firstName} ${selectedEmployee.otherNames} ${selectedEmployee.surname}`}
            disabled
            />
          </div>
          <div className="row justify-content-between">
            <div className="ml-3">
              <TextField
              className="form-control"
              defaultValue={`${selectedEmployee.basicSalary}`}
              fullWidth
              />
            </div>
            <div className="mr-3">
              <TextField
              className="form-control"
              defaultValue={selectedEmployee.tierTwoNumber}
              fullWidth
              />
            </div>
          </div>
        <DialogActions className="mt-4">
          <Button onClick={handleClose} className="employeesalary-savebtn">
            Save
          </Button>
        </DialogActions>
        </div>
    )
}