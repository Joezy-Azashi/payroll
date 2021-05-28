import React, { useState, useEffect }  from 'react'
import { Card, Button, Dialog } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import '../../index.css'
import moment from 'moment';
import ReportFilter from './ReportFilter';
import {getErrorCode} from "../../Services/employeeService";
import {logoutUser} from "../../Services/auth";
import {fetchMonthlyPayrollReportWithThunk} from "../../Services/_redux/payrollReport";
import {useDispatch, useSelector} from "react-redux";
import {handleStateAlert, payrollReportReducer} from "../../Services/_redux/payrollReport/payroll-report-slice";
import {BounceLoader} from "react-spinners";
import {Pagination} from "@material-ui/lab";
import GeneratePayslip from "../GeneratePayslip";

const AllEmployeesPayslipThumbnail = () => {

    const currentYear = () => {
        return new Date().getFullYear()
    }

    const currentMonth = () => {
        return (('0' + ((new Date().getMonth()) + 1))).slice(-2)
    }
    const getDateMonth = () => {
        const year = currentYear()
        const month = currentMonth()
        return { yearMonth: `${year}-${month}`}

    }

    const [date, setDate] = useState(getDateMonth());
    const report = useSelector(payrollReportReducer)
    const dispatch = useDispatch()
    const emp = report.monthlyPayroll
    const toExport = report.exportData

    const handleAlertState = (openAlert, alertType, message) => {
        dispatch(handleStateAlert({openAlert, alertType, message, type: 'tierOne'}))
    }
    const [selectedPayslip, setSelectedPayslip] = useState({})
    const [openSlip, setOpenSlip] = useState(false);

    const getDate = (date) => {
        const month = moment(date, 'YYYY-M').format('MMMM')
        const year = moment(date, 'YYYY-M').format('YYYY')
        return `${month}  ${year}`
    }

    const handleOpenPayslip = (item) => {
        const data = {
            employee: item,
            payslip: item.payrolls[0]
        }
        setSelectedPayslip(data)
        setOpenSlip(true)
    }

    const handleClosePayslip = () => {
        setOpenSlip(false)
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
        await dispatch(fetchMonthlyPayrollReportWithThunk({page:page, data:data}))
    };
    const filterFunction = (date) => {
        const page = 0
        getSsnit(page, date).then(() => {

        }).catch(() => {})
    }
    const dateChange = (date) => {
        setDate(date)
    }
    const initialFetch = (date) => {
        const page = emp.data.pageable?.pageNumber || 0
        getSsnit(page, date).then(() => {

        }).catch(() => {})
    }
    const handleChangePage = (event, newPage) => {
        const page = (newPage - 1)
        getSsnit(page, date).then(() => {
        }).catch(() => {})
    }
    useEffect(() => {
        checkForError()
    }, [emp.status])

    return (
        <div>
            <ReportFilter filterFunction={filterFunction}  initialFetch={initialFetch} dateChange={dateChange} showExport={false}/>
            {
                emp.preloader ? (<div className="w-100 py-5 d-flex justify-content-center text-center">
                    <BounceLoader size={90} color="#cf4f1f" loading />
                </div>) : (
                    (!emp.data?.content || emp.data?.content?.length <= 0 || emp.data?.content[0]?.payrolls?.length <= 0) ?
                        (
                            <div className="w-100 py-5 d-flex justify-content-center text-center align-items-center">
                                <img src={process.env.PUBLIC_URL + '/noData.svg'} alt="notFount"/>
                            </div>
                        ) : (
                            <div className="row pt-3 justify-content-center">
                                {
                                    emp.data?.content?.map((item, i) => (
                                        item?.payrolls?.length > 0 ?
                                            (
                                                <div key={i + 'payslip'} className="cardThumbnail col-xs-12 col-sm-12 col-md-3 col-lg-3">

                                                    {/*OVERLAY*/}
                                                    <div className="cardThumbnailMainOverlay d-flex align-items-center justify-content-center text-center">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleOpenPayslip(item)}
                                                        >
                                                            View
                                                        </Button>
                                                    </div>

                                                    {/*CARD CONTENT*/}
                                                    <Card className="cardThumbnailMain">
                                                        <div className="row cardThumbnailTitle align-items-center justify-content-center text-center"> {item.lastName + ' ' + item.firstName + ' '}{(item.middleName !== 'null' ? item.middleName : '')} </div>
                                                        <div>
                                                            <div align="center" className="mt-2 payslipStyle">
                                                                <label>Payslip for {getDate(`${item.payrolls[0].year}-${item.payrolls[0].month}`)}</label>
                                                            </div>

                                                            {/*STAFF NAME AND ID*/}
                                                            <div className="row payslipStyle mx-2 px-0">
                                                                <div className="col-6 mx-0 px-0">
                                                                    <label className="mx-0 pr-1 cardThumbnailContent">Staff Name:</label>
                                                                    <label className="mx-0 px-0 cardThumbnailEllips cardThumbnailContent">{item.lastName + ' ' + item.firstName + ' '}{(item.middleName !== 'null' ? item.middleName : '')}</label>
                                                                </div>
                                                                <div className="col-6 mx-0 px-0">
                                                                    <label className="mx-0 pr-1 cardThumbnailContent">Staff ID:</label>
                                                                    <label className="mx-0 px-0 cardThumbnailEllips cardThumbnailContent">{item.payrolls[0].employeeNumber}</label>
                                                                </div>
                                                            </div>
                                                            {/*DEPARTMENT AND JOB DESCRIPTION*/}
                                                            <div className="row payslipStyle mx-2 px-0">
                                                                <div className="col-6 mx-0 px-0">
                                                                    <label className="mx-0 pr-1 cardThumbnailContent">Department:</label>
                                                                    <label className="mx-0 px-0 cardThumbnailEllips cardThumbnailContent"> {item.payrolls[0].employeeDepartment} </label>
                                                                </div>
                                                                <div className="col-6 mx-0 px-0">
                                                                    <label className="mx-0 pr-1 cardThumbnailContent">Job Description:</label>
                                                                    <label className="mx-0 cardThumbnailEllips cardThumbnailContent"> {item.payrolls[0].employeePosition} </label>
                                                                </div>
                                                            </div>
                                                            {/*EMAIL AND BASIC SALARY*/}
                                                            <div className="row payslipStyle mx-2 px-0">
                                                                <div className="col-6 mx-0 px-0">
                                                                    <label className="mx-0 pr-1 cardThumbnailContent">Email:</label>
                                                                    <label className="mx-0 px-0 cardThumbnailEllips cardThumbnailContent"> {item.payrolls[0].workEmail} </label>
                                                                </div>
                                                                <div className="col-6 mx-0 px-0">
                                                                    <label className="mx-0 cardThumbnailContent">Basic Salary:</label>
                                                                    <label className="mx-0 cardThumbnailEllips cardThumbnailContent"> {item.payrolls[0].basicSalary} </label>
                                                                </div>
                                                            </div>

                                                        </div>

                                                        {/*TABLE*/}
                                                        <div className="row payslipStyle mx-2 px-0">
                                                            <label style={{fontWeight: 'bold'}} className="cardThumbnailContent">Earnings</label>
                                                        </div>
                                                        <div className="row payslipStyle mx-2 px-0 overflow-hidden">
                                                            <TableContainer className="table-bordered">
                                                                <Table size="small" aria-label="a dense table">
                                                                    <TableRow>
                                                                        <TableCell style={{fontSize: '0.7vw'}}>Basic Salary</TableCell>
                                                                        <TableCell style={{fontSize: '0.7vw'}}>{item.payrolls[0].basicSalary}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{fontSize: '0.7vw'}}>Total Allowance</TableCell>
                                                                        <TableCell style={{fontSize: '0.7vw'}}>{item.payrolls[0].totalAllowance}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{fontSize: '0.7vw'}}>Total Deduction</TableCell>
                                                                        <TableCell style={{fontSize: '0.7vw'}}>{item.payrolls[0].totalDeduction}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{fontSize: '0.7vw'}}>Net salary</TableCell>
                                                                        <TableCell style={{fontSize: '0.7vw'}}>{item.payrolls[0].payableNetSalary}</TableCell>
                                                                    </TableRow>
                                                                </Table>
                                                            </TableContainer>
                                                        </div>
                                                    </Card>

                                                </div>
                                            ) : null
                                    ))
                                }
                            </div>
                        )
                )
            }

            {
                (emp.data.content?.length > 0 && emp.data.content[0].payrolls.length > 0) ? (
                        <div className="row justify-content-center d-flex text-center w-100">
                            <div className="col-md-12 p-3 text-center justify-content-center d-flex">
                                <Pagination
                                    page={(emp.data?.pageable?.pageNumber + 1)}
                                    count={emp.data?.totalPages}
                                    onChange={handleChangePage}
                                    color={"primary"}
                                    shape={"round"}
                                    size={"small"}
                                    variant={"outlined"}
                                />
                            </div>
                        </div>
                    ): null
            }
            <Dialog open={openSlip} onClose={handleClosePayslip} aria-labelledby="form-dialog-title" fullWidth maxWidth="md"
                    classes={{paperFullScreen: "prePrint printDialog"}}
            >
                <GeneratePayslip employee={selectedPayslip}/>
            </Dialog>
        </div>
    )
}

export default AllEmployeesPayslipThumbnail
