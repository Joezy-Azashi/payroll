import React, {useRef, useState} from 'react'
import JournalVoucherReport from "../../Components/MasterPayroll/JournalVoucher/JournalVoucherReport"
import ReportFilter from "../../Components/Reports/ReportFilter"
import {getDataForExport, getErrorCode} from "../../Services/employeeService";
import {logoutUser} from "../../Services/auth";
import {fetchSalaryJVReportWithThunk} from "../../Services/_redux/payrollReport";
import PrintToExcel from "../../Components/PrintToExcel";
import {useDispatch, useSelector} from "react-redux";
import {handleStateAlert, payrollReportReducer} from "../../Services/_redux/payrollReport/payroll-report-slice";
import Dialog from "@material-ui/core/Dialog";
import DialogPageLoader from "../../Components/DialogPageLoader";
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import Button from "@material-ui/core/Button";
import ReactToPrint from "react-to-print";

function SalaryJV() {
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
        'Percentage(13.5%)'
    ]);

    const report = useSelector(payrollReportReducer)
    const printButton = useRef()
    const componentRef = useRef()
    const dispatch = useDispatch()
    const salaryJV = report.salaryJV
    const handleRequestDialog = () => {
        setRequestDialog(false)
    }
    const handleAlertState = (openAlert, alertType, message) => {
        dispatch(handleStateAlert({openAlert, alertType, message, type: 'tierOne'}))
    }
    /*check if there was an error while fetching the data*/
    const checkForError = () => {
        if (salaryJV.status === 'Failed') {
            if (getErrorCode(salaryJV.statusCode).includes('416')) {
                logoutUser()
                window.location.reload()
            } else if (getErrorCode(salaryJV.statusCode).includes('401')) {
                handleAlertState(true, 'error', 'You are not authorized to perform this operation')
            }
        }
    }
    const getSsnit = async(data) => {
        await dispatch(fetchSalaryJVReportWithThunk({data:data}))
        checkForError()
    };
    const filterFunction = (date) => {
        getSsnit(date).then(() => {

        }).catch(() => {})
    }
    const dateChange = (date) => {
        setDate(date)
    }
    const exportFunction = async (date) => {
        printButton.current.click()
    }
    const initialFetch = (date) => {
        getSsnit(date).then(() => {

        }).catch(() => {})
    }

    return (
        <div className="ml-4 mr-4">
            <div className="row mt-3 mb-5">
                <h3 className="lead-title ml-3"> Journal Voucher </h3>
            </div>
            <ReportFilter filterFunction={filterFunction} exportFunction={exportFunction} initialFetch={initialFetch} dateChange={dateChange}/>
            <JournalVoucherReport ref={componentRef} vDate={date} salaryJV={salaryJV}/>
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
            <Snackbar open={salaryJV.openAlert} autoHideDuration={6000} onClose={() => handleAlertState(false, '', '')}
                      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert  severity={salaryJV.alertType}>
                    {salaryJV.message}
                </Alert>
            </Snackbar>
            <ReactToPrint
                trigger={() => {
                    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                    // to the root node of the returned component as it will be overwritten.
                    return <Button className="employeesalary-savebtn d-none" ref={printButton}>
                        Print Slip
                    </Button>;
                }}
                content={() => componentRef.current}
            />
        </div>
    )
}

export default SalaryJV
