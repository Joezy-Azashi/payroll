import React, {useState} from 'react'
import ReportFilter from "../../Components/Reports/ReportFilter"
import SsnitReport from '../../Components/MasterPayroll/TierOne/SsnitReport'
import DialogPageLoader from "../../Components/DialogPageLoader";
import Dialog from "@material-ui/core/Dialog";
import PrintToExcel from "../../Components/PrintToExcel";
import {getErrorCode, getDataForExport, getCurrentMonthYearFromDate} from "../../Services/employeeService";
import {logoutUser} from "../../Services/auth";
import {useDispatch, useSelector} from "react-redux";
import {payrollReportReducer, handleStateAlert} from "../../Services/_redux/payrollReport/payroll-report-slice";
import {fetchTierOneReportWithThunk} from "../../Services/_redux/payrollReport";
import {Alert} from "@material-ui/lab";
import {Snackbar} from "@material-ui/core";

function Tier1() {
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
    const [requestDialog, setRequestDialog] = useState(false);

    const [date, setDate] = useState(getDate());
    const [title, setTitle] = useState('SSNIT REPORT');
    const [headers, setHeaders] = useState([
        'Name of Employee',
        'SSNIT Number',
        'Basic Salary',
        'SSF(13.5%)'
    ]);

    const tierOne = useSelector(payrollReportReducer)
    const dispatch = useDispatch()
    const emp = tierOne.tierOne
    const toExport = tierOne.exportData
    const handleRequestDialog = () => {
        setRequestDialog(false)
    }
    const handleAlertState = (openAlert, alertType, message) => {
        dispatch(handleStateAlert({openAlert, alertType, message, type: 'tierOne'}))
    }


    /*check if there was an error while fetching the data*/
    const checkForError = () => {
        if (emp.status === 'Failed') {
            if (getErrorCode(emp.statusCode).includes('416')) {
                logoutUser()
                window.location.reload()
            } else if (getErrorCode(toExport.statusCode).includes('401')) {
                handleAlertState(true, 'error', 'You are not authorized to perform this operation')
            }
        }
    }
    const getSsnit = async(page, data) => {
        await dispatch(fetchTierOneReportWithThunk({page:page, data:data}))
        checkForError()
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
        setRequestDialog(true)
        getDataForExport(date).then((response) => {
            const res = response.data
            const data = []
            if (res.length > 0) {
                res.map((e) => {
                    if (e.payrolls.length > 0) {
                        const d = {
                            fullName: `${e.lastName}, ${e.firstName} ${e.middleName === null || e.middleName === 'null' ? '' : e.middleName}`,
                            ssnit: e.customSSN,
                            basicSalary: e.payrolls[0].basicSalary,
                            percentage: e.payrolls[0].tierOne
                        }
                        data.push(d)
                    }
                })
                setRequestDialog(false)
                if (data.length > 0) {
                    const myDate = getCurrentMonthYearFromDate(date.yearMonth)
                    const title = `SSNIT REPORT FOR ${myDate}`
                    PrintToExcel({data, title: title.toUpperCase(), headers, filename: `ssnit_report_for_${myDate}` })
                } else {
                    handleAlertState(true, 'error', 'No data available for export')
                }
            }
            else {
                setRequestDialog(false)
                handleAlertState(true, 'error', 'No data available for export')
            }
        }).catch((error) => {
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
    const updateFunction = (page) => {
        console.log(date)
        getSsnit(page, date).then(() => {

        }).catch(() => {})
    }


    return (
        <div className="ml-4 mr-4">
            <div className="row mt-3 mb-5">
                <h3 className="lead-title ml-3"> Tier 1 </h3>
            </div>
            <div>
                <ReportFilter filterFunction={filterFunction} exportFunction={exportFunction} initialFetch={initialFetch} dateChange={dateChange}/>
                <SsnitReport updateFunction={updateFunction}/>

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
        </div>
    )
}

export default Tier1
