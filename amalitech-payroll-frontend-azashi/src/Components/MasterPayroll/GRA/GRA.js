import React, {useEffect, useState} from "react";
import Api from "../../../Services/api";
import useTable from "../../useTable";
import "../../../index.css";
import {TableBody, TableCell, TableRow, InputAdornment, Snackbar} from "@material-ui/core";
import { FormControl } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Grid, Button,TextField } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import PrintToExcel from '../../../Components/PrintToExcel';
import { BounceLoader } from "react-spinners";
import DialogPageLoader from "../../DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import {makeStyles} from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import {logoutUser} from "../../../Services/auth";
import {Alert} from "@material-ui/lab";
import {fetchBonusTotalsWithThunk} from '../../../Services/_redux/totals'
import { fetchCurrentPayrollTotalsWithThunk } from '../../../Services/_redux/payroll/index'
import {employeeReducer} from '../../../Services/_redux/employees/employee-slice'
import {totalsReducer} from '../../../Services/_redux/totals/totals_slice'
import { fetchCurrentPayrollWithThunk } from '../../../Services/_redux/payroll/index'
import {useDispatch, useSelector} from 'react-redux';
import {payrollReducer} from "../../../Services/_redux/payroll/payroll-slice";
import {getErrorCode, pageNumbering} from "../../../Services/employeeService";

const useStyles = makeStyles((theme) => ({
    table: {
        width: 1197,
    },
    button: {
        margin: theme.spacing(1.5, 0.3, 1, 0.1)
    },
    root: {
        flexGrow: 1,
    },
    tableContainer: {
        maxHeight: '70vh',
    },
    totalsStyling: {
        backgroundColor: '#f5f6fa',
        color: '#cf4f1f'
    }

}));
function GRA() {
    const classes = useStyles();
    const payrollState = useSelector(payrollReducer)
    const emp = payrollState.payroll;
    const totals = useSelector(totalsReducer)
    const bonusTotals = totals.bonus
    const dispatch = useDispatch()
    const headCells = [
        { id: 'no', label: 'NO.', disableSorting: true },
        { id: 'name', label: 'NAME OF EMPLOYEE', disableSorting: true },
        { id: 'staffId', label: 'EMPLOYEE ID', disableSorting: true },
        { id: 'position', label: 'JOB TITLE', disableSorting: true },
        { id: 'tin', label: 'TIN', disableSorting: true },
        { id: 'basicSalary', label: 'BASIC SALARY (GH¢)', disableSorting: true },
        { id: 'bonus', label: 'BONUS (GH¢)', disableSorting: true },
        { id: 'netBonus', label: 'NET BONUS (GH¢)', disableSorting: true },
        { id: 'grossSalary', label: 'GROSS SALARY (GH¢)', disableSorting: true },
        { id: 'employeeSsf', label: 'EMPLOYEE\'S SSF (GH¢)', disableSorting: true },
        { id: 'taxReliefs', label: 'TAX RELIEFS (GH¢)', disableSorting: true },
        { id: 'totalRelief', label: 'TOTAL RELIEF (GH¢)', disableSorting: true },
        { id: 'taxableIncome', label: 'TAXABLE INCOME (GH¢)', disableSorting: true },
        { id: 'paye', label: 'PAYE (GH¢)', disableSorting: true },
        { id: 'TaxBonus', label: 'TAX BONUS (GH¢)', disableSorting: true },
        { id: 'totalTaxDeductNdPayable', label: 'TOTAL TAX DEDUCTIBLE & PAYABLE (GH¢)', disableSorting: true },
    ]
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [headers, setHeaders] = useState([
        'Name of Employee',
        'Staff ID',
        'Position',
        'Tin',
        'Basic Salary (GH¢)',
        'Gross Salary (GH¢)',
        'Employee\'s SSF (GH¢)',
        'Tax Reliefs (GH¢)',
        'Total Relief (GH¢)',
        'Taxable Income (GH¢)',
        'PAYE (GH¢)',
        'Total Tax Deductible & Payable (GH¢)',
        ]);
    const [requestDialog, setRequestDialog] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')
    const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }

    const currentMonthPayslip = () => {
        return (new Date().getMonth() + 1)
    }
    const currentYearPayslip = () => {
        return new Date().getFullYear()
    }
    const getCurrentPayslip = (payslips) => {
        if (payslips.length > 0) {
            return payslips.filter((payslip) => {
                return (payslip.month === currentMonthPayslip() && payslip.year === currentYearPayslip())
            }) || []
        } else {
            return []
        }
    }

    const handleRequestDialog = () => {
        setRequestDialog(false)
    }

    const updateToNextPage = (page) => {
        getSsnit((page - 1)).then(() => {}).catch(() => {})
    }
    const getSsnit = async (page) => {
        dispatch(fetchCurrentPayrollWithThunk({page:page}))
    };

    // FETCHING SUMMATION FROM BACKEND
    const getSummation =  async () => {
        dispatch(fetchCurrentPayrollTotalsWithThunk())
        }

    // FETCHING SUMMATION FOR BONUSES FROM SERVER
    const getBonusSummation =  async () => {
       dispatch(fetchBonusTotalsWithThunk())
        }


    const getCurrentMonthYear = () => {
        const year =  new Date().getFullYear()
        const month = (new Date().toLocaleString('default', { month: 'long' }))
        return `${year} ${month}`
    }

    const handleErrorResponse = (error) => {
        if (error.response.status === 401) {
            handleAlertState(true, 'error', 'You are not authorized to perform this operation')
        } else if (error.response.status === 416) {
            logoutUser()
            window.location.reload()
        }
    }
    /*fetch full data from server*/
    const exportData = async () => {
        setRequestDialog(true)
        Api().get('/payrolls/all-payrolls').then((response) => {
            const data = []
            if (response.data.length > 0){
                response.data.map((e) => {
                    console.log("data", e)
                    const d = {
                        fullName: `${e.lastName}, ${e.firstName} ${e.middleName || ""}`,
                        employeeNumber: e.employeeNumber,
                        jobTitle: e.employeePosition,
                        customTIN: e.customTIN,
                        basicSalary: e.basicSalary.toFixed(2),
                        grossSalary: e.grossSalary.toFixed(2),
                        employeeSSF: e.employeeSSF.toFixed(2),
                        taxRelief: e.taxRelief.toFixed(2),
                        totalReliefs: (e.taxRelief + e.employeeSSF).toFixed(2),
                        taxableIncome: e.taxableIncome.toFixed(2),
                        paye: e.paye.toFixed(2),
                        payableNetSalary: (e.paye + e.totalTaxOnBonus).toFixed(2)
                    }
                    data.push(d)
                })
                setRequestDialog(false)
                const date = getCurrentMonthYear()
                const title = `GRA REPORT FOR ${date}`
                PrintToExcel({data, title: title.toUpperCase(), headers, filename: `gra_report_for_${getCurrentMonthYear()}`})
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


    useEffect(() => {
        const page = emp.data.pageable?.pageNumber || 0
        getSsnit(page).then(() => {}).catch(() => {})
        getSummation().then(() => {}).catch(() => {})
        getBonusSummation().then(() => {}).catch(() => {})
    }, []);

    useEffect(() => {
        if (emp.status === 'Failed'){
            if(getErrorCode(emp?.errorCode?.error?.message).includes('416')) {
                const error = {
                    response: {
                        status: 416
                    }
                }
                handleErrorResponse(error)
            }
            else if (getErrorCode(emp?.errorCode?.error?.message).includes('401')) {
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
    }, [emp.status]);
    const {
        TblContainer,
        TblHeadTwo,
        TablePaginations,
        recordsAfterPagingAndSorting
    } = useTable(emp.data, headCells, filterFn, updateToNextPage);
    
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
                            x.employeeNumber?.toLowerCase().match(target.value.toLowerCase())
                    )
            }
        })
    }

    return (
        <div>
            <div className="row">
                    <div className="col-md-4 mb-2">

                        {/* EMPLOYEE SEARCH */}
                                    <FormControl
                                        size="small"
                                        fullWidth="true"
                                        className=""
                                        color="primary"
                                    >
                                        <TextField 
                                            size="small"
                                            type="search"
                                            color="primary"
                                            variant={"outlined"}
                                            label="Search Employee"
                                            className="bg-white"
                                            InputProps={{startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search />
                                                    </InputAdornment>
                                                )}}
                                            onInput={(event) => handleSearch(event)}/>
                                    </FormControl>
                        </div>


                        {/* DEPARTMENT FILTER */}
                        <div className="col-md-6">
                        </div>

                        <div className="col-md-2 mb-2">
                            <Button
                                className="text-capitalize greyedBtn"
                                variant="contained"
                                size="small"
                                color="primary"
                                startIcon={<CloudUploadIcon />}
                                onClick={() => {exportData()}}
                            >
                                Export Taxes
                            </Button>
                        </div>
                    
            </div>

    <div className="row">
            {/* EXPORT BUTTON */}
            <Grid item md={12} lg={12} sm={12} xs={12}>

            </Grid>
        </div>
        <div className="table-responsive">
            <TableContainer className={classes.tableContainer}>
            <TblContainer>
                <TblHeadTwo
                />
                    {
                        emp.preloader ? (
                            <TableRow
                            >
                                <TableCell colspan={16}>
                                    <div className="w-100 d-flex justify-content-center text-center">
                                        <BounceLoader size={90} color="#cf4f1f" loading />
                                    </div>
                                </TableCell>
                            </TableRow>
                            ) :
                            (recordsAfterPagingAndSorting()?.length <= 0) ? (
                                <TableRow
                                >
                                    <TableCell colspan={16}>
                                        <div className="w-100 d-flex justify-content-center text-center">
                                        <p style={{fontSize: "1rem"}}>
                                            <strong>No Data Available</strong>
                                        </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableBody>
                                    {
                                        recordsAfterPagingAndSorting()?.map((item, i) =>
                                            (<TableRow key={item.employeeNumber} style={{backgroundColor:"#ffffff", border:"5px solid #f0f0f7"}}>
                                                <TableCell>{(i + 1) + pageNumbering(emp.data.number)}</TableCell>
                                                <TableCell>{item.lastName + ' ' + item.firstName + ' ' }{(item.middleName !== 'null' ? item.middleName : '')}</TableCell>
                                                <TableCell>{item.employeeNumber}</TableCell>
                                                <TableCell>{item.employeePosition}</TableCell>
                                                <TableCell>{item.customTIN}</TableCell>
                                                <TableCell>{item.basicSalary.toFixed(2)}</TableCell>
                                                <TableCell>{item.bonusTotal.toFixed(2)}</TableCell>
                                                <TableCell>{item.totalNetBonus.toFixed(2)}</TableCell>
                                                <TableCell>{item.grossSalary.toFixed(2)}</TableCell>
                                                <TableCell>{item.employeeSSF.toFixed(2)}</TableCell>
                                                <TableCell>{item.taxRelief.toFixed(2)}</TableCell>
                                                <TableCell>{(item.taxRelief + item.employeeSSF).toFixed(2)}</TableCell>
                                                <TableCell>{item.taxableIncome.toFixed(2)}</TableCell>
                                                <TableCell>{item.paye.toFixed(2)}</TableCell>
                                                <TableCell>{item.totalTaxOnBonus.toFixed(2)}</TableCell>
                                                <TableCell>{(item.paye + item.totalTaxOnBonus).toFixed(2)}</TableCell>
                                            </TableRow>)

                                        )
                                    }
                                </TableBody>
                            )
                    }

                    {/* TOTALS */}
                    <TableRow className={classes.totalsStyling}>
                        <TableCell> <strong>TOTALS</strong></TableCell>
                        <TableCell> <strong /></TableCell>
                        <TableCell> <strong /></TableCell>
                        <TableCell> <strong /></TableCell>
                        <TableCell> <strong /></TableCell>
                        <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.basicSalary?.toFixed(2)}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{bonusTotals.data.bonus?.toFixed(2)}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{bonusTotals.data.netBonus?.toFixed(2)}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.grossSalary?.toFixed(2)}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.employeeSSF?.toFixed(2)}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.taxRelief?.toFixed(2)}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong> {(payrollState.payrollTotals.data.taxRelief + payrollState.payrollTotals.data.employeeSSF).toFixed(2)} </strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.taxableIncome?.toFixed(2)}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.paye?.toFixed(2)}</strong></TableCell>
                        <TableCell> <strong>{bonusTotals.data.bonusTax?.toFixed(2)}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{(payrollState.payrollTotals.data.bonusTax + payrollState.payrollTotals.data.paye).toFixed(2)}</strong></TableCell>
                    </TableRow>
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
        </div>
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

export default GRA;
