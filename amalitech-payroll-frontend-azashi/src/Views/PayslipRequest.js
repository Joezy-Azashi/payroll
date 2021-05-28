import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { Alert } from '@material-ui/lab';
import "../index.css";
import { FormControl, Button, Input, Snackbar, InputAdornment } from '@material-ui/core';
import Api from "../Services/api";
import EmailIcon from '@material-ui/icons/Email';


function PayslipRequest() {

const [email, setGetEmail] = useState('');
const [alertType, setAlertType] = useState('success')
const [alertMessage, setAlertMessage] = useState('')
const [alertOpen, setAlertOpen] = useState(false)

    /*open and close alert*/
    const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }
    const emailkey = email.toLocaleLowerCase()

//   FUNCTION TO SEND EMAIL
  const sendEmail = async (e) => {
    e.preventDefault()
    const senderMail = {
        email: emailkey,
        url: `${window.location.protocol}//${window.location.host}/download`
    };

    const emailSent = await Api().post(`/payrolls/request-payroll-link/`, senderMail)
    .then((response) => {
        handleAlertState(true, 'success', 'Email sent successfully, Please follow the link in your email')
    }).catch((error) => {
        const message = error.response.status === 401 ? 'Unauthorised Access' : 'Sorry! could not send request'
        handleAlertState(true, 'error', message)
    })
}

    return (
        <div>
            <Card className="cardStyling">
                <div className="w-100 mx-4">
                    <div className="mb-5 mt-0">
                        <h4>Payslip Request Form</h4>
                    </div>
                    <div className="">
                        <h6>Please enter you email address</h6>
                    </div>

                    <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => handleAlertState(false, '', '')}
                      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            >
                        <Alert  severity={alertType}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>

                    {/* PAYSLIP REQUEST FORM */}
                    <form onSubmit={sendEmail}>
                            <Grid item md="12" lg="12" sm="12" xs="12" className="">
                                <FormControl
                                    size="small" 
                                    fullWidth="true"
                                    className="formBackground pl-2"
                                    >
                                    <Input
                                     startAdornment={
                                        <InputAdornment position="start">
                                          <EmailIcon color="primary" />
                                        </InputAdornment>
                                      }
                                        InputProps={{ disableUnderline: true}}
                                        label=""
                                        placeholder="e.g. abc@amalitech.com"
                                        value={email}
                                        className="px-2"
                                        onChange={(e) => {
                                            setGetEmail(e.target.value)
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={12} lg={12} sm={12} xs={12}>
                                <Button
                                    className="text-capitalize btn-amalitech mr-2 mt-5"
                                    variant="contained"
                                    size="small"
                                    type="submit"
                                    >
                                    Send Request
                                </Button>
                            </Grid>
                    </form>
                </div>
            </Card>
            
        </div>
    )
}

export default PayslipRequest;
