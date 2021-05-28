import React, { useState, useEffect } from "react";
import {
  Grid,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputAdornment,
  OutlinedInput
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MomentUtils from "@date-io/moment";
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
import { useDispatch, useSelector } from "react-redux";
import FormLabel from "@material-ui/core/FormLabel";
import { withStyles } from "@material-ui/core/styles";
import {
  additionsReducer,
  handlePreloader,
  handleStatusUpdate,
} from "../Services/_redux/additions/addition_slice";
import {
  addAllowancesWithThunk,
  fetchAllowancesWithThunk,
} from "../Services/_redux/additions/index";
import Switch from "@material-ui/core/Switch";
import moment from "moment";
import {getErrorCode} from "../Services/employeeService";
import {logoutUser} from "../Services/auth";

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 1.5,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 13,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

function AddAllowanceForm({ handleCloseAllowance }) {

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

  const additions = useSelector(additionsReducer);
  const allowanceState = additions.allowance;
  const requestState = additions.request;
  const dispatch = useDispatch();

  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [requestDialog, setRequestDialog] = useState(false);
  const [getTags, setGetTag] = useState([]);
  const [getEmployess, setGetEmployess] = useState([]);
  const [description, setDeductionType] = useState("");
  const [totalAllowance, setTotalAmount] = useState("");
  const [monthlyAllowance, setMonthDeduction] = useState("");
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

  const [state, setState] = React.useState({
    taxable: false,
  });

  // FUNCTION FOR THE ALERT DISPLAY
  const handleAlertState = (alertOpen, alertType, alertMessage) => {
    setAlertType(alertType);
    setAlertMessage(alertMessage);
    setAlertOpen(alertOpen);
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.checked });
  };

  const handleRequestDialog = () => {
    handlePreloader({ preloader: false });
  };

  const handleCloseAllowance1 = () => {
    handleCloseAllowance();
  };

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

  // FETCHING LIST OF ALLOWANCE TAGS IN THE SYSTEM
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
    const stringStart = `${startyear}-${startmonth}-25`;
    const stringEnd = `${endyear}-${endmonth}-25`;
    const start = moment(stringStart, "YYYY-MM-D");
    const end = moment(stringEnd, "YYYY-MM-D");
    // Months
    return end.diff(start, "months", true) + 1;
  };

    const getDeductions = (lists) => {
        return lists.filter((list) => {
            return (list.tagType === "Allowance")
        })
    }

  //   FUNCTION TO CREATE A ALLOWANCE FORM
  const addAllowance = async (e) => {
    e.preventDefault();
    const AllowanceCreate = [];
    const duration = getMonthsDifference(startmonth, startyear, endmonth, endyear);
    if (parseFloat(totalAllowance) < parseFloat(monthlyAllowance)) {
      //check if monthly bonus is not more than total bonus
      handleAlertState(
        true,
        "error",
        "Monthly Allowance cannot be more than total Allowance"
      );
      return;
    }

    if (
      duration * parseFloat(monthlyAllowance) !==
      parseFloat(totalAllowance)
    ) {
      //check if the product of the monthly bonus and the month duration is equal to total bonus
      handleAlertState(
        true,
        "error",
        "Monthly total of the monthly bonus does not tally with the specified total"
      );
      return;
    }

    const handleChange = (e) => {
      setState({ ...state, [e.target.name]: e.target.checked });
    };

    employeeNumber.forEach((emp) => {
      const allowance = {
        description: description,
        totalAllowance: parseFloat(totalAllowance),
        monthlyAllowance: monthlyAllowance,
        startDate: `${startyear}-${startmonth}`,
        endDate: `${endyear}-${endmonth}`,
        displayName: emp.label,
        employeeId: emp.value,
        taxable: state.taxable,
        employeeNumber: emp.employeeNumber
      };
      AllowanceCreate.push(allowance);
      console.log("AllowanceCreate", AllowanceCreate)
    });
    await dispatch(addAllowancesWithThunk(AllowanceCreate));
    dispatch(fetchAllowancesWithThunk({ page: 0 }));
    await dispatch(handleStatusUpdate({ data: null }));
    handleCloseAllowance1(false);
  };

  // USEEFFECT TO FETCH DATA ON PAGE LOAD
  useEffect(() => {
    getTagsType();
    getEmployees();
  }, []);

  useEffect(() => {
    if (allowanceState.status === 'Failed'){
        if(getErrorCode(allowanceState.error.error.message).includes('416')) {
            const error = {
                response: {
                    status: 416
                }
            }
            handleErrorResponse(error)
        }
        else if (getErrorCode(allowanceState.error.error.message).includes('401')) {
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
}, [allowanceState.status]);

  return (
    <div>
      <form onSubmit={addAllowance}>
      <div className="row mb-4">
              <div className="col-md-12">
            <FormControl
              fullWidth
                size="small"
                variant="outlined"
              >
              <InputLabel id="demo-simple-select-outlined-label">
                Select Allowance
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
                    value={totalAllowance}
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
                  <InputLabel htmlFor="outlined-adornment-amount">Monthly Allowance</InputLabel>
                  <OutlinedInput
                  style={{height: "40px"}}
                    id="monthly_bonus"
                    value={monthlyAllowance}
                    onChange={(e) => {
                      setMonthDeduction(e.target.value);
                    }}
                    startAdornment={<InputAdornment position="start">GH&#162;</InputAdornment>}
                    labelWidth={140}
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
            <div className="row mb-3">
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
              <div className="col-md-6 d-flex">
              <FormLabel className="mt-2" component="legend">Taxable</FormLabel>
                <FormControlLabel
                  control={
                    <Switch
                      checked={state.taxable}
                      onChange={handleChange}
                      name="taxable"
                    />
                  }
                />
              </div>

            </div>
          <div className="row">
            <Button
              className="deduction-button"
              variant="contained"
              color="primary"
              type="submit"
              onClick={addAllowance}
              disabled={
                employeeNumber.length <= 0 ||
                endMonth.length <= 0 ||
                endYear.length <= 0 ||
                startMonth.length <= 0 ||
                startYear.length <= 0 ||
                monthlyAllowance.length <= 0 ||
                totalAllowance.length <= 0 ||
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
        open={requestDialog}
        onClose={handleRequestDialog}
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

export default AddAllowanceForm;
