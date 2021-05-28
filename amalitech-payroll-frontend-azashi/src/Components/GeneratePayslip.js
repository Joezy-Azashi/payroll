import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import {makeStyles} from '@material-ui/core';
import ReactToPrint from 'react-to-print';
import PayslipClass from './PayslipClass'
const useStyles = makeStyles(theme => ({
    root: {},
    tableBorder: {
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
    },
    cellBorder: {
        borderWidth: 0,
        borderTopWidth: 1,
        borderButWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
    }
}));

export default function GeneratePayslip({employee}) {
    const [open, setOpen] = React.useState(false);

  const componentRef = useRef();
  return(

          <div id={"printable"}>
              <PayslipClass employee={employee} ref={componentRef} />
              <div className="row justify-content-center text-center p-0 m-0">
                  <div className="col-12 py-4">
                      <ReactToPrint
                          trigger={() => {
                              // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                              // to the root node of the returned component as it will be overwritten.
                              return <Button className="employeesalary-savebtn">
                                  Print Slip
                              </Button>;
                          }}
                          content={() => componentRef.current}
                      />
                  </div>
              </div>
          </div>
  )
}

export function PaySlipPage({employee}) {
    const classes = useStyles()
    const [selectedEmployee, setSelectedEmployee] = React.useState(employee.employee)
    const [payslip, setPayslip] = React.useState(employee.payslip)
    const getDate = (date) => {
        const month = moment(date, 'YYYY-M').format('MMMM')
        const year = moment(date, 'YYYY-M').format('YYYY')
        return `${month}  ${year}`
    }
    return (
        <div>
            <DialogTitle className="paysliptitle" id="form-dialog-title">AMALITECH TRAINING ACADEMY LIMITED</DialogTitle>
            <DialogContent>
                <div align="center" className="mt-2">
                    <label><strong>Payslip for {getDate(`${payslip.year}-${payslip.month}`)}</strong></label>
                </div>
                <div className="row">
                    <div className="col-6 slipcolumns">
                        <div className="form-group justify-content-between d-flex">
                            <label><strong>Staff Name</strong></label>
                            <div className="d-flex">
                                <p>{payslip.lastName + ' ' + payslip.firstName + ' ' + payslip.middleName }</p>
                            </div>
                        </div>
                        <div className="form-group justify-content-between d-flex">
                            <label><strong>Department</strong></label>
                            <div className="d-flex">
                                <p>{payslip.employeeDepartment}</p>
                            </div>
                        </div>
                        <div className="form-group justify-content-between d-flex">
                            <label><strong>Email</strong></label>
                            <div className="d-flex">
                                <p>{selectedEmployee.workEmail}</p>
                            </div>
                        </div>
                        <div className="form-group justify-content-between d-flex">
                            <label><strong>Bank Name</strong></label>
                            <div className="d-flex">
                                <p>{selectedEmployee.bankName}</p>
                            </div>
                        </div>
                        <div className="form-group justify-content-between d-flex">
                            <label><strong>Account number</strong></label>
                            <div className="d-flex">
                                <p>{selectedEmployee.accountNumber}</p>
                            </div>
                        </div>
                        <div className="form-group ">
                            <label><strong>Earnings</strong></label>
                            <div>
                                <TableContainer>
                                    <Table>
                                        <TableBody className={classes.tableBorder}>
                                            <TableRow >
                                                <TableCell className={classes.cellBorder} component="th" scope="row">
                                                    <strong>Basic Salary</strong>
                                                </TableCell>
                                                <TableCell className={classes.cellBorder} align="right">
                                                    {payslip.basicSalary}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell className={classes.cellBorder} component="th" scope="row">
                                                    <strong>Misc. Allowance</strong>
                                                </TableCell>
                                                <TableCell className={classes.cellBorder} align="right">
                                                    {payslip.totalAllowance}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={classes.cellBorder} component="th" scope="row">
                                                    <strong>Overtime Premium</strong>
                                                </TableCell>
                                                <TableCell className={classes.cellBorder} align="right">
                                                    0
                                                </TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell className={classes.cellBorder} component="th" scope="row">
                                                    <strong>Total Earnings</strong>
                                                </TableCell>
                                                <TableCell className={classes.cellBorder} align="right">
                                                    GHS {payslip.grossSalary}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                        <div className="form-group justify-content-between d-flex">
                            <label><strong>Net Pay</strong></label>
                            <div className="d-flex">
                                <p>GHs {payslip.payableNetSalary}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 slipcolumns">
                        <div className="form-group justify-content-between d-flex">
                            <label><strong>Staff ID</strong></label>
                            <div className="d-flex">
                                <p>{payslip.employeeNumber}</p>
                            </div>
                        </div>
                        <div className="form-group justify-content-between d-flex">
                            <label><strong>Job Description</strong></label>
                            <div className="d-flex">
                                <p>{payslip.employeePosition}</p>
                            </div>
                        </div>
                        <div className="form-group justify-content-between d-flex">
                            <label><strong>Annual Basic Salary</strong></label>
                            <div className="d-flex">
                                <p>GHS {(payslip.basicSalary * 12)}</p>
                            </div>
                        </div>
                        <div className="form-group justify-content-between d-flex">
                            <label><strong>Branch</strong></label>
                            <div className="d-flex">
                                <p>{selectedEmployee.branchName}</p>
                            </div>
                        </div>
                        <div className="form-group justify-content-between d-flex">
                            <label><strong>SSNIT Number</strong></label>
                            <div className="d-flex">
                                <p>{selectedEmployee.customSSN}</p>
                            </div>
                        </div>
                        <div className="form-group ">
                            <label><strong>Deductions</strong></label>
                            <div>
                                <TableContainer>
                                    <Table>
                                        <TableBody className={classes.tableBorder}>
                                            <TableRow >
                                                <TableCell className={classes.cellBorder} component="th" scope="row">
                                                    <strong>Employee 5.5% SSF</strong>
                                                </TableCell>
                                                <TableCell className={classes.cellBorder} align="right">
                                                    GHS {payslip.employerSSF}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell className={classes.cellBorder} component="th" scope="row">
                                                    <strong>P.A.Y.E.</strong>
                                                </TableCell>
                                                <TableCell className={classes.cellBorder} align="right">
                                                    {payslip.paye}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell className={classes.cellBorder} component="th" scope="row">
                                                    <strong>Other Deductions</strong>
                                                </TableCell>
                                                <TableCell className={classes.cellBorder} align="right">
                                                    0
                                                </TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell className={classes.cellBorder} component="th" scope="row">
                                                    <strong>Total Deductions</strong>
                                                </TableCell>
                                                <TableCell className={classes.cellBorder} align="right">
                                                    GHS {payslip.totalDeduction}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </div>
    )
}