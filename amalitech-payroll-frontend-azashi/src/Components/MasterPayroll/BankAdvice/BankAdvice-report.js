import React, {useEffect, useState} from "react";
import useTable from "../../useTable";
import "../../../index.css";
import {FormControl, InputAdornment, TableBody, TableCell, TableRow, TextField} from "@material-ui/core";
import { BounceLoader } from "react-spinners";
import DialogPageLoader from "../../DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import {useSelector} from "react-redux";
import {payrollReportReducer} from "../../../Services/_redux/payrollReport/payroll-report-slice";
import {Search} from "@material-ui/icons";


function BankAdviceReport({updateFunction}) {

    const bankAdvice = useSelector(payrollReportReducer);
    const emp = bankAdvice.bankAdvice
    const headCells = [
        { id: 'no', label: 'NO.', disableSorting: true },
        { id: 'name', label: 'NAME OF EMPLOYEE', disableSorting: true },
        { id: 'bankName', label: 'BANK NAME', disableSorting: true },
        { id: 'branchName', label: 'ACCOUNT BRANCH', disableSorting: true },
        { id: 'accountNumber', label: 'ACCOUNT NUMBER', disableSorting: true },
        { id: 'netSalary', label: 'NET SALARY', disableSorting: true },
    ]
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
        const [requestDialog, setRequestDialog] = useState(false);
    
        const handleRequestDialog = () => {
            setRequestDialog(false)
        }


    const updateToNextPage = (page) => {
        updateFunction((page - 1))
    }

    useEffect(() => {
    }, []);
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
                            x.department?.toLowerCase().match(target.value.toLowerCase()) ||
                            x.jobTitle?.toLowerCase().match(target.value.toLowerCase())
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

        <div className="table-responsive">
            <TblContainer>
                <TblHeadTwo
                />
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
                            ) :
                            (!emp.data.content || recordsAfterPagingAndSorting()?.length <= 0 || recordsAfterPagingAndSorting()[0].payrolls?.length <= 0) ? (
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
                                        recordsAfterPagingAndSorting()?.map((item, i) =>{
                                            if (item.payrolls.length > 0) {
                                                return (<TableRow key={item.employeeNumber} style={{backgroundColor:"#ffffff", border:"5px solid #f0f0f7"}}>
                                                    <TableCell>{(i + 1)}</TableCell>
                                                    <TableCell>{item.lastName + ' ' + item.firstName + ' ' }{(item.middleName !== 'null' ? item.middleName : '')}</TableCell>
                                                    <TableCell>{item.payrolls[0].bankName}</TableCell>
                                                    <TableCell>{item.payrolls[0].branchName}</TableCell>
                                                    <TableCell>{item.payrolls[0].accountNumber}</TableCell>
                                                    <TableCell>{item.payrolls[0].payableNetSalary.toFixed(2)}</TableCell>
                                                </TableRow>)
                                            }
                                        }
                                        )
                                    }
                                </TableBody>
                            )
                    }
            </TblContainer>
        {
            (recordsAfterPagingAndSorting()?.length > 0 && recordsAfterPagingAndSorting()[0].payrolls?.length > 0) ? (
                <div className="row justify-content-center d-flex text-center w-100">
                    <div className="col-md-12 p-3 text-center justify-content-center d-flex">
                        <TablePaginations />
                    </div>
                </div>
            ) : null
        }
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

export default BankAdviceReport;
