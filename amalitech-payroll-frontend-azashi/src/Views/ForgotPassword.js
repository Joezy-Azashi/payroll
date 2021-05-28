import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailIcon from '@material-ui/icons/Email';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import Input from '@material-ui/core/Input';
import {NavLink} from 'react-router-dom'
import DialogPageLoader from "../Components/DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import Snackbar from "@material-ui/core/Snackbar";
import {useDispatch, useSelector} from "react-redux"
import {emailPostWithThunk} from '../Services/_redux/forgot-password/index'
import {resetPasswordReducer,handleStatusUpdate, hanldeSuccesState, hanldeErrorState} from "../Services/_redux/forgot-password/forgot_slice"


const useStyles = makeStyles({
    textChangepassword: {
        color: '#cf4f1f',
        marginBottom: "40px"
    },
    textField: {
        marginBottom: '40px'
      },
      cardWidth: {
        padding: "20px"
    }
  });

function ForgotPassword (){

    const classes = useStyles();

    const forgotPassword = useSelector(resetPasswordReducer)
    const dispatch = useDispatch()
      const [email, setEmail] = React.useState('')
      const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'
    })

    const hanldeSuccesStateAlert = (openAlert, alertType, message) => {
        dispatch(hanldeSuccesState({ openAlert, alertType, message }))
      }

      const hanldeErrorStateAlert = (openAlert, alertType, message) => {
        dispatch(hanldeErrorState({ openAlert, alertType, message }))
      }

      //function to post email and url to backend
    const sendEmailLink = async (e) => {
    e.preventDefault()
    const data = {
        email: email,
        url: `${window.location.protocol}//${window.location.host}/set-new-password`
    }
    await dispatch(emailPostWithThunk(data))
    dispatch(handleStatusUpdate({data: null}))
}

    return(
        <div className={"container-fluid"} style={{height: '100vh'}}>
            <div className="row justify-content-center d-flex align-items-center" style={{height: '100vh'}}>
                <form className="col-md-4" onSubmit={sendEmailLink}>
                    <Card className={classes.cardWidth}>
                        <CardContent className={classes.cardContentStyle}>
                            <h3 className={classes.textChangepassword}>FORGOT PASSWORD</h3>

                            {/* alert to display messages to the user */}
                            <div>
                                <Collapse in={alert.open}>
                                <Alert
                                className="mb-3"
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
                            <Input
                             startAdornment={
                                <InputAdornment position="start">
                                  <EmailIcon color='primary'/>
                                </InputAdornment>
                              }
                                id="email"
                                label="Email"
                                fullWidth
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                            />
                        </CardContent>
                        <div className="row justify-content-center d-flex changepasswordbtn">
                            <CardActions>
                                <NavLink className="navLink" to={'/'}>
                                <Button size="small" type="submit" variant="contained">
                                        Cancel
                                </Button>
                                </NavLink>
                                <Button
                                    size="small" 
                                    color={"primary"}
                                    type="submit" 
                                    variant="contained"
                                    onClick={sendEmailLink}
                                  >
                                    OK
                                </Button>
                            </CardActions>
                        </div>
                    </Card>
                </form>
                <Snackbar
                    open={forgotPassword.successMessage.openAlert}
                    autoHideDuration={6000}
                    onClose={() => hanldeSuccesStateAlert(false, "", "")}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert severity={forgotPassword.successMessage.alertType}>{forgotPassword.successMessage.message}</Alert>
                </Snackbar>
                <Snackbar
                    open={forgotPassword.errorMessage.openAlert}
                    autoHideDuration={6000}
                    onClose={() => hanldeErrorStateAlert(false, "", "")}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert severity={forgotPassword.errorMessage.alertType}>{forgotPassword.errorMessage.message}</Alert>
                </Snackbar>
            </div>
            <Dialog
          open={forgotPassword.request.preloader}
        //   onClose={handleRequestDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
          disableBackdropClick                    
              ><DialogPageLoader />
        </Dialog>
        </div>
    )
}

export default ForgotPassword