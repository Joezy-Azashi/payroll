import React, { useState, useEffect } from "react";
import { Grid, MenuItem, FormControl, InputAdornment } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MomentUtils from "@date-io/moment";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import {
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import Api from "../Services/api";
import MultiSelect from "react-multi-select-component";
import { ConvertedEmployees } from "../Components/ConvertedEmployees";
import { Alert } from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import DialogPageLoader from "../Components/DialogPageLoader";
import Dialog from "@material-ui/core/Dialog";
import {useDispatch,useSelector} from 'react-redux';
import { additionsReducer, handlePreloader, handleStatusUpdate } from '../Services/_redux/additions/addition_slice'
import {addBonusesWithThunk, fetchBonusesWithThunk} from '../Services/_redux/additions/index';
import {getErrorCode} from "../Services/employeeService";
import {logoutUser} from "../Services/auth";
import moment from "moment";

function AddBonusForm( { handleCloseForm }) {

  const currentMonth = () => {
    return (('0' + ((new Date().getMonth()) + 1))).slice(-2)
}

const currentYear = () => {
  return new Date().getFullYear()
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

  const additions = useSelector(additionsReducer)
  const bonusState = additions.bonus
  const requestState = additions.request
  const dispatch = useDispatch()

  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [getTags, setGetTag] = useState([]);
  const [getEmployess, setGetEmployess] = useState([]);
  const [description, setDeductionType] = useState("");
  const [totalBonus, setTotalAmount] = useState("");
  const [monthlyBonus, setMonthDeduction] = useState("");
  const [startMonth, setStartMonth] = useState(monthList());
  const [startYear, setStartYear] = useState(yearList());
  const [endMonth, setEndMonth] = useState(monthList());
  const [endYear, setEndYear] = useState(yearList());
  const [startyear, setstartyear] = useState(currentYear())
  const [startmonth, setstartmonth] = useState(currentMonth())
  const [endyear, setendyear] = useState(currentYear())
  const [endmonth, setendmonth] = useState(currentMonth())
  const [employeeNumber, setSelectEmployee] = useState([]);

  const handleStartYearChange = async (val) => {
    setstartyear(val)
}
const handleStartMonthChange = async (val) => {
    setstartmonth(val)
}

const handleEndYearChange = async (val) => {
  setendyear(val)
}
const handleEndMonthChange = async (val) => {
  setendmonth(val)
}

  // FUNCTION FOR THE ALERT DISPLAY
  const handleAlertState = (alertOpen, alertType, alertMessage) => {
    setAlertType(alertType);
    setAlertMessage(alertMessage);
    setAlertOpen(alertOpen);
  };

  const handleRequestDialog = () => {
    handlePreloader({preloader: false});
  };

  const handleCloseBonus = () => {
    handleCloseForm()
  }
    const getDeductions = (lists) => {
        return lists.filter((list) => {
            return (list.tagType === "Bonus")
        })
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


  // FETCHING LIST OF BONUS TAGS IN THE SYSTEM
  const getTagsType = async () => {
    const tags = await Api().get("/tags/");
    setGetTag(tags.data);
  };

  // FUNCTION TO FETCH LIST OF EMPLOYESS FOR THE USE AT THE MULTISELECT COMPONENT
  const getEmployees = async () => {
    const getEmployee = await Api().get("/employees/id-name");
    setGetEmployess(ConvertedEmployees(getEmployee.data));
  };

  const getMonthsDifference = (startmonth, startyear, endmonth, endyear) => {
    const stringStart = `${startyear}-${startmonth}-25`
    const stringEnd = `${endyear}-${endmonth}-25`
    const start = moment(stringStart, 'YYYY-MM-D')
    const end = moment(stringEnd, 'YYYY-MM-D')
    // Months
    return (end.diff(start, 'months', true) + 1)
  }



  //   FUNCTION TO CREATE A BONUS FORM
  const addBonus = async (e) => {
    e.preventDefault();

    const BonusCreate = [];

    const duration = getMonthsDifference(startmonth, startyear, endmonth, endyear)
    if ((parseFloat(totalBonus)) < (parseFloat(monthlyBonus))){ //check if monthly bonus is not more than total bonus
      handleAlertState(true, "error", "Monthly bonus cannot be more than total bonus");
      return
    }
  
    if ((duration * (parseFloat(monthlyBonus))) !== (parseFloat(totalBonus))){ //check if the product of the monthly bonus and the month duration is equal to total bonus
      handleAlertState(true, "error", "Monthly total of the monthly bonus does not tally with the specified total");
      return
    }

    console.log("duration", duration)

    employeeNumber.forEach((emp) => {
      const bonus = {
        description: description,
        totalBonus: totalBonus,
        monthlyBonus: monthlyBonus,
        startDate: `${startyear}-${startmonth}`,
        endDate: `${endyear}-${endmonth}`,
        displayName: emp.label,
        employeeId: emp.value,
        employeeNumber: emp.employeeNumber
      };
      BonusCreate.push(bonus);
    });

    console.log("BonusCreate", BonusCreate)
    await dispatch(addBonusesWithThunk(BonusCreate))
    await dispatch(fetchBonusesWithThunk({page: 0}))
    await dispatch(handleStatusUpdate({data: null}))
    handleCloseBonus(false)
  };

  // USEEFFECT TO FETCH DATA ON PAGE LOAD
  useEffect(() => {
    getTagsType();
    getEmployees();
  }, []);

  useEffect(() => {
    if (bonusState.status === 'Failed'){
        if(getErrorCode(bonusState.error.error.message).includes('416')) {
            const error = {
                response: {
                    status: 416
                }
            }
            handleErrorResponse(error)
        }
        else if (getErrorCode(bonusState.error.error.message).includes('401')) {
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
}, [bonusState.status]);

  return (
    <div>
      <form onSubmit={addBonus}>
            <div className="row mb-4">
              <div className="col-md-12">
            <FormControl
              fullWidth
                size="small"
                variant="outlined"
              >
              <InputLabel id="demo-simple-select-outlined-label">
                Select Bonus
              </InputLabel>
              <Select
              label="Select Bonus"
              fullWidth
                style={{ height: "39px" }}
                variant="outlined"
                size="small"
                value={description}
                onChange={(e) => {
                  setDeductionType(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {getDeductions(getTags).map((tags) => {
                  return (
                    <MenuItem key={tags.tagId} value={tags.tag}>
                        {tags.tag}
                    </MenuItem>
                  );
                })}
              </Select>
              </FormControl>
              </div>
            </div>
            <div className="row mb-4">
            <div className="col-md-6">
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-amount">Total Amount</InputLabel>
                  <OutlinedInput
                  style={{height: "40px"}}
                    id="total_amount"
                    value={totalBonus}
                    onChange={(e) => {
                      setTotalAmount(e.target.value);
                    }}
                    startAdornment={<InputAdornment position="start">GH&#162;</InputAdornment>}
                    labelWidth={100}
                  />
                </FormControl>
            </div>
            <div className="col-md-6">
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-amount">Monthly Bonus</InputLabel>
                  <OutlinedInput
                  style={{height: "40px"}}
                    id="monthly_bonus"
                    value={monthlyBonus}
                    onChange={(e) => {
                      setMonthDeduction(e.target.value);
                    }}
                    startAdornment={<InputAdornment position="start">GH&#162;</InputAdornment>}
                    labelWidth={110}
                  />
                </FormControl>
            </div>
            </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <div className="row">
                  <div className="col-md-6 mb-3">
                   <FormControl variant="outlined" className="bg-white" size="small" fullWidth>
                       <InputLabel>Start Month</InputLabel>
                       <Select
                           label="Department"
                           value={startmonth}
                           onChange={(event) => handleStartMonthChange(event.target.value)}
                       >
                           {
                               startMonth.length > 0 ? (
                                   startMonth.map((startmonth) => (
                                       <MenuItem value={startmonth.value}>{startmonth.name}</MenuItem>
                                   ))
                               ) : null
                           }
                       </Select>
                   </FormControl>
                  </div>
               <div className="col-md-6">
                   <FormControl variant="outlined" size="small" fullWidth="true" className="bg-white">
                       <InputLabel>Start Year</InputLabel>
                       <Select
                           label="Department"
                           value={startyear}
                           onChange={(event) => handleStartYearChange(event.target.value)}
                       >
                           {
                               startYear.length > 0 ? (
                                startYear.map((startyear) => (
                                       <MenuItem value={startyear} key={startyear}>{startyear}</MenuItem>
                                   ))
                               ) : null
                           }
                       </Select>
                   </FormControl>
                </div>
                </div>
               </div>

               <div className="col-md-6">
                  <div className="row">
                  <div className="col-md-6 mb-3">
                   <FormControl variant="outlined" className="bg-white" size="small" fullWidth>
                       <InputLabel>End Month</InputLabel>
                       <Select
                           label="endMonth"
                           value={endmonth}
                           onChange={(event) => handleEndMonthChange(event.target.value)}
                       >
                           {
                               endMonth.length > 0 ? (
                                endMonth.map((endmonth) => (
                                       <MenuItem value={endmonth.value}>{endmonth.name}</MenuItem>
                                   ))
                               ) : null
                           }
                       </Select>
                   </FormControl>
                  </div>
               <div className="col-md-6">
                   <FormControl variant="outlined" size="small" fullWidth="true" className="bg-white">
                       <InputLabel>End Year</InputLabel>
                       <Select
                           label="Department"
                           value={endyear}
                           onChange={(event) => handleEndYearChange(event.target.value)}
                       >
                           {
                               endYear.length > 0 ? (
                                endYear.map((endyear) => (
                                       <MenuItem value={endyear} key={endyear}>{endyear}</MenuItem>
                                   ))
                               ) : null
                           }
                       </Select>
                   </FormControl>
                </div>
                </div>
               </div>
              </div>
            <div className="row">
              <div className="col-md-12">
              <InputLabel id="demo-simple-select-outlined-label">
                Select Employee(s)
              </InputLabel>
              <MultiSelect
                className="label-length1"
                options={getEmployess}
                value={employeeNumber}
                onChange={setSelectEmployee}
                labelledBy={"Select"}
              />
              </div>
            </div>
          <div className="row">
            <Button
              className="deduction-button"
              variant="contained"
              color="primary"
              type="submit"
              onClick={addBonus}
              disabled={
                employeeNumber.length <= 0 ||
                endMonth.length <= 0 ||
                endYear.length <= 0 ||
                startMonth.length <= 0 ||
                startYear.length <= 0 ||
                monthlyBonus.length <= 0 ||
                totalBonus.length <= 0 ||
                description.length <= 0
              }
            >
              Submit
            </Button>
          </div>
      </form>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => handleAlertState(false, "", "")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alertType}>{alertMessage}</Alert>
      </Snackbar>
      <Dialog
        open={requestState.ssss}
        onClose={() => handleRequestDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
        disableBackdropClick
      >
        <DialogPageLoader />
        {requestState.preloader}
      </Dialog>
    </div>
  );
}

export default AddBonusForm;
