import React, {useEffect, useState} from "react";
import useTable from "../../useTable";
import "../../../index.css";
import {TableBody, TableCell, TableRow, InputAdornment, Snackbar} from "@material-ui/core";
import { FormControl  } from '@material-ui/core';
import { Grid, Button, TextField } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Search } from '@material-ui/icons';
import PrintToExcel from '../../PrintToExcel';
import { BounceLoader } from "react-spinners";
import DialogPageLoader from "../../DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import TableContainer from "@material-ui/core/TableContainer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {  logoutUser } from '../../../Services/auth'
import { fetchSsnitWithThunk } from '../../../Services/_redux/statutory'
import { statutoryReducer } from '../../../Services/_redux/statutory/statutory_slice'
import { fetchCurrentPayrollWithThunk } from '../../../Services/_redux/payroll/index';
import {payrollReducer} from '../../../Services/_redux/payroll/payroll-slice'
import {totalsReducer} from '../../../Services/_redux/totals/totals_slice'
import {fetchTier1TotalsWithThunk} from '../../../Services/_redux/totals'
import {useDispatch, useSelector} from 'react-redux';
import { pageNumbering} from "../../../Services/employeeService";
import Api from "../../../Services/api";
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
function Ssnit() {
    const statutory = useSelector(statutoryReducer)
    const pensionPercentage = statutory.ssnit.data
    const payrolls = useSelector(payrollReducer);
    const totalsReducers = useSelector(totalsReducer);
    const tier1Totals = totalsReducers.tier1Totals
    const dispatch = useDispatch()
    const classes = useStyles();
    const getTierOneRate = () => {
        let rate = 13.5
        pensionPercentage?.map((item) => {
            if(item.label === 'Tier 1 Rate'){
                rate = item.percentage
            }
        })
        return rate
    }
    const headCells = [
        { id: 'number', label: 'NO.', disableSorting: true },
        { id: 'name', label: 'NAME OF EMPLOYEE', disableSorting: true },
        { id: 'ssnitNumber', label: 'SSNIT NUMBER', disableSorting: true },
        { id: 'basicSalary', label: 'BASIC SALARY', disableSorting: true },
        { id: 'percentage', label: `SSF (${getTierOneRate()})`, disableSorting: true },
    ]
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [headers, setHeaders] = useState([
        'Name of Employee',
        'SSNIT Number',
        'Basic Salary',
        'SSF' + " " + `(${getTierOneRate()})`
        ]);
    const [requestDialog, setRequestDialog] = useState(false);

    const handleRequestDialog = () => {
        setRequestDialog(false)
    }


    const updateSsnit = (page) => {
        getSsnit((page - 1)).then(() => {}).catch(() => {})
    }
    const getSsnit = async (page) => {
        dispatch(fetchCurrentPayrollWithThunk({page:page}))
        dispatch(fetchSsnitWithThunk())
    };



    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')
    const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }


        // FETCHING SUMMATION FROM BACKEND
        const getSummation =  async () => {
            dispatch(fetchTier1TotalsWithThunk())
            }

    const getCurrentMonthYear = () => {
            const year =  new Date().getFullYear()
            const month = (new Date().toLocaleString('default', { month: 'long' }))
        return `${year} ${month}`
    }

    /*fetch full data from server*/
    const exportData = async() => {
        setRequestDialog(true)
        Api().get('/payrolls/all-payrolls').then((response) => {
            const data = []
            if (response.data.length > 0){
                response.data.map((e) => {
                    const d = {
                        fullName: `${e.lastName}, ${e.firstName} ${e.middleName === null || e.middleName === 'null' ? '' : e.middleName}`,
                        ssnit: e.customSSN,
                        basicSalary: (e.basicSalary).toFixed(2),
                        percentage: (e.tierOne).toFixed(2)
                    }
                    data.push(d)
                })
                setRequestDialog(false)
                const date = getCurrentMonthYear()
                const title = `SSNIT REPORT FOR ${date}`
                PrintToExcel({data, title: title.toUpperCase(), headers, filename: `ssnit_report_for_${getCurrentMonthYear()}`})
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
        getSummation()
        const page = payrolls.payroll.data.pageable?.pageNumber || 0
        getSsnit(page).then(() => {
        }).catch(() => {})
    }, []);

    const {
        TblContainer,
        TblHeadTwo,
        TablePaginations,
        recordsAfterPagingAndSorting
    } = useTable(payrolls.payroll.data, headCells, filterFn, updateSsnit);
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
            <div className="cardColor">

                    <div className=" row cardColor pt-2">

                        {/* EMPLOYEE SEARCH */}
                        <div className="col-md-4 mb-2">
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
                                            onInput={(e) => {
                                            handleSearch(e)
                                            }}
                                            />
                                    </FormControl>
                            </div>
                            <div className="col-md-6">

                            </div>

                        {/* EXPORT BUTTON */}
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
        </div>
        <div className="row">
            {/* BULK SEND BUTTON */}
            <Grid item md="10" lg="10" sm="12" xs="12">

            </Grid>
            <Grid item md="1" lg="1" sm="4" xs="12">

            </Grid>
        </div>
            <div className="table-responsive">
                <TableContainer className={classes.tableContainer}>
                <TblContainer >
                    <TblHeadTwo
                    />
                        {
                            payrolls.payroll?.status === null ||  payrolls.payroll?.status === 'Loading...' ? (
                                <TableRow
                                >
                                    <TableCell colSpan={6}>
                                    <div className="w-100 d-flex justify-content-center text-center">
                                        <BounceLoader size={90} color="#cf4f1f" loading />
                                    </div>
                                    </TableCell>
                                </TableRow>
                                ) :
                                (recordsAfterPagingAndSorting()?.length <= 0) ? (
                                    <TableRow
                                    >
                                        <TableCell colSpan={6}>
                                        <div className="w-100 d-flex justify-content-center text-center">
                                        <p className="">
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
                                                    <TableCell>{(i + 1) + pageNumbering( payrolls.payroll?.data.number)}</TableCell>
                                                    <TableCell>{item.lastName + ' ' + item.firstName + ' '}{(item.middleName !== 'null' ? item.middleName : '')}</TableCell>
                                                    <TableCell>{item.customSSN}</TableCell>
                                                    <TableCell>GH¢{(item.basicSalary).toFixed(2)}</TableCell>
                                                    <TableCell>GH¢{(item.tierOne).toFixed(2)}</TableCell>
                                                </TableRow>)
                                            )
                                        }
                                    </TableBody>
                                )
                        }

                        {/* TOTALS */}
                    <TableRow className={classes.totalsStyling}>
                    </TableRow>
                    <TableRow className={classes.totalsStyling}>
                        <TableCell> <strong>TOTALS</strong></TableCell>
                        <TableCell> <strong></strong></TableCell>
                        <TableCell> <strong></strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{tier1Totals.data.sumBasicSalary?.toFixed(2)}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{tier1Totals.data.sumPercentage?.toFixed(2)}</strong></TableCell>
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

export default Ssnit;
