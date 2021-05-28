import React, {useEffect, useState} from "react";
import Api from "../../Services/api";
import useTable from "../useTable";
import "../../index.css";
import {TableBody, TableCell, TableRow, InputAdornment, Snackbar} from "@material-ui/core";
import { FormControl } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Grid, Button,TextField } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import PrintToExcel from '../../Components/PrintToExcel';
import { BounceLoader } from "react-spinners";
import DialogPageLoader from "../DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {fetchCurrentPayrollBonusWithThunk} from "../../Services/_redux/payroll";
import {useDispatch, useSelector} from "react-redux";
import {payrollReducer} from "../../Services/_redux/payroll/payroll-slice";
import {pageNumbering} from "../../Services/employeeService";
import {logoutUser} from "../../Services/auth";
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    totalsStyling: {
        backgroundColor: '#f5f6fa',
        color: '#cf4f1f'
    }

}));

const Bonuses = () => {

    const classes = useStyles();

    const headCells = [
        { id: 'no', label: 'NO.', disableSorting: true },
        { id: 'name', label: 'NAME OF EMPLOYEE', disableSorting: true },
        { id: 'staffId', label: 'STAFF ID', disableSorting: true },
        { id: 'bonus', label: 'BONUS', disableSorting: true },
        { id: 'tax', label: 'TAX', disableSorting: true },
        { id: 'netBonus', label: 'NET BONUS', disableSorting: true },
    ]

    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [bonusTotals, setBonusTotals] = useState([])
    const [headers, setHeaders] = useState([
        'Name of Employee',
        'Employee ID',
        'Bonus',
        'Tax',
        'Net Bonus',
        ]);
    const payroll = useSelector(payrollReducer);
    const emp = payroll.bonus
    const dispatch = useDispatch()
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')
    const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }


    const [requestDialog, setRequestDialog] = useState(false);

    const handleRequestDialog = () => {
        setRequestDialog(false)
    }

    const getCurrentMonthYear = () => {
        const year =  new Date().getFullYear()
        const month = (new Date().toLocaleString('default', { month: 'long' }))
        return `${year} ${month}`
    }

    // FUNCTION TO GET DATA FROM SERVER TO EXPORT
    const exportData = () => {
        setRequestDialog(true)
        Api().get('/bonuses/with-bonus/all').then((response) => {
            /*loop through the data to construct new date for export*/
            const data = []

            if (response.data.length > 0){
            response.data.map((e) => {
                const d = {
                    fullName: `${e.lastName}, ${e.firstName} ${e.middleName === null || e.middleName === 'null' ? '' : e.middleName}`,
                    employeeNumber: e.employeeNumber,
                    bonusTotal: e.bonusTotal.toFixed(2),
                    totalTaxOnBonus: e.totalTaxOnBonus.toFixed(2),
                    totalNetBonus: e.totalNetBonus.toFixed(2),
                }
                data.push(d)
            })
            setRequestDialog(false)
            if (data.length > 0) {
                const date = getCurrentMonthYear()
                const title = `BONUS REPORT FOR ${date}`
                PrintToExcel({data, title: title.toUpperCase(), headers, filename: `bonus_report_for_${date}`})
            } else {
                handleAlertState(true, 'error', 'No data available to export')
            }
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

    // FUNCTION TO FETCH LIST OF BONUSES
    const getBonuses = async (page) => {
        dispatch(fetchCurrentPayrollBonusWithThunk({page:page}))
    }

    const updateToNextPage = (page) => {
        getBonuses((page-1)).then(() => {}).catch(() => {})
    }
    // FETCHING SUMMATION FOR BONUSES FROM SERVER
    const getBonusSummation =  async () => {
        const totalSum = await Api().get('/sum/bonus')
        setBonusTotals(totalSum.data)
    }

    useEffect(() => {
        const page = emp.data.pageable?.pageNumber || 0
        getBonuses(page).then().catch()
        getBonusSummation().then().catch()
    }, [])

        // FUNCTIONT TO SEARCH FOR EMPLOYEE
        const handleSearch = e => {
            let target = e.target;
            setFilterFn({
                fn: items => {
                    if (target.value === "")
                        return items;
                    else
                        return items.filter(
                            x => x.lastName?.toLowerCase().match(target.value.toLowerCase()) ||
                                 x.firstName?.toLowerCase().match(target.value.toLowerCase()) ||
                                 x.middleName?.toLowerCase().match(target.value.toLowerCase()) ||
                                 x.employeeNumber?.toLowerCase().match(target.value.toLowerCase())
                        )
                }
            })
        }


    const {
        TblContainer,
        TblHeadTwo,
        TablePaginations,
        recordsAfterPagingAndSorting
    } = useTable(emp.data, headCells, filterFn, updateToNextPage);

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
                                                variant={"outlined"}
                                                label="Search Employee"
                                                className="bg-white"
                                                InputProps={{startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search />
                                                    </InputAdornment>
                                                )}}
                                            onInput={(e) => { handleSearch(e) }} />
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
                                style={{width: "130px"}}
                            >
                                Export Bonus
                            </Button>
                        </div>
                    
            </div>

            <div className="row">
                {/* EXPORT BUTTON */}
                <Grid item md={12} lg={12} sm={12} xs={12}>

                </Grid>
            </div>

            <div className="table-responsive">
                <TblContainer>
                    <TblHeadTwo
                    />
                        {
                            emp.preloader ? (
                                <TableRow
                                >
                                    <TableCell colspan={7}>
                                        <div className="w-100 d-flex justify-content-center text-center">
                                            <BounceLoader size={90} color="#cf4f1f" loading />
                                        </div>
                                    </TableCell>
                                </TableRow>
                                ) :
                                recordsAfterPagingAndSorting()?.length <= 0 ? (
                                    <TableRow
                                    >
                                        <TableCell colspan={7}>
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
                                                    <TableCell>{(item.bonusTotal).toFixed(2)}</TableCell>
                                                    <TableCell>{(item.totalTaxOnBonus).toFixed(2)}</TableCell>
                                                    <TableCell>{(item.totalNetBonus).toFixed(2)}</TableCell>
                                                </TableRow>)
                                            )
                                        }
                                    </TableBody>
                                )
                        }

                {/* TOTALS */}
                    <TableRow className={classes.totalsStyling}>
                        <TableCell> <strong>TOTALS</strong></TableCell>
                        <TableCell> <strong></strong></TableCell>
                        <TableCell> <strong></strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{bonusTotals.bonus}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{bonusTotals.bonusTax}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{bonusTotals.netBonus}</strong></TableCell>
                    </TableRow>
                </TblContainer>     
                {
                    (recordsAfterPagingAndSorting()?.length > 0) ? (
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

export default Bonuses;
