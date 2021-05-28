import React, {  useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import InputAdornment from '@material-ui/core/InputAdornment';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import InputLabel from '@material-ui/core/InputLabel';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import {NavLink} from 'react-router-dom'
import {getCurrentUser, logoutUser} from '../Services/auth'
import DialogPageLoader from "../Components/DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import Snackbar from "@material-ui/core/Snackbar";
import {useDispatch, useSelector} from "react-redux"
import {ChangePasswordWithThunk} from '../Services/_redux/ChangePassword/index'
import {changePasswordReducer,handleStatusUpdate, hanldeSuccesState} from "../Services/_redux/ChangePassword/changePassword_slice"



const useStyles = makeStyles({
    textChangepassword: {
        color: '#cf4f1f',
        marginBottom: "40px"
    },
    textField: {
        marginBottom: '40px'
      },
  });

function ChangePassword (){

    const classes = useStyles();

    const changePassword = useSelector(changePasswordReducer)
    const dispatch = useDispatch()

    const hanldeSuccesStateAlert = (openAlert, alertType, message) => {
        dispatch(hanldeSuccesState({ openAlert, alertType, message }))
      }

    const [currentPassword, setcurrentPassword] = React.useState({
        password: '',
        showPassword: false,
      });
      const [newPassword, setNewPassword] = React.useState({
        password: '',
        showPassword: false,
      });
      const [confirmPassword, setConfirmPassword] = React.useState({
        password: '',
        showPassword: false,
      });
      const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'
    })
    const [currentUser, setCurrentUser] = React.useState(getCurrentUser())

      //handle current password input
      const handleChangecurrent = (prop) => (event) => {
        setcurrentPassword({ ...currentPassword, [prop]: event.target.value });
      };

      //handle new password input
      const handleChangenew = (prop) => (event) => {
        setNewPassword({ ...newPassword, [prop]: event.target.value });
      };

      //handle confirm password input
      const handleChangeconfirm = (prop) => (event) => {
        setConfirmPassword({ ...confirmPassword, [prop]: event.target.value });
      };

      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
  
  //hide or show password characters
  const handleClickShowPassword1 = () => {
    setcurrentPassword({ ...currentPassword, showPassword: !currentPassword.showPassword });
  };
  const handleClickShowPassword2 = () => {
    setNewPassword({ ...newPassword, showPassword: !newPassword.showPassword });
  };
  const handleClickShowPassword3 = () => {
    setConfirmPassword({ ...confirmPassword, showPassword: !confirmPassword.showPassword });
  };

  //close alert message after 3 seconds
  const closeAlert = () => {
    setTimeout(() => {
        setAlert({
            open: false,
            message: '',
            severity: ''
        })
    }, 3000)
}

//log user out
const logout = () => {
    logoutUser()
    window.location.assign('/')
 }

  //send password details to backend
  const changepass = async (e) => {
      e.preventDefault()
      const changedetails = {
          currentPassword: currentPassword.password,
          newPassword: newPassword.password,
          email: currentUser.email,
          uid: currentUser.uid
      }
      console.log(changedetails)
      if(currentPassword.password === '' || newPassword.password === '' || confirmPassword.password === '' ){
        setAlert({
            open: true,
            message: 'All fields cannot be empty',
            severity: 'error'
        })
        closeAlert()
      }else if (currentPassword.password.length < 6 || newPassword.password.length < 6){
        setAlert({
            open: true,
            message: 'Password must be 6 characters or more',
            severity: 'error'
        })
        closeAlert()
       } else if(newPassword.password !== confirmPassword.password){
        setAlert({
            open: true,
            message: 'Password Mismatch, try again',
            severity: 'error'
        })
        closeAlert()
      }else if(currentPassword.password === newPassword.password){
        setAlert({
            open: true,
            message: 'New password same as old password',
            severity: 'error'
        })
        closeAlert()
      } else{
        await dispatch(ChangePasswordWithThunk(changedetails))
        dispatch(handleStatusUpdate({data: null}))
        logout()
    }
  }

    return(
        <div className={"container-fluid"} style={{height: '100vh'}}>
            <div className="row justify-content-center d-flex align-items-center" style={{height: '100vh'}}>
                <form className="col-md-4" onSubmit={changepass}>
                    <Card className={classes.cardWidth}>
                        <CardContent className={classes.cardContentStyle}>
                            <h3 className={classes.textChangepassword}>CHANGE PASSWORD</h3>
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
                                <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined" fullWidth >
                                <InputLabel htmlFor="outlined-adornment-password">Current Password</InputLabel>
                                    <Input
                                      startAdornment={
                                        <InputAdornment position="start">
                                          <LockOpenIcon color='primary'/>
                                        </InputAdornment>
                                      }
                                        id="current-password"
                                        type={currentPassword.showPassword ? 'text' : 'password'}
                                        value={currentPassword.password}
                                        onChange={handleChangecurrent('password')}
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword1}
                                            onMouseDown={handleMouseDownPassword}
                                            >
                                            {currentPassword.showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                    />
                                    </FormControl>
                                <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined" fullWidth >
                                <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                                    <Input
                                     startAdornment={
                                        <InputAdornment position="start">
                                          <LockOpenIcon color='primary'/>
                                        </InputAdornment>
                                      }
                                        id="new-password"
                                        type={newPassword.showPassword ? 'text' : 'password'}
                                        value={newPassword.password}
                                        onChange={handleChangenew('password')}
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword2}
                                            onMouseDown={handleMouseDownPassword}
                                            >
                                            {newPassword.showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                    />
                                    </FormControl>
                                <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined" fullWidth >
                                <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                                    <Input
                                     startAdornment={
                                        <InputAdornment position="start">
                                          <LockOpenIcon color='primary'/>
                                        </InputAdornment>
                                      }
                                        id="confirm-password"
                                        type={confirmPassword.showPassword ? 'text' : 'password'}
                                        value={confirmPassword.password}
                                        onChange={handleChangeconfirm('password')}
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword3}
                                            onMouseDown={handleMouseDownPassword}
                                            >
                                            {confirmPassword.showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                    />
                                    </FormControl>
                        </CardContent>
                        <div className="row justify-content-center d-flex changepasswordbtn">
                            <CardActions>
                            <NavLink className="navLink" to={'/employee'}>
                                <Button size="small" color={"primary"}  type="submit" variant="contained">
                                        Cancel
                                </Button>
                                </NavLink>
                                <Button size="small" color={"primary"} type="submit" variant="contained" onClick={changepass}>
                                OK
                                </Button>
                            </CardActions>
                        </div>
                    </Card>
                </form>
            </div>
            <Snackbar
                    open={changePassword.successMessage.openAlert}
                    autoHideDuration={6000}
                    onClose={() => hanldeSuccesStateAlert(false, "", "")}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert severity={changePassword.successMessage.alertType}>{changePassword.successMessage.message}</Alert>
                </Snackbar>
            <Dialog
          open={changePassword.request.preloader}
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

export default ChangePassword