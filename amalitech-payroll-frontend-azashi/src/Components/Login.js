import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button, IconButton, Collapse } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import {blue} from "@material-ui/core/colors";
import * as auth from '../Services/auth'
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailIcon from '@material-ui/icons/Email';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import {  useLocation, useHistory } from 'react-router-dom'
import Input from '@material-ui/core/Input';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import clsx from 'clsx';
import DialogPageLoader from "../Components/DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import {NavLink} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(2),
            width: '80%',
        },
        background_color: blue,
        padding: "12px"
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginTop: '30px',
        color: '#cf4f1f'
    },
    btnAmalitech: {
        backgroundColor: '#cf4f1f',
        color: '#ffffff'
    },
    textAmalitech: {
    color: '#cf4f1f'
}
}));
function Login(props) {
    let location = useLocation()
    const history = useHistory()
    const classes = useStyles()
    const { register, handleSubmit, errors, control } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
    });
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    })

    const [loginpass, setLoginpass] = useState(loginForm.password)

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'

    })
    const [requestDialog, setRequestDialog] = useState(false);
    const handleRequestDialog = () => {
        setRequestDialog(false)
    }

    const handleClickShowPassword = () => {
        setLoginpass({ ...loginpass, showPassword: !loginpass.showPassword });
      };

      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

    // change event handler
    const handleChange = evt => {
        const { name, value: newValue, type } = evt.target;

        // keep number fields as numbers
        const value = type === 'number' ? +newValue : newValue;

        // save field values
        setLoginForm({
            ...loginForm,
            [name]: value,
        });
    };

    //close alert after 8 seconds
    const closeAlert = () => {
        setTimeout(() => {
            setAlert({
                open: false,
                message: '',
                severity: ''
            })
        }, 8000)
    }

    //function to send login details to backend
    const onSubmit = () => {
        setRequestDialog(true)
        const loginDetails = {
            email : loginForm.email.toLowerCase(),
            password : loginForm.password
        }

        if(loginForm.email === '' && loginForm.password === ''){
            setAlert({
                open: true,
                message: 'Email and password fields cannot be empty',
                severity: 'error'
            })
            closeAlert()
            setRequestDialog(false)
        }else if (loginForm.email === ''){
            setAlert({
                open: true,
                message: 'Email field cannot be empty',
                severity: 'error'
            })
            closeAlert()
            setRequestDialog(false)
        }else if(loginForm.password === ''){
            setAlert({
                open: true,
                message: 'Password field cannot be empty',
                severity: 'error'
            })
            closeAlert()
            setRequestDialog(false)
        }else if (loginForm.password.length < 6){
            setAlert({
                open: true,
                message: 'Password must be 6 characters or more',
                severity: 'error'
            })
            closeAlert()
            setRequestDialog(false)
        }else{
        auth.loginUser(loginDetails).then((response) => {
            setRequestDialog(false)
            setAlert({
                open: true,
                message: 'Login Successful. Please Wait...',
                severity: 'success'
            })
            closeAlert()
            setTimeout(() => {
                window.location = location?.state?.from?.pathname || '/employee'
                // window.location.assign(url)
            }, 1000)
        }
        ).catch((error) => {
            if(error?.response?.data === 'Your account is disabled! contact super admin.'){
                setAlert({
                    open: true,
                    message: 'Your account is disabled! contact super admin.',
                    severity: 'error'
                })
                closeAlert()
                setRequestDialog(false)
            }
            else{
                setRequestDialog(false)
            setAlert({
                open: true,
                message: 'Invalid Email or Password',
                severity: 'error'
            })
            closeAlert()
            }
        })
    }
    }
    return (
        <div>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <h3 className={classes.textAmalitech}>AMALITECH PAYROLL</h3>
                <small>Welcome! Please enter your credentials to login</small>
                <div>
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
                </div>
                <div className="row">
                        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined" fullWidth>
                         <InputLabel htmlFor="outlined-adornment-password"> Email</InputLabel>
                            <Input
                             startAdornment={
                                <InputAdornment position="start">
                                  <EmailIcon />
                                </InputAdornment>
                              }
                         
                                        value={loginForm.email}
                                        id="email"
                                        type="email"
                                        onChange={(event) => handleChange(event)}
                                        name="email"
                                        required
                                        className={classes.textField}
                                    />
                            </FormControl>
                        
                </div>
                <div className="row">
                        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined" fullWidth>
                         <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <Input
                         startAdornment={
                            <InputAdornment position="start">
                              <LockOpenIcon />
                            </InputAdornment>
                          }
                                        type={loginpass.showPassword ? 'text' : 'password'}
                                        value={loginForm.password}
                                        onChange={(event) => handleChange(event)}
                                        name="password"
                                        required
                                        autoComplete="current-password"
                                        className={classes.textField}
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            >
                                            {loginpass.showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                    />
                            </FormControl>
                </div>
                <div className="row pt-5">
                    <div className="col-12">
                        <Button color={"primary"} type="submit" variant="contained" className={classes.btnAmalitech}>
                            Login
                        </Button>
                    </div>
                </div>
            </form>
            <NavLink className="forgotpassword" to={'/forgotpassword'}>Forgot Password?</NavLink>

            {/* page loader dialog */}
            <Dialog
          open={requestDialog}
          onClose={handleRequestDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
          disableBackdropClick                    
              ><DialogPageLoader />
        </Dialog>
        </div>
    );
}

export default Login;