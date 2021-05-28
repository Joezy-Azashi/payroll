import React from "react";
import useTable from "../../useTable";
import "../../../index.css";
import { TableBody, TableCell, TableRow} from "@material-ui/core";
import { BounceLoader } from "react-spinners";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer";
import {useSelector} from "react-redux";
import {statutoryReducer} from "../../../Services/_redux/statutory/statutory_slice";
import {pageNumbering} from "../../../Services/employeeService";

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        maxHeight: '70vh',
    },
    totalsStyling: {
        backgroundColor: '#f5f6fa',
        color: '#cf4f1f'
    }

}));
export function TierTwoTable (filterFn, updateSsnit, pageReady, data, totals) {

    
    const classes = useStyles();

    const statutory = useSelector(statutoryReducer)
    const pensionPercentage = statutory.ssnit.data;
    const getTierOneRate = () => {
        let rate = 5
        pensionPercentage.map((item) => {
            if(item.label === 'Tier 2 Rate'){
                rate = item.percentage
            }
        })
        return rate
    }
    const headCells = [
        { id: 'number', label: 'NO.', disableSorting: true },
        { id: 'name', label: 'NAME OF EMPLOYEE', disableSorting: true },
        { id: 'ssnitNumber', label: 'SSNIT NUMBER', disableSorting: true },
        { id: 'tierTwoNumber', label: 'TIER 2 NUMBER', disableSorting: true },
        { id: 'basicSalary', label: 'BASIC SALARY', disableSorting: true },
        { id: 'percentage', label: `SSF (${getTierOneRate()})`, disableSorting: true },
    ];

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

 
    const {
        TblContainer,
        TblHeadTwo,
        TablePaginations,
        recordsAfterPagingAndSorting
    } = useTable(data, headCells, filterFn, updateSsnit);

    return(
        <div>
           
            <div className="table-responsive">
                <TableContainer className={classes.tableContainer}>
                <TblContainer>
                    <TblHeadTwo
                    />
                    {
                        pageReady ? (
                            <TableRow
                            >
                                <TableCell colspan={6}>
                                <div className="w-100 d-flex justify-content-center text-center">
                                    <BounceLoader size={90} color="#cf4f1f" loading />
                                </div>
                                </TableCell>
                            </TableRow>
                            ) :
                            (recordsAfterPagingAndSorting()?.length <= 0 || recordsAfterPagingAndSorting()?.length <= 0) ? (
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
                                            (<TableRow key={item.id} style={{backgroundColor:"#ffffff", border:"5px solid #f0f0f7"}}>
                                                <TableCell>{(i + 1) + pageNumbering(data.number)}</TableCell>
                                                <TableCell>{item.lastName + ' ' + item.firstName + ' '}{(item.middleName !== 'null' ? item.middleName : '')}</TableCell>
                                                <TableCell>{item.customSSN}</TableCell>
                                                <TableCell>{item.tierTwoNumber}</TableCell>
                                                <TableCell>GH¢{(item.basicSalary).toFixed(2)}</TableCell>
                                                <TableCell>GH¢{(item.tierTwo).toFixed(2)}</TableCell>
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
                        <TableCell> <strong></strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{totals.sumBasicSalary?.toFixed(2)}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{totals.sumPercentage?.toFixed(2)}</strong></TableCell>
                    </TableRow>
                </TblContainer>
                </TableContainer>
                {
                    recordsAfterPagingAndSorting()?.length > 0 ? (
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

export default TierTwoTable;