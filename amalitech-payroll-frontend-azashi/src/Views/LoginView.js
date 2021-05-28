import React from 'react';
import Login from './../Components/Login'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from "@material-ui/core/styles";
import {blue} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '80%',
        },
        background_color: blue
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    cardWidth: {
        width: '100%'
    },
    cardContentStyle: {
        width: '100%',
        marginTop: '50px',
        marginBottom: '50px',
    },
    colFour: {
        verticalAlign: 'center'
    }
}));

function LoginView(props) {
    const classes = useStyles()
    return (
        <div className={"container-fluid"} style={{height: '100vh'}}>
            <div className="row justify-content-center d-flex align-items-center" style={{height: '100vh'}}>
                <div className="col-md-4">
                    <Card className={classes.cardWidth}>
                        <CardContent className={classes.cardContentStyle}>
                            <Login />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default LoginView;