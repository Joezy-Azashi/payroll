import React, { useState, useEffect } from 'react'
import {FormControl, InputLabel, Select as Selected, MenuItem, Button } from '@material-ui/core'
import { monthListString, yearList } from '../../Services/employeeService'
import Select from 'react-select';
import Api from "../../Services/api";
import { ConvertedEmployees } from "../ConvertedEmployees";
import {handleStateAlert, payrollReportReducer} from "../../Services/_redux/payrollReport/payroll-report-slice";
import {useDispatch, useSelector} from "react-redux";

const IndividualSearchFilter = ({filterFunction}) => {

    const report = useSelector(payrollReportReducer)
    const dispatch = useDispatch()
    const emp = report.individualPayrolls
    const currentYear = () => {
        return new Date().getFullYear()
    }

    const currentMonth = () => {
        return (('0' + ((new Date().getMonth()) + 1))).slice(-2)
    }


    const [startMonth, setStartMonth] = useState(currentMonth())
    const [startYear, setStartYear] = useState(currentYear())
    const [endMonth, setEndMonth] = useState(currentMonth())
    const [endYear, setEndYear] = useState(currentYear())
    const [getEmployess, setGetEmployess] = useState([]);
    const [selectedEmployee, setSelectedEmployeeNumber] = useState('');



    // FUNCTION TO FETCH LIST OF EMPLOYESS FOR THE USE AT THE MULTISELECT COMPONENT
    const getEmployees = () => {
    Api().get("/employees/id-name").then((response) => {
        setGetEmployess(ConvertedEmployees(response.data));
    }).catch((error) => {});

  };

  //getting selected employee
  const handleEmployyeChange = selectedOption => {
    setSelectedEmployeeNumber(selectedOption.value)
  };
  const activeFilterButton = () => {
      return !!(!selectedEmployee || selectedEmployee === '')
  }
    const handleAlertState = (openAlert, alertType, message) => {
        dispatch(handleStateAlert({openAlert, alertType, message, type: 'individualPayrolls'}))
    }

  const filterData = () => {
      if (activeFilterButton()) {
          handleAlertState(true, 'error', 'You must select an employee')
          return
      }
      const data = {
          employeeId: selectedEmployee,
          endYearMonth: `${endYear}-${endMonth}`,
          startYearMonth: `${startYear}-${startMonth}`
      }
      filterFunction(data)
  }

    // USEEFFECT TO FETCH DATA ON PAGE LOAD
    useEffect(async() => {
        getEmployees();
      }, []);

    return (
        <div>
            <div className="row mb-4">
                {/* EMPLOYEE SEARCH */}
                <div className="col-md-3 mb-2">
                    <FormControl
                        size="small"
                        fullWidth="true"
                        className="bg-white"
                        color="primary"
                        >
                            
                            <Select
                                onChange={ handleEmployyeChange }
                                options={getEmployess}
                            />
                    </FormControl>
                </div>

                {/* START DATE */}
                <div className="col-md-3 mb-2">
                    <FormControl 
                        variant="outlined" 
                        className="bg-white col-md-6 mb-1" 
                        size="small" 
                        fullWidth>
                        <InputLabel>Start Month</InputLabel>
                        <Selected
                        label="Department"
                        value={startMonth}
                        onChange={(event) => setStartMonth(event.target.value)}
                        >
                        {
                                monthListString().length > 0 ? (
                                    monthListString().map((month) => (
                                        <MenuItem value={month.value}>{month.name}</MenuItem>
                                    ))
                                ) : null
                            }
                        </Selected>
                    </FormControl>
                    <FormControl
                        variant="outlined"
                        size="small"
                        fullWidth="true"
                        className="bg-white col-md-6"
                        >
                        <InputLabel>Start Year</InputLabel>
                        <Selected
                            label="Department"
                            value={startYear}
                            onChange={(event) => setStartYear(event.target.value)}
                            >
                            {
                                yearList().length > 0 ? (
                                    yearList().map((year) => (
                                        <MenuItem value={year}>{year}</MenuItem>
                                    ))
                                ) : null
                            }
                        </Selected>
                    </FormControl>
                </div>

                {/* END DATE */}
                <div className="col-md-3">
                    <FormControl 
                        variant="outlined" 
                        className="bg-white col-md-6 mb-1" 
                        size="small" 
                        fullWidth
                        >
                            <InputLabel>End Month</InputLabel>
                            <Selected
                            label="Department"
                            value={endMonth}
                            onChange={(event) => setEndMonth(event.target.value)}
                            >
                            {
                                    monthListString().length > 0 ? (
                                        monthListString().map((month) => (
                                            <MenuItem value={month.value}>{month.name}</MenuItem>
                                        ))
                                    ) : null
                                }
                            </Selected>
                    </FormControl>
                    <FormControl
                        variant="outlined"
                        size="small"
                        fullWidth="true"
                        className="bg-white col-md-6"
                        >
                            <InputLabel>End Year</InputLabel>
                            <Selected
                                label="Department"
                                value={endYear}
                                onChange={(event) => setEndYear(event.target.value)}
                                >
                                {
                                    yearList().length > 0 ? (
                                        yearList().map((year) => (
                                            <MenuItem value={year}>{year}</MenuItem>
                                        ))
                                    ) : null
                                }
                            </Selected>
                    </FormControl>
                </div>

                {/* FILTER BUTTON */}
                <div className="col-md-1">
                    <Button
                        className="text-capitalize btn-amalitech w-100 mt-2"
                        variant="contained"
                        size="small"
                        type="submit"
                        onClick={() => filterData()}
                        >
                        Find
                    </Button>
                </div>
            </div>           
        </div>
    )
}

export default IndividualSearchFilter