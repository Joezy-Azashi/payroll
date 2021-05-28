import React, {useState, useEffect, createRef} from 'react';
import Card from '@material-ui/core/Card';
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles, TableBody, TableRow, TableCell, Toolbar } from '@material-ui/core';
import useTable from "../Components/useTable";
import {blue} from "@material-ui/core/colors";
import { TextField, Button, FormControl, Grid, InputAdornment, Snackbar  } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Search } from '@material-ui/icons';
import Api from '../Services/api';
import moment from 'moment'
import AutorenewIcon from '@material-ui/icons/Autorenew';
import GeneratePayslip from '../Components/GeneratePayslip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import { BounceLoader } from "react-spinners";
import DialogPageLoader from "../Components/DialogPageLoader";
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';

import {fetchEmployeesWithThunk, fetchEmployeesWithSort} from '../Services/_redux/employees/index';
import {employeeReducer} from '../Services/_redux/employees/employee-slice'
import { payrollCurrentStatus } from '../Services/_redux/payrollStatus/payroll_slice'
import {useDispatch,useSelector} from 'react-redux';
import { logoutUser } from "../Services/auth";
import * as roles from '../Services/roles'
import {fetchPayrollStatusWithThunk} from "../Services/_redux/payrollStatus";
import { getErrorCode, pageNumbering } from '../Services/employeeService'




const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '80%',
        },
        background_color: blue
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    selectField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    cardWidth: {
        width: '100%'
    },
    cardContentStyle: {
        width: '100%',
        marginTop: '50px',
        marginBottom: '50px',
    },
    colFour: {
        verticalAlign: 'center'
    },
    but: {
        fontSize: '12px'
    },
    tableContainer: {
        maxHeight: '78vh',
    },
}));

const headCells = [
    { id: 'number', label: 'NO.', disableSorting: true },
    { id: 'fullName', label: 'EMPLOYEE NAME', disableSorting: true },
    { id: 'employeeNumber', label: 'EMPLOYEE ID', disableSorting: true },
    { id: 'workEmail', label: 'EMAIL', disableSorting: true },
   /* { id: 'department', label: 'DEPARTMENT', disableSorting: true },*/
    { id: 'jobTitle', label: 'JOB TITLE', disableSorting: true },
    { id: 'basicSalary', label: 'BASIC SALARY', disableSorting: true },
    { id: 'payslip', label: 'PAY SLIP', disableSorting: true },
    { id: 'action', label: 'ACTION', disableSorting: true },
]

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 13,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

function EmployeeSalary(props) {

    const emp = useSelector(employeeReducer);
    const payrollStats = useSelector(payrollCurrentStatus)
    const payrollStat = payrollStats.data
    const dispatch = useDispatch()


    const filterHeadCells = (headCells, hasAction) => {
        if (hasAction) {
            return headCells
        } else {
            return headCells.filter((headCell) => {
                return (headCell.id !== 'action')
            })
        }
    }


    const currentDateMonth = () => {
        const year = new Date().getFullYear()
        const month = ("0" + (new Date().getMonth() + 1)).slice(-2)
        return `${year}-${month}`
    }
    const currentMonth = () => {
        return new Date().toLocaleString('default', { month: 'long' })
    }
    const currentYear = () => {
        return new Date().getFullYear()
    }
    const classes = useStyles()
    const [records, setRecords] = useState({})
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [selected, setSelected] = useState([]);
    const [pageReady, setPageReady] = useState(true);
    const [normalFetch, setNormalFetch] = useState(true);
    const [tick, setTick] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [employeeDialogIsOpen, setEmployeeDialogIsOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState({})
    const [selectedPayslip, setSelectedPayslip] = useState({})
    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')
    const [department, setDepartment] = useState('all')
    const [departments, setDepartments] = useState([])
    const [position, setPosition] = useState('all')
    const [positions, setPositions] = useState([])
    const [empAlertOpen, setEmpAlertOpen] = useState(false)
    const [empAlertType, setEmpAlertType] = useState('success')
    const [empAlertMessage, setEmpAlertMessage] = useState('')
    const [date, setDate] = useState(currentDateMonth())
    const [year, setYear] = useState(currentMonth())
    const [month, setMonth] = useState(currentYear())

    const [requestDialog, setRequestDialog] = useState(false);
    const [show, setShow] = useState(emp?.showAlert);

    
    

    const handleRequestDialog = () => {
        setRequestDialog(false)
    }
    const handleErrorResponse = (error) => {
        if (error.response.status === 401) {
            handleAlertState(true, 'error', 'You are not authorized to perform this operation')
        } else if (error.response.status === 416) {
            logoutUser()
            window.location.reload()
        }
    }

    /*open and close alert*/
    const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }
    const handleAlertStateRedux = (alertOpen, alertType, alertMessage) => {
        setEmpAlertOpen(alertOpen)
        setEmpAlertType(alertType)
        setEmpAlertMessage(alertMessage)
    }
    /*handle pagination button click to fetch data from server*/
    const updateData =async (page) => {
        if (normalFetch === true) {
          await dispatch(fetchEmployeesWithThunk({ page: (page - 1) }))
            dispatch(fetchPayrollStatusWithThunk())
        } else {
            const data = {
                department: department === 'all' ? '' : department,
                position: position === 'all' ? '' : position
            }
           await dispatch(fetchEmployeesWithSort({page:(page - 1), data: data}))
        }
        
    }


    /*fetch data from Bamboo Hr*/
    const updateFromBamboo = () => {
        setRequestDialog(true)
        Api().get('/employees/fetch-bamboo-data').then((response) =>{
            setRequestDialog(false)
            handleAlertState(true, 'success', 'Employee Records Updated successfully')
            dispatch(fetchEmployeesWithThunk({page:(0)}))
            dispatch(fetchPayrollStatusWithThunk())

        }).catch((error) => {
            if (error.response) {
                handleErrorResponse(error)
                setRequestDialog(false)
                handleAlertState(true, 'error', 'Error accessing resources from BambooHR')
            } else {
                setRequestDialog(false)
                handleAlertState(true, 'error', 'Error accessing resources from BambooHR')
            }
        })
    }


    /*fetch list of employees from server with their current payslip*/
    const getSalary = async (page) => {   
        setPageReady(false)
        try {
            dispatch(fetchPayrollStatusWithThunk())
            dispatch(fetchEmployeesWithThunk({page:page}))
            setRecords(emp.data)
            setPageReady(true)
            setShow(emp?.showAlert);
        } catch(error) {
            setPageReady(true)
            handleErrorResponse(error)
        }
    };
    const getPosition = async () => {
        const response = await Api().get('/positions/' )
        setPositions(response.data)
    };
    const getDepartment = async () => {
        const response = await Api().get('/departments/' )
        setDepartments(response.data)
    };
 
    const updateSelectedEmployee = async () => {
        setRequestDialog(true)
        // const data = [selectedEmployee]
        const data = {
            basicSalary: selectedEmployee.basicSalary,
            employeeId: selectedEmployee.employeeId,
            ssnitContributor: selectedEmployee.ssnitContributor,
            taxRelief: selectedEmployee.taxRelief,
            tierTwoNumber: selectedEmployee.tierTwoNumber
        }
        Api().patch('/employees/update', data).then((response) => {
            getSalary(0)
            setRequestDialog(false)
            handleAlertState(true, 'success', 'Employee Records Updated Successfully')
            updateData(1)
        }).catch((error) => {
            handleErrorResponse(error)
            if (error.response.status !== 401 && error.response.status !== 416) {
                const message = 'Error Updating Employee Records'
                handleAlertState(true, 'error', message)
            }
        })
        setSelectedEmployee({})
        setEmployeeDialogIsOpen(false)

    }
    const editEmployee = (data) => {
        setSelectedEmployee(data)
        setEmployeeDialogIsOpen(true)
    }
    const handleEditChange = evt => {
        const { name, checked, value: newValue, type } = evt.target;

        // keep number fields as numbers
        let value
        if (type === 'number') {
            value = +newValue
        } else if(type === 'checkbox'){
            value = checked
        } else {
            value = newValue
        }

        // save field values
        setSelectedEmployee({
            ...selectedEmployee,
            [name]: value,
        });        
        
    };

    useEffect(() => {
        const page = emp.data.pageable?.pageNumber || 0
        dispatch(fetchEmployeesWithThunk({page:page}))
        dispatch(fetchPayrollStatusWithThunk())
        getPosition().then().catch()
        getDepartment().then().catch()
    }, []);


    const {
        TblContainer,
        TblHeadTwo,
        TablePaginations,
        recordsAfterPagingAndSorting
    } = useTable(emp.data, filterHeadCells(headCells, roles.canEdit()), filterFn, updateData);
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
                            x.middleName?.toLowerCase().match(target.value.toLowerCase()) ||
                            x.employeeNumber?.toLowerCase().match(target.value.toLowerCase()) ||
                            x.department?.toLowerCase().match(target.value.toLowerCase()) ||
                            x.jobTitle?.toLowerCase().match(target.value.toLowerCase()) ||
                            x.workEmail?.toLowerCase().match(target.value.toLowerCase())
                    )
            }
        })
    }
 

    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    
      const handleClose1 = () => {
          setSelectedEmployee({})
        setOpen1(false);
      };

    const currentMonthPayslip = () => {
        return (new Date().getMonth() + 1)
    }
    const currentYearPayslip = () => {
        return new Date().getFullYear()
    }

    /*get the payslip for the current month*/
    const getCurrentPayslip = (payslips) => {
        if (payslips.length > 0) {
            return payslips.filter((payslip) => {
                return (payslip.month === currentMonthPayslip() && payslip.year === currentYearPayslip())
            }) || []
        } else {
            return []
        }
    }
      const handleClickOpen1 = (item) => {
          if (item.payrolls.length > 0) {
              const payslip = getCurrentPayslip(item.payrolls)
              if (payslip.length > 0) {
                  const data = {
                      employee: item,
                      payslip: payslip[0]
                  }
                  setSelectedPayslip(data)
                  setOpen1(true);
              } else {
                  handleAlertState(true, 'error', `No payslip available for the month of ${currentMonth()}`)
              }
          } else {
              handleAlertState(true, 'error', 'No payslip available')
          }
      };

     
    useEffect(() => {
        if (emp.status === 'Failed'){
            if(getErrorCode(emp.errorCode.error.message).includes('416')) {
                const error = {
                    response: {
                        status: 416
                    }
                }
                handleErrorResponse(error)
            }
        if (getErrorCode(emp.errorCode.error.message).includes('401')) {
            const error = {
                response: {
                    status: 401
                }
            }
            handleErrorResponse(error)
        }

        }
    }, [emp.status])

    return (
        <div>
            <Card elevation="0" style={{backgroundColor:"#f0f0f7"}}>

                {/* FILTER TOOLS */}
                <Toolbar className="row mt-3 mb-4" style={{height: '7vh'}}>
                    <div className="col-md-4 mb-2">
                        <FormControl
                            size="small"
                            fullWidth
                            className=""
                            color="primary" style={{backgroundColor:"#ffffff"}}
                        >
                            <TextField
                                size="small"
                                type="search"
                                onInput={(event) => handleSearch(event)}
                                variant={"outlined"}
                                InputProps={{ startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                    style: { backgroundColor: 'white' } }} label="Search Employee" />
                        </FormControl>
                    </div>
                    <div className="col-md-4">
                    </div>
                    <div className="col-md-1">
                       
                    </div>
                    <div className="col-md-1">
                        
                    </div>
                    <div className="col-md-2">
                        <Button
                            className="mb-2 text-capitalize w-100"
                            variant="contained"
                            color="Primary"
                            size="small"
                            onClick={(event) => updateFromBamboo()}
                            >
                            Bamboo HR <AutorenewIcon color={"white"} />
                        </Button>
                    </div>
                </Toolbar>

            {/* TABLE */}
            <div>
            {/* MAIN TABLE */}
               <div className="px-4">
                   <TableContainer className={classes.tableContainer}>
                       <TblContainer>
                           <TblHeadTwo stickyHeader={true}
                           />
                           {
                               emp?.status === null || emp?.status === 'Loading...' ? (
                                       <TableRow key={'0'}
                                       >
                                           <TableCell colspan={9}>
                                               <div className="w-100 d-flex justify-content-center text-center">
                                                   <BounceLoader size={90} color="#cf4f1f" loading />
                                               </div>
                                           </TableCell>
                                       </TableRow>
                                   ) :
                                   recordsAfterPagingAndSorting()?.length <= 0 ? (
                                       <TableRow key={'1'}
                                       >
                                           <TableCell colspan={9}>
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

                                                       <TableCell>{(i + 1) + pageNumbering(emp.data.number)}</TableCell>
                                                       <TableCell>{item.lastName + ' ' + item.firstName + ' ' }{(item.middleName !== 'null' ? item.middleName : '')}</TableCell>
                                                       <TableCell>{item.employeeNumber}</TableCell>
                                                       <TableCell>{item.workEmail}</TableCell>
                                                       {/*<TableCell>{item.department}</TableCell>*/}
                                                       <TableCell>{item.jobTitle}</TableCell>
                                                       <TableCell>GH¢{item.basicSalary.toFixed(2)}</TableCell>
                                                       <TableCell>
                                                           <div className={"d-flex align-items-center"}>

                                                               <Button
                                                                   variant="contained"
                                                                   color="primary"
                                                                   size="small"
                                                                   disabled={!payrollStat.approved}
                                                                   onClick={() => {handleClickOpen1(item)}}
                                                               >
                                                                   Preview
                                                               </Button>
                                                           </div>
                                                       </TableCell>
                                                       {
                                                           roles.canEdit() ? (
                                                               <TableCell>
                                                                   <div className={"d-flex align-items-center"}>
                                                                       <EditIcon color="primary" onClick={() => {editEmployee(item)}} />
                                                                   </div>
                                                               </TableCell>
                                                           ) : null
                                                       }

                                                   </TableRow>)
                                               )
                                           }
                                       </TableBody>
                                   )
                           }
                       </TblContainer>
                   </TableContainer>
                   <div className="row justify-content-center d-flex text-center w-100">
                       <div className="col-md-12 p-3 text-center justify-content-center d-flex">
                           {
                               recordsAfterPagingAndSorting()?.length > 0 ? (
                                   (<TablePaginations />)
                               ) : null
                           }
                       </div>
                   </div>
               </div>
            </div>
            </Card>
             <Snackbar open={empAlertOpen} autoHideDuration={6000} onClose={() => handleAlertStateRedux(false, '', '')}
                              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert  severity={empAlertType}>
                            {empAlertMessage}
                        </Alert>
                    </Snackbar>

            <Snackbar open={alertOpen} autoHideDuration={1000} onClose={() => handleAlertState(false, '', '')}
                      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert  severity={alertType}>
                    {alertMessage}
                </Alert>
            </Snackbar>


            <Dialog open={employeeDialogIsOpen} onClose={() => setEmployeeDialogIsOpen(false)}aria-labelledby="form-dialog-title">
                <DialogTitle className="salarydetailtitle" id="form-dialog-title">Enter Salary Details</DialogTitle>

                    <DialogContent>
                        <form>
                        <div>
                            <div className={"row py-3"}>
                                <div className="col-md-6 mb-3">
                                    <FormControl
                                        size="small"
                                        fullWidth
                                        className="mx-2"
                                        color="primary" style={{backgroundColor:"#ffffff"}}
                                    >
                                        <TextField
                                            size="small"
                                            id="name"
                                            disabled
                                            value={`${selectedEmployee.lastName}  ${selectedEmployee.firstName} ${selectedEmployee.middleName ? selectedEmployee.middleName : ''}`}
                                            variant={"outlined"}
                                            InputProps={{
                                                style: { backgroundColor: 'white' } }} label="Name" />
                                    </FormControl>
                                </div>
                                <div className="col-md-6">
                                    <FormControl
                                        size="small"
                                        fullWidth
                                        className="mx-2"
                                        color="primary" style={{backgroundColor:"#ffffff"}}
                                    >
                                        <TextField
                                            size="small"
                                            type="number"
                                            id="taxRelief"
                                            label={"Tier 2"}
                                            name={"tierTwoNumber"}
                                            defaultValue={selectedEmployee.tierTwoNumber}
                                            variant={"outlined"}
                                            onChange={(e) => {
                                                handleEditChange(e);
                                            }}
                                            InputProps={{
                                                style: { backgroundColor: 'white' } }} />
                                    </FormControl>
                                </div>
                            </div>
                            <div className={"row py-3"}>
                                <div className="col-md-6 mb-3">
                                    <FormControl
                                        size="small"
                                        fullWidth
                                        className="mx-2"
                                        color="primary" style={{backgroundColor:"#ffffff"}}
                                    >
                                        <TextField
                                            size="small"
                                            type="number"
                                            label={"Basic Salary"}
                                            name={"basicSalary"}
                                            defaultValue={`${selectedEmployee.basicSalary}`}
                                            variant={"outlined"}
                                            onChange={(e) => {
                                                handleEditChange(e);
                                            }}
                                            InputProps={{
                                                style: { backgroundColor: 'white' } }} />
                                    </FormControl>
                                </div>
                                <div className="col-md-6">
                                    <FormControl
                                        size="small"
                                        fullWidth
                                        className="mx-2"
                                        color="primary" style={{backgroundColor:"#ffffff"}}
                                    >
                                        <TextField
                                            size="small"
                                            type="number"
                                            id="taxRelief"
                                            label={"Tax Relief"}
                                            name={"taxRelief"}
                                            defaultValue={`${selectedEmployee.taxRelief}`}
                                            variant={"outlined"}
                                            onChange={(e) => {
                                                handleEditChange(e);
                                            }}
                                            InputProps={{
                                                style: { backgroundColor: 'white' } }} />
                                    </FormControl>
                                </div>

                            </div>
                            <div className={"row py-3 pl-2"}>
                                <div className="col-md-6 d-flex">
                            <FormLabel component="legend">SSNIT Contributor</FormLabel>
                            <Grid item>
                                            <AntSwitch
                                            checked={selectedEmployee.ssnitContributor} onChange={handleEditChange}
                                            name={'ssnitContributor'}
                                            />
                                        </Grid>
                            </div>
                            </div>

                            <div className="w-100 text-center mt-3 mb-3" >
                                <Button onClick={() => updateSelectedEmployee()} className="employeesalary-savebtn" align="left">
                                    Save
                                </Button>
                            </div>
                        </div>
                        </form>
                    </DialogContent>
            </Dialog>

            <Dialog open={open1} onClose={handleClose1} aria-labelledby="form-dialog-title" fullWidth maxWidth="md"
            classes={{paperFullScreen: "prePrint printDialog"}}
            >
                <GeneratePayslip employee={selectedPayslip}/>
            </Dialog>
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
    );
}

export default EmployeeSalary;
