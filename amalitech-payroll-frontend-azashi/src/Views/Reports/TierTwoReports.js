import React, {useEffect, useState} from "react";
import "../../index.css";
import {Snackbar} from '@material-ui/core';
import PrintToExcel from '../../Components/PrintToExcel';
import TierTwoReportTable from '../../Components/MasterPayroll/TierTwo/TierTwoReportTable';
import DialogPageLoader from "../../Components/DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import {  logoutUser } from '../../Services/auth';
import {
    fetchTierTwoReportWithThunk
} from "../../Services/_redux/payrollReport";
import {fetchSsnitWithThunk} from "../../Services/_redux/statutory";
import {fetchTier2TotalsWithThunk} from "../../Services/_redux/totals";
import {getCurrentMonthYearFromDate, getDataForExport} from "../../Services/employeeService";
import {useDispatch, useSelector} from "react-redux";
import {handleStateAlert, payrollReportReducer} from "../../Services/_redux/payrollReport/payroll-report-slice";
import {totalsReducer} from "../../Services/_redux/totals/totals_slice";
import ReportFilter from '../../Components/Reports/ReportFilter';
import {Alert} from "@material-ui/lab";


export function TierTwoReport() {
    const payrollReport = useSelector(payrollReportReducer);
    const emp = payrollReport.tierTwo;
    const toExport = payrollReport.exportData
    const totalsReducers = useSelector(totalsReducer);
    const totals = totalsReducers.tier2Totals.data;
    const dispatch = useDispatch();

    const currentYear = () => {
        return new Date().getFullYear()
    }

    const currentMonth = () => {
        return (('0' + ((new Date().getMonth()) + 1))).slice(-2)
    }
    const getDate = () => {
        const year = currentYear()
        const month = currentMonth()
        return { yearMonth: `${year}-${month}`}

    }

    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [date, setDate] = useState(getDate());
    const [title, setTitle] = useState('TIER TWO REPORT');
    const [headers, setHeaders] = useState([
        'Name of Employee',
        'SSNIT Number',
        'Tier Two Number',
        'Basic Salary',
        'SSF (5%)'
        ]);
    const [open, setOpen] = React.useState(false);
    const [requestDialog, setRequestDialog] = useState(false);


    const handleRequestDialog = () => {
        setRequestDialog(false);
    }

      const handleClose = () => {
        setOpen(false);
      };

    const handleAlertState = (openAlert, alertType, message) => {
        dispatch(handleStateAlert({openAlert, alertType, message, type: 'tierTwo'}))
    };

    const getSsnit = async (page, data) => {
        dispatch(fetchTierTwoReportWithThunk({page, data}));
    };

    const updateSsnit = (page) => {
        // const data = { yearMonth: `${year}-${month}`}
        getSsnit((page - 1), date).then(() => {}).catch(() => {});
    }

 
    const getSsnitPercentage = () => {
        dispatch(fetchSsnitWithThunk());
    };

    // FETCHING SUMMATION FROM BACKEND
    const getSummation =  async () => {
        dispatch(fetchTier2TotalsWithThunk());

        };

    const filterFunction = (date) => {
        const page = 0
        getSsnit(page, date).then(() => {

        }).catch(() => {})
    }
    const dateChange = (date) => {
        setDate(date)
    }
    const exportFunction = async (date) => {
        console.log(date)
        setRequestDialog(true)
        getDataForExport(date).then((response) => {
            const res = response.data
            const data = []
            if (res.length > 0) {
                res.map((e) => {
                    if (e.payrolls.length > 0) {
                        const d = {
                            fullName: `${e.lastName}, ${e.firstName} ${e.middleName !== null ? e.middleName : ''}`,
                            ssnit: e.customSSN,
                            tierTwoNumber: e.tierTwoNumber,
                            basicSalary: e.payrolls[0].basicSalary,
                            percentage: e.payrolls[0].tierTwo
                        }
                        data.push(d)
                    }
                })
                setRequestDialog(false)
                if (data.length > 0) {
                    const myDate = getCurrentMonthYearFromDate(date.yearMonth)
                    const title = `TIER TWO REPORT FOR ${myDate}`
                    PrintToExcel({data, title: title.toUpperCase(), headers, filename: `tier_two_report_for_${myDate}` })
                } else {
                    handleAlertState(true, 'error', 'No data available for export')
                }
            }
            else {
                setRequestDialog(false)
                handleAlertState(true, 'error', 'No data available for export')
            }
        }).catch((error) => {
            console.log(error)
            if (error?.response?.status === 416) {
                logoutUser()
                window.location.reload()
            } else if (error?.response?.status === 4101) {
                handleAlertState(true, 'error', 'You are not authorized to perform this operation')
            } else {
                handleAlertState(true, 'error', 'Error performing request')
            }
        })
    }
    const initialFetch = (date) => {
        const page = emp.data.pageable?.pageNumber || 0
        getSsnit(page, date).then(() => {

        }).catch(() => {})
    }



    useEffect(() => {
        getSummation();
        getSsnitPercentage();
    }, []);

    return(
        <div className="ml-4 mr-4">
            <div className=" row mt-3 mb-5">
            <h3 className="lead-title ml-3"> Tier 2 </h3>
            </div>
            <ReportFilter filterFunction={filterFunction} exportFunction={exportFunction} initialFetch={initialFetch} dateChange={dateChange}/>
                    
            <div>
                 {
                     TierTwoReportTable (filterFn, setFilterFn, updateSsnit, emp.preloader, emp.data, totals)
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
            <Snackbar open={emp.openAlert} autoHideDuration={6000} onClose={() => handleAlertState(false, '', '')}
                      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert  severity={emp.alertType}>
                    {emp.message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default TierTwoReport;