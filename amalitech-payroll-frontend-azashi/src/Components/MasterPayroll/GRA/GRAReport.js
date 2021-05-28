import React, {useState} from "react";
import useTable from "../../useTable";
import "../../../index.css";
import {TableBody, TableCell, TableRow, InputAdornment, Snackbar} from "@material-ui/core";
import { FormControl } from '@material-ui/core';
import { Grid, TextField } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { BounceLoader } from "react-spinners";
import DialogPageLoader from "../../DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import {makeStyles} from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import {Alert} from "@material-ui/lab";
import {totalsReducer} from '../../../Services/_redux/totals/totals_slice'
import {useSelector} from 'react-redux';
import {payrollReducer} from "../../../Services/_redux/payroll/payroll-slice";
import {payrollReportReducer} from "../../../Services/_redux/payrollReport/payroll-report-slice";

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
function GRAReport({updateFunction}) {
    const classes = useStyles();
    const payrollState = useSelector(payrollReducer)
    const totals = useSelector(totalsReducer)
    const bonusTotals = totals.bonus
    const report = useSelector(payrollReportReducer)
    const emp = report.gra
    const headCells = [
        { id: 'no', label: 'NO.', disableSorting: true },
        { id: 'name', label: 'NAME OF EMPLOYEE', disableSorting: true },
        { id: 'staffId', label: 'STAFF ID', disableSorting: true },
        { id: 'position', label: 'POSITION', disableSorting: true },
        { id: 'tin', label: 'TIN', disableSorting: true },
        { id: 'basicSalary', label: 'BASIC SALARY', disableSorting: true },
        { id: 'bonus', label: 'BONUS', disableSorting: true },
        { id: 'netBonus', label: 'NET BONUS', disableSorting: true },
        { id: 'grossSalary', label: 'GROSS SALARY', disableSorting: true },
        { id: 'employeeSsf', label: 'EMPLOYEE\'S SSF', disableSorting: true },
        { id: 'taxReliefs', label: 'TAX RELIEFS', disableSorting: true },
        { id: 'totalRelief', label: 'TOTAL RELIEF', disableSorting: true },
        { id: 'taxableIncome', label: 'TAXABLE INCOME', disableSorting: true },
        { id: 'paye', label: 'PAYE', disableSorting: true },
        { id: 'TaxBonus', label: 'TAX BONUS', disableSorting: true },
        { id: 'totalTaxDeductNdPayable', label: 'TOTAL TAX DEDUCTIBLE & PAYABLE', disableSorting: true },
    ]
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [requestDialog, setRequestDialog] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')
    const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }

    const handleRequestDialog = () => {
        setRequestDialog(false)
    }

    const updateToNextPage = (page) => {
        updateFunction((page - 1))
    }

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
                                        className="mt-3"
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
                        <div className="col-md-8">
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
                            (!emp.data.content || recordsAfterPagingAndSorting()?.length <= 0 || recordsAfterPagingAndSorting()[0].payrolls.length <= 0) ? (
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
                                        recordsAfterPagingAndSorting()?.map((item, i) =>{
                                            if (item.payrolls.length > 0){
                                                return (<TableRow key={item.employeeNumber} style={{backgroundColor:"#ffffff", border:"5px solid #f0f0f7"}}>
                                                    <TableCell>{(i + 1)}</TableCell>
                                                    <TableCell>{item.lastName + ' ' + item.firstName + ' ' }{(item.middleName !== 'null' ? item.middleName : '')}</TableCell>
                                                    <TableCell>{item.payrolls[0].employeeNumber}</TableCell>
                                                    <TableCell>{item.payrolls[0].employeePosition}</TableCell>
                                                    <TableCell>{item.customTIN}</TableCell>
                                                    <TableCell>GH¢{item.payrolls[0].basicSalary.toFixed(2)}</TableCell>
                                                    <TableCell>GH¢{item.payrolls[0].bonusTotal.toFixed(2)}</TableCell>
                                                    <TableCell>GH¢{item.payrolls[0].totalNetBonus.toFixed(2)}</TableCell>
                                                    <TableCell>GH¢{item.payrolls[0].grossSalary.toFixed(2)}</TableCell>
                                                    <TableCell>{item.payrolls[0].employeeSSF.toFixed(2)}</TableCell>
                                                    <TableCell>GH¢{item.payrolls[0].taxRelief.toFixed(2)}</TableCell>
                                                    <TableCell>GH¢{(item.payrolls[0].taxRelief + item.payrolls[0].employeeSSF).toFixed(2)}</TableCell>
                                                    <TableCell>GH¢{item.payrolls[0].taxableIncome.toFixed(2)}</TableCell>
                                                    <TableCell>GH¢{item.payrolls[0].paye.toFixed(2)}</TableCell>
                                                    <TableCell>GH¢{item.payrolls[0].totalTaxOnBonus.toFixed(2)}</TableCell>
                                                    <TableCell>GH¢{(item.payrolls[0].paye + item.payrolls[0].totalTaxOnBonus).toFixed(2)}</TableCell>
                                                </TableRow>)
                                            }
                                            }
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
                        <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.basicSalary}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{bonusTotals.data.bonus}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{bonusTotals.data.netBonus}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.grossSalary}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.employeeSSF}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.taxRelief}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong> {payrollState.payrollTotals.data.taxRelief + payrollState.payrollTotals.data.employeeSSF} </strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.taxableIncome}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.paye}</strong></TableCell>
                        <TableCell> <strong>{bonusTotals.data.bonusTax}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{payrollState.payrollTotals.data.bonusTax + payrollState.payrollTotals.data.paye}</strong></TableCell>
                    </TableRow>
            </TblContainer>
            </TableContainer>
        {
            (recordsAfterPagingAndSorting()?.length > 0 && recordsAfterPagingAndSorting()[0].payrolls.length > 0) ? (
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

export default GRAReport;
