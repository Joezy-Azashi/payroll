import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import {FormControl, InputLabel, Select, MenuItem, Button, Snackbar} from '@material-ui/core';
import { useLocation } from 'react-router';
import queryString from 'query-string';
import Api from "../Services/api";
import {Alert} from "@material-ui/lab";
import GeneratePayslip from "../Components/GeneratePayslip";
import Dialog from "@material-ui/core/Dialog";
  

function PayslipDownload() {

    let location = useLocation()
    const query = queryString.parse(location.search)

    const currentMonth = () => {
        return (new Date().getMonth() + 1)
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
            { name: 'January', value: 1},
            { name: 'February', value: 2},
            { name: 'March', value: 3},
            { name: 'April', value: 4},
            { name: 'May', value: 5},
            { name: 'June', value: 6},
            { name: 'July', value: 7},
            { name: 'August', value: 8},
            { name: 'September', value: 9},
            { name: 'October', value: 10},
            { name: 'November', value: 11},
            { name: 'December', value: 12}
        ]
    }

    const currentDateMonth = () => {
        const year = new Date().getFullYear()
        const month = (new Date().getMonth() + 1)
        return `${year}-${month}`
    }
    
    const [year, setYear] = useState(currentYear())
    const [month, setMonth] = useState(currentMonth())
    const [years, setYears] = useState(yearList())
    const [months, setMonths] = useState(monthList())
    const [alertType, setAlertType] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')
    const [alertOpen, setAlertOpen] = useState(false)
    const [selectedPayslip, setSelectedPayslip] = useState({})
    const [open1, setOpen1] = useState(false);
    const [isValidLink, setIsValidLink] = useState(false);
    // const [email, handleDateChange] = useState('');

    // const handleDateChange = (date) => {
    //     const year = moment(date, "YYYY-MM").format("YYYY")
    //     const month = moment(date, "YYYY-MM").format("MMMM")
    //     setDate(date)
    //     setYear(year)
    //     setMonth(month)
    // }

    const handleClose1 = () => {
        setSelectedPayslip({})
        setOpen1(false);
      };

    /*open and close alert*/
    const handleAlertState = (alertOpen, alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertMessage(alertMessage)
        setAlertOpen(alertOpen)
    }
   //   FUNCTION TO SEND REQUEST
  const sendDownloadRequest = () => {
    const sendRequest = {
        month: month,
        year: year,
        linkId: query.id
    };
    Api().post('/payrolls/employee-payroll', sendRequest)
    .then((response) => {
        /*get the response data*/
        let data = response.data
        /*construct the expected payroll Id*/
        const dataToFetchId = `${data.employeeNumber}_${sendRequest.month}_${sendRequest.year}`
        /*filter the payroll to get the specified payroll*/
        const payroll = data.payrolls.filter(payroll => {
            return (payroll.payrollId.toString() === dataToFetchId.toString())
        })
        data.payrolls = payroll
        const payslipData = {
            employee: data,
            payslip: data.payrolls[0] || {}
        }
        setSelectedPayslip(payslipData)
        if (payroll.length > 0) {
            setOpen1(true)
        } else {
            const month = monthList.filter((month) => {
                return (month.value === sendRequest.month)
            })
            handleAlertState(true, 'error',  `No Payslip Available For ${month.name} ${sendRequest.year}`)
        }
    }).catch((error) => {
        handleAlertState(true, 'error', error.response.data)
    })
    }

    const getRequest = (urlId) => {
        Api().get(`/payrolls/verify-link/${urlId}`)
        .then((response) => {
            setIsValidLink(true)
            handleAlertState(true, 'success', 'Token Validation Successful, Proceed to download the payslip')
        }).catch((error) => {
            const message = 'Sorry! could not send request, Please request for a new link'
            handleAlertState(true, 'error', message)
            setTimeout(() => {
                window.location.assign('/payslip-request')
            }, 3000)
        })
        }

    useEffect(() => {
        if(!isValidLink) {
            getRequest(query.id)
        }
    }, [])

    return (
        <div>
            <Card className="cardStyling">
                <div className="w-100 mx-4">
                    
                    <div className="mb-5 mt-0">
                        <h4>Payslip Download Form</h4>
                    </div>

                    {/* PAYSLIP DOWNLOAD FORM */}
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        sendDownloadRequest()
                    }}>
                        <div className=" row mx-1 justify-content-center">
                            <div className="col-md-6">
                                <FormControl
                                    size="small"
                                    fullWidth="true"
                                    className="mx-2 bg-white"
                                >
                                    <InputLabel className="px-2">Month</InputLabel>
                                    <Select
                                        label="Department"
                                        value={month}
                                        onChange={(event) => setMonth(event.target.value)}
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
                            <div className="col-md-6">
                                <FormControl
                                    size="small"
                                    fullWidth="true"
                                    className="mx-2 bg-white"
                                >
                                    <InputLabel className="px-2">Year</InputLabel>
                                    <Select
                                        label="Department"
                                        value={year}
                                        onChange={(event) => setYear(event.target.value)}
                                    >
                                        {
                                            years.length > 0 ? (
                                                years.map((year) => (
                                                    <MenuItem value={year}>{year}</MenuItem>
                                                ))
                                            ) : null
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <Grid item md={12} lg={12} sm={12} xs={12}>
                                <Button
                                    className="text-capitalize btn-amalitech mr-2 mt-5"
                                    variant="contained"
                                    size="small"
                                    type="submit"
                                    >
                                    Generate Payslip

                                </Button>
                        </Grid>
                    </form>
                </div>
                <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => handleAlertState(false, '', '')}
                          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert  severity={alertType}>
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </Card>
            <Dialog open={open1} onClose={handleClose1} aria-labelledby="form-dialog-title" fullWidth maxWidth="md"
                    classes={{paperFullScreen: "prePrint printDialog"}}
            >
                <GeneratePayslip employee={selectedPayslip}/>
            </Dialog>
        </div>
    )
}

export default PayslipDownload;


