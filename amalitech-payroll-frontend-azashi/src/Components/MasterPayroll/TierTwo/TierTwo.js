import React, {useEffect, useState} from "react";
import Api from "../../../Services/api";
import "../../../index.css";
import {InputAdornment, Snackbar} from "@material-ui/core";
import { FormControl, InputLabel, Select, MenuItem  } from '@material-ui/core';
import { Grid, Button, TextField } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Search } from '@material-ui/icons';
import PrintToExcel from '../../PrintToExcel';
import TierTwoTable from './TierTwoTable';
import DialogPageLoader from "../../DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {  logoutUser } from '../../../Services/auth';
import {fetchEmployeesWithThunk} from "../../../Services/_redux/employees";
import { fetchCurrentPayrollWithThunk } from '../../../Services/_redux/payroll/index';
import {fetchSsnitWithThunk} from "../../../Services/_redux/statutory";
import {fetchTier2TotalsWithThunk} from "../../../Services/_redux/totals";
import {useDispatch, useSelector} from "react-redux";
import {statutoryReducer} from "../../../Services/_redux/statutory/statutory_slice";
import {employeeReducer} from "../../../Services/_redux/employees/employee-slice";
import {payrollReducer} from '../../../Services/_redux/payroll/payroll-slice'
import {totalsReducer} from "../../../Services/_redux/totals/totals_slice";
import {Alert} from "@material-ui/lab";

export function TierTwo() {
    const statutory = useSelector(statutoryReducer);
    const pensionPercentage = statutory.ssnit.data;
    const payrolls = useSelector(payrollReducer);
    const totalsReducers = useSelector(totalsReducer);
    const totals = totalsReducers.tier2Totals.data;
    const dispatch = useDispatch();

    const getTierTwoRate = () => {
        let rate = 5
        pensionPercentage.map((item) => {
            if(item.label === 'Tier 2 Rate'){
                rate = item.percentage
            }
        })
        return rate
    }
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [headers, setHeaders] = useState([
        'Name of Employee',
        'SSNIT Number',
        'Tier Two Number',
        'Basic Salary',
        `SSF (${getTierTwoRate()})`
        ]);
    const [open, setOpen] = React.useState(false);
    const [requestDialog, setRequestDialog] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')
    const handleRequestDialog = () => {
        setRequestDialog(false)
    }

      const handleClose = () => {
        setOpen(false);
      };

      const logout = () => {
        logoutUser()
        window.location.reload()
    }

    const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }

    const updateSsnit = (page) => {
        getSsnit((page - 1)).then(() => {}).catch(() => {});
    }
    const getSsnit = async (page) => {
        dispatch(fetchCurrentPayrollWithThunk({page:page}));
    };
    const setDataToExport = () => {

    };
    const getSsnitPercentage = () => {
        dispatch(fetchSsnitWithThunk());
    };

    const getCurrentMonthYear = () => {
        const year =  new Date().getFullYear()
        const month = (new Date().toLocaleString('default', { month: 'long' }))
        return `${year} ${month}`
    }


    // FETCHING SUMMATION FROM BACKEND
    const getSummation =  async () => {
        dispatch(fetchTier2TotalsWithThunk());

        };
    /*fetch full data from server*/
    const exportData = () => {
        setRequestDialog(true)
        Api().get('/payrolls/all-payrolls').then((response) => {
            /*loop through the data to construct new date for export*/
            
            const data = []
            if (response.data.length > 0){
                response.data.map((e) => {
                    console.log("e", e)
                        const d = {
                            fullName: `${e.lastName}, ${e.firstName} ${e.middleName === null || e.middleName === 'null' ? '' : e.middleName}`,
                            ssnitNumber: e.customSSN,
                            tierTwoNumber: e.tierTwoNumber,
                            basicSalary: (e.basicSalary).toFixed(2),
                            percentage: (e.tierTwo).toFixed(2)
                        }
                        data.push(d)
                })
                setRequestDialog(false)
                const date = getCurrentMonthYear()
                const title = `TIER TWO REPORT FOR ${date}`
                PrintToExcel({data, title: title.toUpperCase(), headers, filename: `tier_two_report_for_${getCurrentMonthYear()}`})
            
            } else {
                handleAlertState(true, 'error', 'No data available to export')
                setRequestDialog(false)
            }
            
        }).catch((error) => {
            setRequestDialog(false)
            if(error.response?.status === 416){
                handleAlertState(
                    true,
                    "error",
                    "Sorry, Session Expired."
                  );
                  setTimeout(() => {
                    logout()
                  }, 1000)
               }else{
                handleAlertState(
                    true,
                    "error",
                    "Error Exporting Data For This Month."
                  );
               }
         })
    }
    useEffect(() => {
        getSummation()
        getSsnitPercentage()
        const page = payrolls.payroll.data.pageable?.pageNumber || 0
        getSsnit(page).then(() => {
            setDataToExport()
        }).catch(() => {})
    }, []);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(
                        x => x.firstName?.toLowerCase().match(target.value.toLowerCase()) ||
                            x.lastName?.toLowerCase().match(target.value.toLowerCase()) ||
                            x.employeeNumber?.toLowerCase().match(target.value.toLowerCase()) ||
                            x.jobTitle?.toLowerCase().match(target.value.toLowerCase())
                    )
            }
        })
    }
    return(
        <div>
            
            <div className="row">

                    {/* EMPLOYEE SEARCH */}
                    <div className="col-md-4 mb-2">
                                    <FormControl
                                        size="small"
                                        fullWidth="true"
                                        className=""
                                        color="primary" style={{backgroundColor:"#ffffff"}}
                                    >
                                    <TextField
                                        size="small"
                                        type="search"
                                        color="primary"
                                        variant={"outlined"}
                                        InputProps={{startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>
                                            ),
                                            style: { backgroundColor: 'white' } }}
                                        onInput={(e) => {
                                            handleSearch(e)
                                        }}
                                        label="Search Employee" />
                                    </FormControl>
                            </div>

                    {/* POSITION FILTER */}
                    <div className="col-md-6">
                    </div>
                    
                    <div className="col-md-2 mb-2">
                        <Button
                            className="text-capitalize greyedBtn"
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<CloudUploadIcon />}
                            onClick={() => {exportData()}}
                        >
                            Export Pension
                        </Button>
                    </div> 
                
            </div>
            <div className="row">
                {/* BULK SEND BUTTON */}
                <Grid item md="10" lg="10" sm="12" xs="12">

                </Grid>
                <Grid item md="1" lg="1" sm="4" xs="12">
                   
                </Grid>
            </div>
            <div className="table-responsive">
                 {
                 TierTwoTable (filterFn, updateSsnit, payrolls.preloader, payrolls.payroll.data, totals)
                 }
            </div>
            <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                    maxWidth="xs"
                >
                    <DialogPageLoader />
                </Dialog>
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
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => handleAlertState(false, '', '')}
                      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert  severity={alertType}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default TierTwo;