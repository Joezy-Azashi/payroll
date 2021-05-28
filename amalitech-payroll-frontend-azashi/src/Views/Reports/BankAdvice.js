import React, { useState }  from 'react'
import BankAdviceReport from '../../Components/MasterPayroll/BankAdvice/BankAdvice-report'
import ReportFilter from '../../Components/Reports/ReportFilter';
import { getErrorCode} from "../../Services/employeeService";
import PrintToExcel from "../../Components/PrintToExcel";
import {logoutUser} from "../../Services/auth";
import {fetchBankAdviceReportWithThunk} from "../../Services/_redux/payrollReport";
import {useDispatch, useSelector} from "react-redux";
import {handleStateAlert, payrollReportReducer} from "../../Services/_redux/payrollReport/payroll-report-slice";
import Dialog from "@material-ui/core/Dialog";
import DialogPageLoader from "../../Components/DialogPageLoader";
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import Api from "../../Services/api";

function BankAdvice() {
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
    const [headers, setHeaders] = useState([
        'Name of Employee',
        'Bank Name',
        'Account Branch',
        'Account Number',
        'Net Salary',
    ]);
    const report = useSelector(payrollReportReducer)
    const dispatch = useDispatch()
    const emp = report.bankAdvice
    const toExport = report.exportData
    const handleRequestDialog = () => {
        setRequestDialog(false)
    }
    const handleAlertState = (openAlert, alertType, message) => {
        dispatch(handleStateAlert({openAlert, alertType, message, type: 'bankAdvice'}))
    }
    const getCurrentMonthYear = () => {
        const year =  new Date().getFullYear()
        const month = (new Date().toLocaleString('default', { month: 'long' }))
        return `${year} ${month}`
    }
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
        await dispatch(fetchBankAdviceReportWithThunk({page:page, data:data}))
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
    /*fetch full data from server*/
    const exportData = (val) => {
        setRequestDialog(true)
        Api().post('/payrolls/report/bank-advise-others', val).then((response) => {
            /*loop through the data to construct new date for export*/
            const data = []

            if (response.data.length > 0){
                response.data.map((e) => {
                    const d = {
                        fullName: `${e.lastName}, ${e.firstName} ${e.otherNames || ""}`,
                        bankName: e.bankName,
                        branchName: e.branchName,
                        accountNumber: e.accountNumber,
                        netSalary: e.payableNetSalary.toFixed()
                    }
                    data.push(d)
                })
                setRequestDialog(false)
                const date = getCurrentMonthYear()
                const title = `EMPLOYEES BANK ADVICE FOR ${date}`
                PrintToExcel({data, title: title.toUpperCase(), headers, filename: `bank_advice_for_${date}` })
            } else {
                setRequestDialog(false)
                handleAlertState(true, 'error', 'No data available to export')
            }
        }).catch((error) => {
            if (error.response?.status === 416) {
                logoutUser()
                window.location.reload()
            } else {
                setRequestDialog(false)
                handleAlertState(true, 'error', 'Error occurred while performing this operation')
            }
        })
    }
    const exportTrainingCenterData = (val) => {
        setRequestDialog(true)
        Api().post('/payrolls/report/bank-advise-tr', val).then((response) => {
            /*loop through the data to construct new date for export*/
            const data = []

            if (response.data.length > 0){
                response.data.map((e) => {
                    const d = {
                        fullName: `${e.lastName}, ${e.firstName} ${e.otherNames || ""}`,
                        bankName: e.bankName,
                        branchName: e.branchName,
                        accountNumber: e.accountNumber,
                        netSalary: e.payableNetSalary.toFixed(2)
                    }
                    data.push(d)
                })
                setRequestDialog(false)
                const date = getCurrentMonthYear()
                const title = `EMPLOYEES BANK ADVICE - TRAINING CENTRE FOR ${date}`
                PrintToExcel({data, title: title.toUpperCase(), headers, filename: `bank_advice_for_training_center_for_${date}` })
            } else {
                setRequestDialog(false)
                handleAlertState(true, 'error', 'No data available to export')
            }
        }).catch((error) => {
            if (error.response?.status === 416) {
                logoutUser()
                window.location.reload()
            } else {
                setRequestDialog(false)
                handleAlertState(true, 'error', 'Error occurred while performing this operation')
            }
        })
    }
    const exportFunction = async (date) => {
        const val = { yearMonth: date.yearMonth}
        switch (date.type) {
            case 'training':
                exportTrainingCenterData(val)
                break
            default:
                exportData(val)
        }
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
                <h3 className="lead-title ml-3"> Bank Advice </h3>
            </div>
            <div>
                <ReportFilter showExport = {true} filterFunction={filterFunction} exportFunction={exportFunction} initialFetch={initialFetch} dateChange={dateChange} bankAdvice={true}/>
                <BankAdviceReport updateFunction={updateFunction}/>
            </div>
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

export default BankAdvice
