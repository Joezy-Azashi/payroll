import React, { useState } from 'react'
import { Table, TableHead, TableRow, TableCell, makeStyles, TablePagination, TableSortLabel } from '@material-ui/core'
import { Pagination } from '@material-ui/lab';
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles(theme => ({
    table: {
        marginTop: theme.spacing(1),
        '& thead th': {
            fontWeight: '600',
            color: '#404040',
            backgroundColor: '#f5f6fa',
        },
        '& tbody td': {
            fontWeight: '300',
        },
        '& tbody tr:hover': {
            backgroundColor: '#fffbf2',
            cursor: 'pointer',
        },
        '&tableBoddy' : {
            backgroundColor: 'blue',
        }
    },
}))

export default function useTable(records, headCells, filterFn, updateData) {

    const classes = useStyles();

    const pages = [5, 10, 25]
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(pages[page])
    const [order, setOrder] = useState()
    const [orderBy, setOrderBy] = useState()

    const TblContainer = props => (
        <Table stickyHeader className={classes.table} >
            {props.children}
        </Table>
    )

    const TblHead = props => {

        const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
        const handleSortRequest = cellId => {
            const isAsc = orderBy === cellId && order === "asc";
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(cellId)
        }

        return (<TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all employees' }}
                    />
                </TableCell>
                {
                    headCells.map(headCell => (
                        <TableCell key={headCell.id}
                            sortDirection={orderBy === headCell.id ? order : false}>
                            {headCell.disableSorting ? headCell.label :
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={() => { handleSortRequest(headCell.id) }}>
                                    {headCell.label}
                                </TableSortLabel>
                            }
                        </TableCell>))
                }
            </TableRow>
        </TableHead>)
    }
    const TblHeadTwo = () => {

        return (<TableHead>
            <TableRow >
                {
                    headCells.map(headCell => (
                        <TableCell key={headCell.id}>
                            {headCell.label}
                        </TableCell>))
                }
            </TableRow>
        </TableHead>)
    }

    const handleChangePage = (event, newPage) => {
        updateData(newPage)
    }

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0);
    }

    const TblPagination = () => (<TablePagination
        component="div"
        page={page}
        rowsPerPageOptions={pages}
        rowsPerPage={rowsPerPage}
        count={records?.content?.length}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
    />)
    const TablePaginations = () => (<Pagination
        page={(records?.pageable?.pageNumber + 1)}
        count={records?.totalPages}
        onChange={handleChangePage}
        color={"primary"}
        shape={"round"}
        size={"small"}
        variant={"outlined"}
    />)

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const recordsAfterPagingAndSorting = () => {
        /*return stableSort(filterFn.fn(records.content), getComparator(order, orderBy))
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)*/
        return filterFn.fn(records?.content)
    }

    return {
        TblContainer,
        TblHead,
        TblHeadTwo,
        TblPagination,
        recordsAfterPagingAndSorting,
        TablePaginations
    }
}
