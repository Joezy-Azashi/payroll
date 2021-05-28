import React from "react";
import useTable from "../../useTable";
import "../../../index.css";
import { TableBody, TableCell, TableRow, InputAdornment, TextField, FormControl} from "@material-ui/core";
import { Search } from '@material-ui/icons';
import { BounceLoader } from "react-spinners";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer";
import {useSelector} from "react-redux";
import {statutoryReducer} from "../../../Services/_redux/statutory/statutory_slice";

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        maxHeight: '70vh',
    },
    totalsStyling: {
        backgroundColor: '#f5f6fa',
        color: '#cf4f1f'
    }

}));
export function TierTwoReportTable (filterFn, setFilterFn, updateSsnit, pageReady, data, totals) {

    
    const classes = useStyles();

    const statutory = useSelector(statutoryReducer)
    const pensionPercentage = statutory.ssnit.data;
    const getSsnitPercentage = () => {
        let ssnit = 0
        pensionPercentage.map((e) => {
            if (e.label === 'Tier 2 Rate') {
                ssnit = e.percentage
            }
        })
        return ssnit
    }
    const headCells = [
        { id: 'number', label: 'NO.', disableSorting: true },
        { id: 'name', label: 'NAME OF EMPLOYEE', disableSorting: true },
        { id: 'ssnitNumber', label: 'SSNIT NUMBER', disableSorting: true },
        { id: 'tierTwoNumber', label: 'TIER 2 NUMBER', disableSorting: true },
        { id: 'basicSalary', label: 'BASIC SALARY', disableSorting: true },
        { id: 'percentage', label: `SSF (${getSsnitPercentage()}%)`, disableSorting: true },
    ];


 
    const {
        TblContainer,
        TblHeadTwo,
        TablePaginations,
        recordsAfterPagingAndSorting
    } = useTable(data, headCells, filterFn, updateSsnit);

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
                            x.employeeNumber?.toLowerCase().match(target.value.toLowerCase())
                    )
            }
        })
    }

    return(
        <div>
           
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
                                    onInput={(event) => handleSearch(event)}
                                    />
                            </FormControl>
                </div>
                <div className="col-md-8">
                </div>

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
                            (!data.content || recordsAfterPagingAndSorting()?.length <= 0 || recordsAfterPagingAndSorting()[0].payrolls.length <= 0) ? (
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
                                                <TableCell>{(i + 1)}</TableCell>
                                                <TableCell>{item.lastName + ' ' + item.firstName + ' '}{(item.middleName !== 'null' ? item.middleName : '')}</TableCell>
                                                <TableCell>{item.customSSN}</TableCell>
                                                <TableCell>{item.tierTwoNumber}</TableCell>
                                                <TableCell>GH¢{item.payrolls[0].basicSalary?.toFixed(2)}</TableCell>
                                                <TableCell>GH¢{item.payrolls[0].tierTwo?.toFixed(2)}</TableCell>
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
                        <TableCell className=" table-bordered"> <strong>{totals.sumBasicSalary}</strong></TableCell>
                        <TableCell className=" table-bordered"> <strong>{totals.sumPercentage}</strong></TableCell>
                    </TableRow>
                </TblContainer>
                </TableContainer>
                {
                    (recordsAfterPagingAndSorting()?.length > 0 && recordsAfterPagingAndSorting()[0]?.payrolls)?.length > 0 ? (
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

export default TierTwoReportTable;