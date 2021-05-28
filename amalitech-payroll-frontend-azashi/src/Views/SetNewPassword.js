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
import InputLabel from '@material-ui/core/InputLabel';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import {NavLink} from 'react-router-dom'
import DialogPageLoader from "../Components/DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import Snackbar from "@material-ui/core/Snackbar";
import {useDispatch, useSelector} from "react-redux"
import {setNewPasswordWithThunk} from '../Services/_redux/set-new-password/index'
import {setNewPasswordReducer,handleStatusUpdate, hanldeSuccesState} from "../Services/_redux/set-new-password/setNewPassword_slice"
import queryString from 'query-string';
import { useLocation } from 'react-router';

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

function SetNewPassword (){

    const classes = useStyles();

    const resetPassword = useSelector(setNewPasswordReducer)
    const dispatch = useDispatch()

      const [newPassword, setNewPassword] = React.useState({
        password: '',
        showPassword: false,
      });
      const [confirmPassword, setConfirmPassword] = React.useState({
        password: '',
        showPassword: false,
      });
      const [alert, setAlert] = useState(false)

    let location = useLocation()
    const query = queryString.parse(location.search)

    const hanldeSuccesStateAlert = (openAlert, alertType, message) => {
        dispatch(hanldeSuccesState({ openAlert, alertType, message }))
      }

      //handle password change
      const handleChangenew = (prop) => (event) => {
        setNewPassword({ ...newPassword, [prop]: event.target.value });
      };
      const handleChangeconfirm = (prop) => (event) => {
        setConfirmPassword({ ...confirmPassword, [prop]: event.target.value });
      };

      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

    //hide or show password characters
  const handleClickShowPassword2 = () => {
    setNewPassword({ ...newPassword, showPassword: !newPassword.showPassword });
  };
  const handleClickShowPassword3 = () => {
    setConfirmPassword({ ...confirmPassword, showPassword: !confirmPassword.showPassword });
  };

  //close  alert after 3 seconds
  const closeAlert = () => {
    setTimeout(() => {
        setAlert({
            open: false,
            message: '',
            severity: ''
        })
    }, 3000)
}


    //send new password details to backend
  const changepass = async (e) => {
      e.preventDefault()
      const setNewPassDetails = {
          password: newPassword.password,
          linkId: query.id
      }
      if(newPassword.password === '' || confirmPassword.password === ''){
        setAlert({
            open: true,
            message: 'New and confirm password fields cannot be empty',
            severity: 'error'
        });
        closeAlert()
      }else if(newPassword.password.length < 6){
        setAlert({
            open: true,
            message: 'Password must be 6 characters or more',
            severity: 'error'
        })
        closeAlert()
      }else if(newPassword.password !== confirmPassword.password){
        setAlert({
            open: true,
            message: 'Password mismatch, check and try again',
            severity: 'error'
        });
        closeAlert()
      }else{
        await dispatch(setNewPasswordWithThunk(setNewPassDetails))
      console.log(setNewPassDetails)
      dispatch(handleStatusUpdate({data: null}))
      window.location.assign('/')
      }      
  }

    return(
        <div className={"container-fluid"} style={{height: '100vh'}}>
            <div className="row justify-content-center d-flex align-items-center" style={{height: '100vh'}}>
                <form className="col-md-4" onSubmit={changepass}>
                    <Card className={classes.cardWidth}>
                        <CardContent className={classes.cardContentStyle}>
                            <h3 className={classes.textChangepassword}>SET NEW PASSWORD</h3>
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
                                <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                                    <Input
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
                                <Button size="small" variant="contained">
                                        Cancel
                                </Button>
                                </NavLink>
                                <Button size="small" color={"primary"} type="submit" variant="contained">
                                OK
                                </Button>
                            </CardActions>
                        </div>
                    </Card>
                </form>
            </div>
            <Snackbar
                    open={resetPassword.successMessage.openAlert}
                    autoHideDuration={6000}
                    onClose={() => hanldeSuccesStateAlert(false, "", "")}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert severity={resetPassword.successMessage.alertType}>{resetPassword.successMessage.message}</Alert>
                </Snackbar>

                {/* page loader dialog */}
            <Dialog
          open={resetPassword.request.preloader}
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

export default SetNewPassword