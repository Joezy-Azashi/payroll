import React, {useEffect, useState} from "react";
import useTable from "../../useTable";
import "../../../index.css";
import {InputAdornment, TableBody, TableCell, TableRow, Snackbar } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import { TextField } from '@material-ui/core';
import { FormControl  } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { BounceLoader } from "react-spinners";
import TableContainer from "@material-ui/core/TableContainer";
import { payrollReducer } from '../../../Services/_redux/payroll/payroll-slice'
import { fetchCurrentPayrollWithThunk, fetchCurrentPayrollTotalsWithThunk } from '../../../Services/_redux/payroll/index'
import {useDispatch, useSelector} from 'react-redux';
import {getErrorCode, pageNumbering} from '../../../Services/employeeService'
import {logoutUser} from "../../../Services/auth";
import {Alert} from "@material-ui/lab";


const useStyles = makeStyles((theme) => ({
    tableContainer: {
        maxHeight: '70vh',
    },

    totalsStyling: {
        backgroundColor: '#f5f6fa',
        color: '#cf4f1f'
    }

}));
 function Payroll() {

     const payrollState = useSelector(payrollReducer)
     const dispatch = useDispatch()
    const classes = useStyles();
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')
    const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }
    /*table headers*/
    const headCells = [
        { id: 'number', label: 'NO.', disableSorting: true },
        { id: 'employeeName', label: 'EMPLOYEE NAME', disableSorting: true },
        { id: 'employeeNumber', label: 'EMPLOYEE ID', disableSorting: true },
        { id: 'employeePosition', label: 'JOB TITLE', disableSorting: true },
        { id: 'basicSalary', label: 'BASIC SALARY (GH¢)', disableSorting: true },
        { id: 'totalAllowance', label: 'TOTAL ALLOWANCE (GH¢)', disableSorting: true },
        { id: 'grossSalary', label: 'GROSS SALARY (GH¢)', disableSorting: true },
        { id: 'employeeSff', label: 'EMPLOYEE SSF (GH¢)', disableSorting: true },
        { id: 'TaxRelief', label: 'TAX RELIEF (GH¢)', disableSorting: true },
        { id: 'taxableIncome', label: 'TAXABLE INCOME (GH¢)', disableSorting: true },
        { id: 'paye', label: 'PAYE (GH¢)', disableSorting: true },
        { id: 'totalDeductions', label: 'TOTAL DEDUCTION (GH¢)', disableSorting: true },
        { id: 'netSalary', label: 'NET SALARY (GH¢)', disableSorting: true },
    ]
    /*table records*/
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })

    /*update table from pagination button click*/
    const updatePayroll = (page) => {
        page = (page - 1)
        dispatch(fetchCurrentPayrollWithThunk({page}))
    }

    const getSalary = async () => {
        const page = payrollState.payroll.data.pageable?.pageNumber || 0
        await dispatch(fetchCurrentPayrollWithThunk({page}))
        checkForError()
    }

    // FETCHING SUMMATION FROM BACKEND
    const getSummation =  async () => {
        /*fetch totals*/
        dispatch(fetchCurrentPayrollTotalsWithThunk())
    }

    const handleErrorResponse = (error) => {
        if (error.response.status === 401) {
            handleAlertState(true, 'error', 'You are not authorized to perform this operation')
        } else if (error.response.status === 416) {
            logoutUser()
            window.location.reload()
        } else {
            handleAlertState(true, 'error', 'Error occurred while performing this operation')
        }
    }


    /*check if there was an error while fetching the data*/
     const checkForError = () => {
         if (payrollState.payroll.status === 'Failed') {
             if (getErrorCode(payrollState.payroll.statusCode).includes('416')) {
                 logoutUser()
                 window.location.reload()
             }
         }
     }

     const cancelSearch = () => {
        updatePayroll()
     }

    useEffect(() => {
        getSalary().then(() => {
        }).catch(() => {})
        getSummation().then(() => {}).catch(() => {})
    }, []);

     useEffect(() => {
         if (payrollState?.payroll?.status === 'Failed'){
             if(getErrorCode(payrollState?.payroll?.errorCode?.error?.message).includes('416')) {
                 const error = {
                     response: {
                         status: 416
                     }
                 }
                 handleErrorResponse(error)
             }
             else if (getErrorCode(payrollState?.payroll?.errorCode?.error?.message).includes('401')) {
                 const error = {
                     response: {
                         status: 401
                     }
                 }
                 handleErrorResponse(error)
             } else {
                 const error = {
                     response: {
                         status: 400
                     }
                 }
                 handleErrorResponse(error)
             }

         }
     }, [payrollState.payroll.status]);
    const {
        TblContainer,
        TblHeadTwo,
        TablePaginations,
        recordsAfterPagingAndSorting,
    } = useTable(payrollState.payroll.data, headCells, filterFn, updatePayroll);

    const handleSearch = (value) => {
        setFilterFn({
            fn: items => {
                if (value === "")
                    return items;
                else
                    return items.filter(
                        x => x.firstName?.toLowerCase().match(value.toLowerCase()) ||
                            x.lastName?.toLowerCase().match(value.toLowerCase()) ||
                            x.employeeNumber?.toLowerCase().match(value.toLowerCase()) ||
                            x.employeeDepartment?.toLowerCase().match(value.toLowerCase()) ||
                            x.employeePosition?.toLowerCase().match(value.toLowerCase())
                    )
            }
        })
    }

    return(
        <div>
            <div className="cardColor">
                    <div className=" row cardColor pt-2 pb-3">
                        
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
                                            handleSearch(e.target.value)
                                        }}
                                        onCancelSearch={cancelSearch}
                                        label="Search Payroll" />
                                    </FormControl>
                                </div>
                    </div>
        </div>
        <div className="table-responsive">
            <TableContainer className={classes.tableContainer}>
            <TblContainer>
                <TblHeadTwo/>
                    {
                        payrollState.payroll.preloader ? (
                            <TableRow
                            >
                                <TableCell colSpan={16}>
                                <div className="w-100 d-flex text-center justify-content-center ">
                                    <BounceLoader size={90} color="#cf4f1f" loading />
                                </div>
                                </TableCell>
                            </TableRow>
                            ) :
                            recordsAfterPagingAndSorting()?.length <= 0 ? (
                                <TableRow
                                >
                                    <TableCell colSpan={16}>
                                <div className="w-100 d-flex text-center justify-content-center ">
                                    <p style={{fontSize: "1rem"}}>
                                        <strong>No Data Availabe</strong>
                                    </p>
                                </div>
                                </TableCell>
                                </TableRow>
                            ) : (
                                <TableBody>
                                    {
                                        recordsAfterPagingAndSorting()?.map((item, i) =>
                                            (<TableRow key={item.payrollId} style={{backgroundColor:"#ffffff", border:"5px solid #f0f0f7"}}>
                                                <TableCell>{(i + 1) + pageNumbering(payrollState.payroll.data.number)}</TableCell>
                                                <TableCell>{item.lastName + ' ' + item.firstName + ' '}{(item.middleName !== 'null' ? item.middleName : '')}</TableCell>
                                                <TableCell>{item.employeeNumber}</TableCell>
                                                <TableCell>{item.employeePosition}</TableCell>
                                                <TableCell>{item.basicSalary.toFixed(2)}</TableCell>
                                                <TableCell>{item.totalAllowance.toFixed(2)}</TableCell>
                                                <TableCell>{item.grossSalary.toFixed(2)}</TableCell>
                                                <TableCell>{item.employeeSSF.toFixed(2)}</TableCell>
                                                <TableCell>{item.taxRelief.toFixed(2)}</TableCell>
                                                <TableCell>{item.taxableIncome.toFixed(2)}</TableCell>
                                                <TableCell>{item.paye.toFixed(2)}</TableCell>
                                                <TableCell>{item.totalDeduction.toFixed(2)}</TableCell>
                                                <TableCell>{item.netSalary.toFixed(2)}</TableCell>
                                            </TableRow>)
                                        )
                                    }
                                </TableBody>
                            )
                    }

                    {/* TOTALS */}
                    {
                        payrollState.payrollTotals.preloader ? (
                            <TableRow
                            >
                                <TableCell colSpan={16}>
                                    <div className="w-100 d-flex text-center justify-content-center ">
                                        <BounceLoader size={40} color="#cf4f1f" loading />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow className={classes.totalsStyling}>
                                <TableCell> <strong>TOTALS</strong></TableCell>
                                <TableCell> <strong></strong></TableCell>
                                <TableCell> <strong></strong></TableCell>
                                <TableCell> <strong></strong></TableCell>
                                <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.basicSalary?.toFixed(2)}</strong></TableCell>
                                <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.allowance?.toFixed(2)}</strong></TableCell>
                                <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.grossSalary?.toFixed(2)}</strong></TableCell>
                                <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.employeeSSF?.toFixed(2)}</strong></TableCell>
                                <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.taxRelief?.toFixed(2)}</strong></TableCell>
                                <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.taxableIncome?.toFixed(2)}</strong></TableCell>
                                <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.paye?.toFixed(2)}</strong></TableCell>
                                <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.deductions?.toFixed(2)}</strong></TableCell>
                                <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.netSalary?.toFixed(2)}</strong></TableCell>
                            </TableRow>
                        )
                    }

            </TblContainer>
            </TableContainer>
            {
                recordsAfterPagingAndSorting()?.length > 0 ? (
                    <div className="row justify-content-center d-flex text-center w-100">
                        <div className="col-md-12 p-3 text-center justify-content-center d-flex">
                            <TablePaginations />
                        </div>
                    </div>
                ) : null
            }
             <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => handleAlertState(false, '', '')}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert  severity={alertType}>
                {alertMessage}
            </Alert>
        </Snackbar>
        </div>
        </div>
    )
}

export default Payroll;
