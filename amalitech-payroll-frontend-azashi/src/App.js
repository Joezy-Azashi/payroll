import "./App.css";
import React, {createContext, useContext, useEffect, useState} from "react";
/*import socketIOClient from "socket.io-client";*/
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import LoginView from "./Views/LoginView";
import NotFound from "./Components/NotFound";
import EmployeeSalary from "./Views/EmployeeSalary";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import AddDeduct from './Views/AddDeduct';
import StatutoryDeductions from './Views/StatutoryDeductions';
import Deductions from '../src/Views/Deductions'
import Additions from '../src/Views/Additions'
import './public/css/custom.css'
import './index.css'
import Layout from './Components/Layout/Layout'
import MasterPayroll from "./Views/MasterPayroll";
import PayslipDownload from "./Views/PayslipDownload";
import PayslipRequest from "./Views/PayslipRequest";
import BankAdvice from "./Views/Reports/BankAdvice";
import Tier1 from "./Views/Reports/Tier1"
import GRA from "./Views/Reports/GRA"
import SalaryJV from "./Views/Reports/SalaryJV"
import { isLoggedIn } from './Services/auth'
import ChangePassword from '../src/Views/ChangePassword'
import ForgotPassword from '../src/Views/ForgotPassword'
import SetNewPassword from './Views/SetNewPassword'
/*import config from './public/config'*/
import {Alert} from "@material-ui/lab";
import {Snackbar} from "@material-ui/core";
import PaySlips from "./Views/Reports/PaySlips";
import TierTwoReports from '../src/Views/Reports/TierTwoReports';
import Users from "./Views/Users";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#cf4f1f",
    },
    secondary: {
      main: "#f58256",
    }
  },
  
});
function App() {
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')
    /*open and close alert*/
    const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }
   /* const listenToSocket = () => {
        const socket = socketIOClient(config.socketUrl, { transports: ['websocket'] })
        socket.on('', () => {
            handleAlertState(true, 'success', 'BambooHR request completed successfully, Please visit the employee page to refresh tha data')
        })
    }*/

    useEffect(() => {
        // listenToSocket()
    }, [])
  return (
      <ThemeProvider theme={theme}>
          <div className="App">
              <ProvideAuth>
                  <BrowserRouter>
                      <Switch>
                          <LoginRoute exact={true} path={"/"} >
                              <LoginView />
                          </LoginRoute>
                          <PrivateRoute path={"/changepassword"} >
                              <ChangePassword />
                          </PrivateRoute>
                          <Route path={"/forgotpassword"} >
                              <ForgotPassword />
                          </Route>
                          <Route path={"/set-new-password"} >
                              <SetNewPassword />
                          </Route>
                          <PrivateRoute path={"/employee"} >
                              <Layout page={<EmployeeSalary />} />
                          </PrivateRoute>
                          <PrivateRoute path={"/definitions"} >
                              <Layout page={<Deductions />} />
                          </PrivateRoute>
                          <PrivateRoute path={"/additions"} >
                              <Layout page={<Additions />} />
                          </PrivateRoute>
                          <PrivateRoute path={"/master"} >
                              <Layout page={<MasterPayroll />} />
                          </PrivateRoute>
                          <PrivateRoute path={"/statutory-deductions"} >
                              <Layout page={<StatutoryDeductions />} />
                          </PrivateRoute>
                          <PrivateRoute path={"/deductions"} >
                              <Layout page={<AddDeduct />} />
                          </PrivateRoute>
                          <PrivateRoute path={"/reports-payslip"} >
                              <Layout page={<PaySlips />} />
                              </PrivateRoute>
                          <PrivateRoute path={"/bankadvice-report"}>
                              <Layout page={<BankAdvice/>} />
                          </PrivateRoute>
                          <PrivateRoute path={"/tier-one-report"}>
                              <Layout page={<Tier1 />} />
                          </PrivateRoute>
                          <PrivateRoute path={"/GRA-report"}>
                              <Layout page={<GRA />} />
                          </PrivateRoute>
                          <PrivateRoute path={"/salaryJV"}>
                              <Layout page={<SalaryJV />} />
                          </PrivateRoute>
                          <PrivateRoute path={"/users"}>
                              <Layout page={<Users />} />
                          </PrivateRoute>
                          <PrivateRoute path={"/tier-two-reports"} >
                              <Layout page={<TierTwoReports />} />
                          </PrivateRoute>
                          <Route path={"/payslip-request"} >
                             <PayslipRequest />
                          </Route>
                          <Route path={"/download/"} >
                             <PayslipDownload />
                          </Route>
                          <Route to={"/*"}>
                              <NotFound />
                          </Route>
                          <Redirect to={"/login"} >
                              <NotFound />
                          </Redirect>
                      </Switch>
                  </BrowserRouter>
                  <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => handleAlertState(false, '', '')}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                      <Alert  severity={alertType}>
                          {alertMessage}
                      </Alert>
                  </Snackbar>
              </ProvideAuth>
          </div>
      </ThemeProvider>
  );
}

export default App;

function PrivateRoute({ children, ...rest }) {
    let auth = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}
function LoginRoute({ children, ...rest }) {
    let auth = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth ? (
                        <Redirect
                            to={{
                                pathname: "/employee",
                                state: { from: location }
                            }}
                        />
                ) : (
                    children
                )
            }
        />
    );
}

const authContext = createContext();

function ProvideAuth({ children }) {
    const auth = isLoggedIn();
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}

function useAuth() {
    return useContext(authContext);
}