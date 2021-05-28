import React, { useState, useEffect } from 'react'
import {FormControl, InputLabel, Select, ListItemText, Menu, MenuItem, Button, Snackbar} from '@material-ui/core';
import {fetchTierOneReportWithThunk} from "../../Services/_redux/payrollReport";
import {useDispatch, useSelector} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {payrollReportReducer} from '../../Services/_redux/payrollReport/payroll-report-slice'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {getErrorCode} from "../../Services/employeeService";
import {fetchMonthlyPayrollReportUnsortedWithThunk} from "../../Services/_redux/payrollReport";
import PrintToExcel from "../PrintToExcel";
import DialogPageLoader from "../DialogPageLoader";
import Dialog from "@material-ui/core/Dialog";
import {logoutUser} from "../../Services/auth";

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

function ReportFilter({filterFunction, exportFunction, initialFetch, dateChange, showExport = true, bankAdvice = false}) {

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const dispatch = useDispatch()
    const tierOne = useSelector(payrollReportReducer)
    const emp = tierOne.tierOne
    const currentYear = () => {
        return new Date().getFullYear()
    }

    const currentMonth = () => {
        return (('0' + ((new Date().getMonth()) + 1))).slice(-2)
    }

    const yearList = () => {
        const years = []
        let startYear = 2021
        let currentYear = new Date().getFullYear()
        while(currentYear >= startYear) {
            years.unshift(startYear)
            startYear++
        }
        return years
    }

    const monthList = () => {
        return [
            { name: 'January', value: '01'},
            { name: 'February', value: '02'},
            { name: 'March', value: '03'},
            { name: 'April', value: '04'},
            { name: 'May', value: '05'},
            { name: 'June', value: '06'},
            { name: 'July', value: '07'},
            { name: 'August', value: '08'},
            { name: 'September', value: '09'},
            { name: 'October', value: '10'},
            { name: 'November', value: '11'},
            { name: 'December', value: '12'}
        ]
    }


    const [year, setYear] = useState(currentYear())
    const [month, setMonth] = useState(currentMonth())
    const [years, setYears] = useState(yearList())
    const [months, setMonths] = useState(monthList())
    const [requestDialog, setRequestDialog] = useState(false);
    const handleRequestDialog = () => {
        setRequestDialog(false)
    }

    const handleYearChange = async (val) => {
        setYear(val)
    }
    const handleMonthChange = async (val) => {
        setMonth(val)
    }

    /*handle filter*/
    const handleFilter = () => {
        const data = { yearMonth: `${year}-${month}`}
        dateChange(data)
        filterFunction(data)
    }

    /*fetch full data from server*/
    const exportData = async() => {
        const dataA = { yearMonth: `${year}-${month}`, type: 'others'}
        exportFunction(dataA)
    }
    const exportTrainingCenterData = () => {
        const dataA = { yearMonth: `${year}-${month}`, type: 'training'}
        exportFunction(dataA)
    }


    useEffect(() => {
        const data = { yearMonth: `${year}-${month}`}
        initialFetch(data)
    }, []);

    return(
       <div>
           <div className=" row">
               <div className="col-md-2 mb-3">
                   <FormControl variant="outlined" className="bg-white" size="small" fullWidth>
                       <InputLabel>Month</InputLabel>
                       <Select
                           label="Department"
                           value={month}
                           onChange={(event) => handleMonthChange(event.target.value)}
                       >
                           {
                               months.length > 0 ? (
                                   months.map((month) => (
                                       <MenuItem value={month.value}>{month.name}</MenuItem>
                                   ))
                               ) : null
                           }
                       </Select>
                   </FormControl>
               </div>
               <div className="col-md-2">
                   <FormControl
                       variant="outlined"
                       size="small"
                       fullWidth="true"
                       className="bg-white"
                   >
                       <InputLabel>Year</InputLabel>
                       <Select
                           label="Department"
                           value={year}
                           onChange={(event) => handleYearChange(event.target.value)}
                       >
                           {
                               years.length > 0 ? (
                                   years.map((year) => (
                                       <MenuItem value={year} key={year}>{year}</MenuItem>
                                   ))
                               ) : null
                           }
                       </Select>
                   </FormControl>
               </div>
               <div className="col-md-1">
                   <Button
                       className="text-capitalize btn-amalitech mt-2"
                       variant="contained"
                       size="small"
                       type="submit"
                       onClick={handleFilter}
                       >
                       Filter
                   </Button>
               </div>

               <div className="col-md-5">
               </div>

               <div className="col-md-2">
                   {
                       showExport ? (
                           bankAdvice ? (
                               <div>
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
                           ) : (
                               <Button
                                   className="text-capitalize btn-amalitech mt-2"
                                   variant="contained"
                                   size="small"
                                   type="submit"
                                   startIcon={<CloudUploadIcon />}
                                   onClick={exportData}
                               >
                                   Export

                               </Button>
                           )

                       ) : null
                   }
               </div>
           </div>

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

export default ReportFilter