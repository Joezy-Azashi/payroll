import React, { useState } from 'react'
import ReportFilter from '../../Components/Reports/ReportFilter';
import GRAReport from "../../Components/MasterPayroll/GRA/GRAReport"
import {getDataForExport, getErrorCode, getCurrentMonthYear} from "../../Services/employeeService";
import {logoutUser} from "../../Services/auth";
import {fetchGraReportWithThunk} from "../../Services/_redux/payrollReport";
import PrintToExcel from "../../Components/PrintToExcel";
import {useDispatch, useSelector} from "react-redux";
import {handleStateAlert, payrollReportReducer} from "../../Services/_redux/payrollReport/payroll-report-slice";
import Dialog from "@material-ui/core/Dialog";
import DialogPageLoader from "../../Components/DialogPageLoader";
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

function GRA() {

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
    const [title, setTitle] = useState('GRA REPORT');
    const [headers, setHeaders] = useState([
        'Name of Employee',
        'Staff ID',
        'Position',
        'Tin',
        'Basic Salary',
        'Gross Salary',
        'Employee\'s SSF',
        'Tax Reliefs',
        'Total Relief',
        'Taxable Income',
        'PAYE',
        'Total Tax Deductible & Payable',
    ]);
    const report = useSelector(payrollReportReducer)
    const dispatch = useDispatch()
    const emp = report.gra
    const toExport = report.exportData
    const handleRequestDialog = () => {
        setRequestDialog(false)
    }
    const handleAlertState = (openAlert, alertType, message) => {
        dispatch(handleStateAlert({openAlert, alertType, message, type: 'gra'}))
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
        await dispatch(fetchGraReportWithThunk({page:page, data:data}))
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
                            employeeNumber: e.payrolls[0].employeeNumber,
                            jobTitle: e.payrolls[0].employeePosition,
                            customTIN: e.customTIN,
                            basicSalary: e.payrolls[0].basicSalary.toFixed(2),
                            grossSalary: e.payrolls[0].grossSalary.toFixed(2),
                            employeeSSF: e.payrolls[0].employeeSSF.toFixed(2),
                            taxRelief:  e.payrolls[0].taxRelief.toFixed(2)  ,
                            totalReliefs: (e.payrolls[0].taxRelief + e.payrolls[0].employeeSSF).toFixed(2),
                            taxableIncome: e.payrolls[0].taxableIncome.toFixed(2),
                            paye: e.payrolls[0].paye,
                            totalTaxDeductNdPayable: (e.payrolls[0].paye + e.payrolls[0].totalTaxOnBonus).toFixed(2)
                        }
                        data.push(d)
                    }
                })
                setRequestDialog(false)
                if (data.length > 0) {
                    const date = getCurrentMonthYear()
                    const title = `GRA REPORT FOR ${date}`
                    PrintToExcel({data, title: title.toUpperCase(), headers, filename: `gra_report_for_${date}` })
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
                <h3 className="lead-title ml-3"> GRA </h3>
            </div>
                <ReportFilter filterFunction={filterFunction} exportFunction={exportFunction} initialFetch={initialFetch} dateChange={dateChange}/>
             <GRAReport updateFunction={updateFunction}/>
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

export default GRA
