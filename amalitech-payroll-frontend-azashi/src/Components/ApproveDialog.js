import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import {Snackbar} from '@material-ui/core';
import { getCurrentUser, logoutUser } from '../Services/auth'
import Api from "../Services/api";
import {Alert} from "@material-ui/lab";

function AuthorizeDialog( {closeApproveDialog}) {

    const [uuid, setUuid] = useState(getCurrentUser())
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')

    const logout = () => {
        logoutUser()
        window.location.assign('/')
  
    }

    const closeDialog = () => {
        closeApproveDialog()
    }

       /*open and close alert*/
       const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }

     // APPROVE FOR PAYMENT OF SALARIES
    const ApproveSalary = async () => {
        const approveData = {
            approve: true,
            approvedBy: uuid.uid
        }
        const approval = await Api().patch('/payrolls/approve', approveData )
        .then((response) => {
            handleAlertState(
                true,
                "success",
                "Approval For Payment Of Salary Has Been Activated Successfully."
              );
        }).catch((error) => {
           if(error = "Request failed with status code 416"){
            handleAlertState(
                true,
                "error",
                "Sorry, Approval Can Not Be Performed As At Now."
              );
              setTimeout(() => {
                logout()
              }, 1000)
           }else{
            handleAlertState(
                true,
                "error",
                "Error Approving This Month Salary Disbursement."
              );
           }
        })
        setTimeout(() => {
            window.location.reload();
          }, 2000);
    }
  return (
    <div>
      <DialogContent className="text-center">
        <Typography className="text-center">
          Are you sure you want to approve this month's payroll?
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
              onClick={ApproveSalary}
            >
              Yes
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
    </div>
  );
}

export default AuthorizeDialog;
