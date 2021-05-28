import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import TabContext from '@material-ui/lab/TabContext';
import TabList from "@material-ui/lab/TabList";
import TabPanel from '@material-ui/lab/TabPanel';
import {Card, Tab, Button, Snackbar} from '@material-ui/core';
import '../index.css'
import Payroll from '../Components/MasterPayroll/Payroll/payroll'
import Ssnit from '../Components/MasterPayroll/TierOne/Ssnit'
import TierTwo from '../Components/MasterPayroll/TierTwo/TierTwo'
import GRA from '../Components/MasterPayroll/GRA/GRA'
import BankAdvice from '../Components/MasterPayroll/BankAdvice/BankAdvice'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Api from "../Services/api";
import {Alert} from "@material-ui/lab";
import Bonuses from '../Components/MasterPayroll/Bonuses';
import JournalVoucherTab from '../Components/MasterPayroll/JournalVoucher/JournalVoucherTab';
import DialogPageLoader from "../Components/DialogPageLoader";
import * as roles from '../Services/roles'
import { getCurrentUser, logoutUser } from '../Services/auth'
import AuthorizeDialog from '../Components/AuthorizeDialog';
import ApproveDialog from '../Components/ApproveDialog'


function MasterPayroll() {

    const [value, setValue] = useState("1");
    const [confirmDialog, setConfirmDialog] = useState(false)
    const [openAuthorize, setOpenAuthorize] = useState(false)
    const [openApprove, setopenApprove] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')
    const [requestDialog, setRequestDialog] = useState(false);
    const [uuid, setUuid] = useState(getCurrentUser())
    const [authorizeState, setAuthorizeState] = useState(false)

    const handleRequestDialog = () => {
        setRequestDialog(false)
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const logout = () => {
        logoutUser()
        window.location.assign('/')
  
    }

    const openApproveDialog = () => {
        setopenApprove(true)
    }

    const closeApproveDialog = () => {
        setopenApprove(false)
    }

    const openAuthorizeDialog = () => {
        setOpenAuthorize(true)
    }

    const closeAuthorizeDialog = () => {
        setOpenAuthorize(false)
    }

    /*open dialog to confirm payroll generation*/
    const confirmPayrollGenerate = () => {
        setConfirmDialog(true)
    };
    const handleConfirmDialogClose = () => {
        setConfirmDialog(false)
    }
    const calculateSalary = () => {
        setConfirmDialog(false)
        setRequestDialog(true)
        Api().get('/payrolls/generate-payrolls').then((response) => {
            console.log('calculations done')
            update().then((response) => {
                setAlertType('success')
                setAlertMessage('Payroll Generated Successfully ready to be authorized. Please Wait...')
                setRequestDialog(false)
                setAlertOpen(true)
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }).catch((error => {
                setAlertType('error')
                setAlertMessage('Error Generating Payroll.')
                setRequestDialog(false)
                setAlertOpen(true)
            }))
           
        }).catch((error) => {
            if(error === "Request failed with status code 416"){
                handleAlertState(
                    true,
                    "error",
                    "Sorry, This Action Can Not Be Performed As At Now."
                  );
                  setTimeout(() => {
                    logout()
                  }, 1000)
               }else{
                handleAlertState(
                    true,
                    "error",
                    "Error Performing Request."
                  );
               }
        })
    };
    /*open and close alert*/
    const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }


    // UPDATE PAYROLL STATUS
    const update = async () => {
        const updateData = {
            generate: true,
            generatedBy: uuid.uid
        }
        return new Promise(async (resolve, reject) => {
            try {
                const res = await Api().patch('/payrolls/update-generate-status', updateData)
                resolve(res)
            } catch (error) {
                reject(error)
            }
        })
    }

    // GET STATUS FOR AUTHORIZE BUTTON TO BE TRIGGERED
    const getAuthorizeStatus = async () => {
       const status= await Api().get('/payrolls/current-payroll-status')
       setAuthorizeState(status.data)
    }


    useEffect(() => {
        getAuthorizeStatus()
    }, [])
  




    return (
        <div>
            <Card elevation="0" className="cardColor">
                <div className="row p-0 m-0 cardColor w-100 justify-content-end d-flex">
                    <div className="col-12 d-flex justify-content-end mr-3  flex-md-row flex-column">
                        {
                            roles.canApproved() ? (
                                <div className="col-md-1">
                                    <Button
                                        className="text-capitalize ml-3 mt-2 w-100"
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={openApproveDialog}
                                        disabled={
                                            !authorizeState.authorized
                                        }

                                    >
                                        Approve
                                    </Button>
                                </div>
                            ) : null
                        }
                        {
                            roles.canAuthorize() ? (
                                <div className="col-md-1">
                                    <Button
                                        className="text-capitalize ml-3 mt-2 w-100"
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={openAuthorizeDialog}
                                        disabled ={
                                            !authorizeState.generated
                                        }
                                    >
                                        Authorize 
                                    </Button>
                                </div>
                            ) : null
                        }
                        {
                            roles.canEdit() ? (
                                <div className="col-md-2">
                                    <Button
                                        className="text-capitalize mt-2"
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => confirmPayrollGenerate()}
                                    >
                                        Generate Payroll
                                    </Button>
                                </div>
                            ) : null
                        }
                    </div>
                </div>

                <div className="">
                    <TabContext value={value}>
                        <TabList variant="scrollable" onChange={handleChange} aria-label="simple tabs example" className='cardColor overflow-auto'>
                            <Tab label="Payroll" value="1" className="text-capitalize"/>
                            <Tab label="Tier 1" value="2" className="text-capitalize"/>
                            <Tab label="Tier 2" value="3" className="text-capitalize"/>
                            <Tab label="GRA" value="4"/>
                            <Tab label="Bank Advice" value="5" className="text-capitalize"/>
                            <Tab label="Bonuses" value="6" className="text-capitalize"/>
                            <Tab label="Journal Voucher" value="7" className="text-capitalize"/>
                        </TabList>

                        {/* MAIN TABLE */}
                        <TabPanel value="1" className="cardColor table-responsive">
                            {<Payroll />}
                        </TabPanel>

                        <TabPanel value="2" className="cardColor">
                            {<Ssnit />}
                        </TabPanel>
                        <TabPanel value="3" className="cardColor">
                            {<TierTwo />}
                        </TabPanel>
                        <TabPanel value="4" className="cardColor">
                            {<GRA />}
                        </TabPanel>
                        <TabPanel value="5" className="cardColor">
                            {<BankAdvice />}
                        </TabPanel>
                        <TabPanel value="6" className="cardColor">
                            {<Bonuses />}
                        </TabPanel>
                        <TabPanel value="7" className="cardColor">
                            {<JournalVoucherTab />}
                        </TabPanel>
                    </TabContext>
                </div>
           </Card>
            <Dialog
                open={confirmDialog}
                onClose={handleConfirmDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth

                maxWidth={"xs"}
            >
                <div>
                    <DialogTitle id="alert-dialog-title text-center">
                        <Typography className="row justify-content-center mt-3">
                            Are you sure?
                        </Typography>
                    </DialogTitle>
                    <DialogActions>
                        <div className="row justify-content-center d-flex text-center w-100 m-0 p-0">
                            <div className="col-md-6">
                                <Button onClick={() => handleConfirmDialogClose()}
                                color="primary"
                                className="btn-amalitech float-right"
                                >
                                    Cancel
                                </Button>
                            </div>
                            <div className="col-md-6">
                                <Button
                                className="btn-amalitech float-left"
                                    color="primary"
                                    autoFocus
                                    onClick={(e) => calculateSalary()}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    </DialogActions>
                </div>
            </Dialog>

            <Dialog
                open={openAuthorize}
                onClose={handleConfirmDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth={"xs"}
            >
                <AuthorizeDialog closeAuthorizeDialog={closeAuthorizeDialog} />
            </Dialog>

            <Dialog
                open={openApprove}
                onClose={handleConfirmDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth={"xs"}
            >
                <ApproveDialog closeApproveDialog={closeApproveDialog} />
            </Dialog>

            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => handleAlertState(false, '', '')}
                      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert  severity={alertType}>
                    {alertMessage}
                </Alert>
            </Snackbar>
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
    )
}

export default MasterPayroll;
