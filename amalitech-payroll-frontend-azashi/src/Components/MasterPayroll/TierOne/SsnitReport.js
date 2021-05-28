import React, {useEffect, useState} from "react";
import useTable from "../../useTable";
import "../../../index.css";
import { TableBody, TableCell, TableRow, InputAdornment} from "@material-ui/core";
import { FormControl  } from '@material-ui/core';
import { Grid, TextField } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import PrintToExcel from '../../PrintToExcel';
import { BounceLoader } from "react-spinners";
import DialogPageLoader from "../../DialogPageLoader";
import Dialog from '@material-ui/core/Dialog';
import TableContainer from "@material-ui/core/TableContainer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { fetchSsnitWithThunk } from '../../../Services/_redux/statutory'
import { statutoryReducer } from '../../../Services/_redux/statutory/statutory_slice'
import {payrollReportReducer} from '../../../Services/_redux/payrollReport/payroll-report-slice'
import {fetchTierOneReportWithThunk} from '../../../Services/_redux/payrollReport'
import {totalsReducer} from '../../../Services/_redux/totals/totals_slice'
import {fetchTier1TotalsWithThunk} from '../../../Services/_redux/totals'
import {useDispatch, useSelector} from 'react-redux';

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        maxHeight: '70vh',
    },
    totalsStyling: {
        backgroundColor: '#f5f6fa',
        color: '#cf4f1f'
    }

}));
function SsnitReport({updateFunction}) {
    const statutory = useSelector(statutoryReducer)
    const pensionPercentage = statutory.ssnit.data
    const tierOne = useSelector(payrollReportReducer);
    const emp = tierOne.tierOne
    const totalsReducers = useSelector(totalsReducer);
    const tier1Totals = totalsReducers.tier1Totals
    const dispatch = useDispatch()
    const classes = useStyles();

    const getSsnitPercentage = () => {
        let ssnit = 0
        pensionPercentage.map((e) => {
            if (e.label === 'Tier 1 Rate') {
                ssnit = e.percentage
            }
        })
        return ssnit
    }
    const headCells = [
        { id: 'number', label: 'NO.', disableSorting: true },
        { id: 'name', label: 'NAME OF EMPLOYEE', disableSorting: true },
        { id: 'ssnitNumber', label: 'SSNIT NUMBER', disableSorting: true },
        { id: 'basicSalary', label: 'BASIC SALARY', disableSorting: true },
        { id: 'percentage', label: `SSF (${getSsnitPercentage()}%)`, disableSorting: true },
    ]
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })



    const updateToNextPage = (page) => {
        updateFunction((page - 1))
    }


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
                                        className="mt-2"
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
                            emp?.preloader ? (
                                <TableRow
                                >
                                    <TableCell colSpan={6}>
                                    <div className="w-100 d-flex justify-content-center text-center">
                                        <BounceLoader size={90} color="#cf4f1f" loading />
                                    </div>
                                    </TableCell>
                                </TableRow>
                                ) :
                                (!emp.data.content || recordsAfterPagingAndSorting()?.length <= 0 || recordsAfterPagingAndSorting()[0].payrolls.length <= 0) ? (
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
                                                    <TableCell>{(i + 1)}</TableCell>
                                                    <TableCell>{item.lastName + ' ' + item.firstName + ' '}{(item.middleName !== 'null' ? item.middleName : '')}</TableCell>
                                                    <TableCell>{item.customSSN}</TableCell>
                                                    <TableCell>GH¢{item.payrolls[0].basicSalary?.toFixed(2)}</TableCell>
                                                    <TableCell>GH¢{item.payrolls[0].tierOne?.toFixed(2)}</TableCell>
                                                </TableRow>)
                                            )
                                        }
                                    </TableBody>
                                )
                        }

                         {/*TOTALS*/}
                    <TableRow className={classes.totalsStyling}>
                    </TableRow>
                    <TableRow className={classes.totalsStyling}>
                        <TableCell> <strong>TOTALS</strong></TableCell>
                        <TableCell> <strong></strong></TableCell>
                        <TableCell> <strong></strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{tier1Totals.data.sumBasicSalary}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{tier1Totals.data.sumPercentage}</strong></TableCell>
                    </TableRow>
                </TblContainer>
                </TableContainer>
            {
                (recordsAfterPagingAndSorting()?.length > 0 && recordsAfterPagingAndSorting()[0].payrolls.length > 0) ? (
                    <div className="row justify-content-center d-flex text-center w-100">
                        <div className="col-md-12 p-3 text-center justify-content-center d-flex">
                            <TablePaginations />
                        </div>
                    </div>
                ) : null
            }
            </div>
        </div>
    )
}

export default SsnitReport;
