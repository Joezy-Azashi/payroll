import React, {useEffect, useState} from "react";
import Api from "../../../Services/api";
import useTable from "../../useTable";
import "../../../index.css";
import { withStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {InputAdornment, Snackbar, TableBody, TableCell, TableRow} from "@material-ui/core";
import { FormControl, Menu, MenuItem } from '@material-ui/core';
import { Grid, Button, TextField, ListItemText } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import PrintToExcel from '../../../Components/PrintToExcel';
import { BounceLoader } from "react-spinners";
import DialogPageLoader from "../../DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import {useDispatch, useSelector} from "react-redux";
import { payrollReducer } from '../../../Services/_redux/payroll/payroll-slice'
import { fetchCurrentPayrollWithThunk } from '../../../Services/_redux/payroll/index'
import {getErrorCode, pageNumbering} from "../../../Services/employeeService";
import {Alert} from "@material-ui/lab";
import {logoutUser} from "../../../Services/auth";

const StyledMenu = withStyles({
        paper: {
        border: '1px solid #d3d4d5',
        // maxWidth: '100%'
        },
    })
  
  ((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));
  
  const StyledMenuItem = withStyles((theme) => ({
    root: {
      '&:hover': {
        backgroundColor: theme.palette.primary.main
      },
    },
  }))(MenuItem);

function BankAdvice() {

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const headCells = [
        { id: 'no', label: 'NO.', disableSorting: true },
        { id: 'name', label: 'NAME OF EMPLOYEE', disableSorting: true },
        { id: 'bankName', label: 'BANK NAME', disableSorting: true },
        { id: 'branchName', label: 'ACCOUNT BRANCH', disableSorting: true },
        { id: 'accountNumber', label: 'ACCOUNT NUMBER', disableSorting: true },
        { id: 'netSalary', label: 'NET SALARY', disableSorting: true },
    ]
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [headers, setHeaders] = useState([
        'Name of Employee',
        'Bank Name',
        'Account Branch',
        'Account Number',
        'Net Salary',
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
    const payroll = useSelector(payrollReducer);
    const emp = payroll.payroll
    const dispatch = useDispatch()

        const handleRequestDialog = () => {
            setRequestDialog(false)
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

    const getCurrentMonthYear = () => {
        const year =  new Date().getFullYear()
        const month = (new Date().toLocaleString('default', { month: 'long' }))
        return `${year} ${month}`
    }

    const updateToNextPage = (page) => {
        getBankAdvice((page - 1)).then(() => {}).catch(() => {})
    }
    /*fetch full data from server*/
    const exportData = () => {
        setRequestDialog(true)
        Api().get('/payrolls/bank-advise-others').then((response) => {
            /*loop through the data to construct new date for export*/
            const data = []

            if (response.data.length > 0){
                response.data.map((e) => {
                    const d = {
                        fullName: `${e.lastName}, ${e.firstName} ${e.middleName === null || e.middleName === 'null' ? '' : e.middleName}`,
                        bankName: e.bankName === null || e.bankName === 'null' ? '' : e.bankName,
                        branchName: e.branchName === null || e.branchName === 'null' ? '' : e.branchName,
                        accountNumber: e.accountNumber === null || e.accountNumber === 'null' ? '' : e.accountNumber,
                        netSalary: (e.payableNetSalary).toFixed(2)
                    }
                    data.push(d)
                })
                setRequestDialog(false)
                const date = getCurrentMonthYear()
                const title = `EMPLOYEES BANK ADVICE FOR ${date}`
                PrintToExcel({data, title: title.toUpperCase(), headers, filename: `bank_advice_for_${date}` })
            } else {
                handleAlertState(true, 'error', 'No data available to export')
            }
        }).catch((error) => {
            if (error?.response?.status === 416) {
                logoutUser()
                window.location.reload()
            } else {
                setRequestDialog(false)
                handleAlertState(true, 'error', 'Error occurred while performing this operation')
            }
        })
    }
    const exportTrainingCenterData = () => {
        setRequestDialog(true)
        Api().get('/payrolls/bank-advise-tr').then((response) => {
            /*loop through the data to construct new date for export*/
            const data = []

            if (response.data.length > 0){
                response.data.map((e) => {
                    const d = {
                        fullName: `${e.lastName}, ${e.firstName} ${e.middleName  === null || e.middleName === 'null' ? '' : e.middleName}`,
                        bankName: e.bankName === null || e.bankName === 'null' ? '' : e.bankName,
                        branchName: e.branchName === null || e.branchName === 'null' ? '' : e.branchName,
                        accountNumber: e.accountNumber === null || e.accountNumber === 'null' ? '' : e.accountNumber,
                        netSalary: (e.payableNetSalary).toFixed(2)
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
    const getBankAdvice = async (page) => {
        dispatch(fetchCurrentPayrollWithThunk({page:page}))
    };
    useEffect(() => {
        const page = emp.data.pageable?.pageNumber || 0
        getBankAdvice(page).then(() => {}).catch(() => {})
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
                            x.employeeNumber?.toLowerCase().match(target.value.toLowerCase()) ||
                            x.employeeDepartment?.toLowerCase().match(target.value.toLowerCase()) ||
                            x.employeePosition?.toLowerCase().match(target.value.toLowerCase())
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
                                        InputProps={{startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>
                                            ),
                                            style: { backgroundColor: 'white' } }}
                                        onInput={(e) => {
                                            handleSearch(e)
                                        }}
                                        label="Search Employee" />
                                    </FormControl>
                    </div>

                    {/* DEPARTMENT FILTER */}
                    <div className="col-md-6">
                    </div>
                    
                    <div className="col-md-2 mb-2">
                            <Button
                                className="text-capitalize"
                                variant="contained"
                                size="small"
                                color="primary"
                                endIcon={<ArrowDropDownIcon />}
                                onClick={handleClick}
                                >
                                Export Advice
                            </Button>
                            <StyledMenu
                                id="customized-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                >
                                <StyledMenuItem
                                    onClick={() => {exportTrainingCenterData()}}
                                    className="px-2"
                                    >
                                    <ListItemText primary="Training Center" />
                                </StyledMenuItem>
                                <StyledMenuItem
                                    onClick={() => {exportData()}}
                                    className="px-2"
                                    >
                                    <ListItemText primary="Others" />
                                </StyledMenuItem>
                            </StyledMenu>
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
                    {/*generating table*/}
                {
                    emp.preloader ? (
                        <TableRow
                        >
                            <TableCell colspan={6}>
                                <div className="w-100 d-flex justify-content-center text-center">
                                    <BounceLoader size={90} color="#cf4f1f" loading />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        (recordsAfterPagingAndSorting()?.length <= 0) ?
                            (
                                <TableRow
                                >
                                    <TableCell colspan={6}>
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
                                                <TableCell>{item.bankName}</TableCell>
                                                <TableCell>{item.branchName}</TableCell>
                                                <TableCell>{item.accountNumber}</TableCell>
                                                <TableCell>{item.payableNetSalary.toFixed(2)}</TableCell>
                                            </TableRow>)
                                        )
                                    }
                                </TableBody>
                            )
                    )
                }
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

export default BankAdvice;
