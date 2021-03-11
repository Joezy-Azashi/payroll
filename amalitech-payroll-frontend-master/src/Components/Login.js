import React from 'react';
import { useForm } from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {blue} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(2),
            width: '80%',
        },
        background_color: blue
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));
function Login(props) {
    const classes = useStyles()
    const { login, handleSubmit } = useForm()
    const onSubmit = (data) => login(data)
    return (
        <div>
            <form className={classes.root} noValidate autoComplete="off">
                <h3>AMALITECH PAYROLL</h3>
                <small>Welcome! Please enter your credentials to login</small>
                <div className="row">
                    <div className="col-12">
                        <TextField className={classes.textField}
                            id="email"  label="Email" fullWidth/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <TextField
                            fullWidth
                            margin="none"
                            id="standard-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                        />
                    </div>
                </div>
                <div className="row justify-content-center pt-3">
                    <div className="col-12">
                        <Typography>
                            <Link href="#">
                                Forgotten Password?
                            </Link>
                        </Typography>
                    </div>
                </div>
                <div className="row pt-5">
                    <div className="col-12">
                        <Button variant="contained" color="primary">
                            Primary
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Login;