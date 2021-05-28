import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import moment from "moment";
import {makeStyles} from "@material-ui/core";
import '../index.css'

class PayslipClass extends React.PureComponent {
    constructor({employee}) {
        super({employee});
        this.state = {
            selectedEmployee: employee.employee,
            payslip: employee.payslip,
            classes: makeStyles(theme => ({
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
        }))
        }
        this.getDate = this.getDate.bind(this)
        this.displayAccountNumber = this.displayAccountNumber.bind(this)
        this.getTotalEarnings = this.getTotalEarnings.bind(this)
        this.getTotalDeductions = this.getTotalDeductions.bind(this)
    }
    getDate(date){
        const month = moment(date, 'YYYY-M').format('MMMM')
        const year = moment(date, 'YYYY-M').format('YYYY')
        return `${month}  ${year}`
    }
    displayAccountNumber(data = ''){
        if (data && data.length > 3) {
            const starLength = (data.length - 3)
            let stars = ''
            for (let i = 0; i < starLength; i++) {
                stars += '*'
            }
            return (stars + data.slice(data.length - 3))
        } else {
            return data
        }

    }
    getTotalEarnings(basicSalary, allowances, bonuses){
        let totalAllowance = 0
        let totalBonus = 0
        allowances.map(allowance => {
            totalAllowance += allowance.monthlyAllowance
        })
        bonuses.map(bonus => {
            totalBonus += bonus.monthlyBonus
        })
        return (basicSalary + totalAllowance + totalBonus).toFixed(2)
    }
    getTotalDeductions(ssf, paye, bonusTax, deductions){
        let totalDeduction = 0
        deductions.map(deduction => {
            totalDeduction += deduction.monthlyDeduction
        })
        return (ssf + paye + bonusTax + totalDeduction).toFixed(2)
    }
    render() {
        const pageStyle = `
              @page {
                size: 80mm 50mm;
              }`
        return(
            <div className={pageStyle}>
                <DialogTitle className="paysliptitle" id="form-dialog-title">AMALITECH TRAINING ACADEMY LIMITED</DialogTitle>
                <DialogContent>
                    <div align="center" className="mt-2 payslipStyle">
                        <label><strong>Payslip for {this.getDate(`${this.state.payslip.year}-${this.state.payslip.month}`)}</strong></label>
                    </div>
                    <div className="net-pay-div" />
                    <div className="mt-2 d-flex slipcolumnsSideTop justify-content-between payslipStyle">
                        <label><strong>SSNIT Office Complex</strong></label>
                        <label><strong>27 Ama Akroma Street</strong></label>
                        <label><strong>Takoradi. Ghana</strong></label>
                    </div>
                    <div className="net-pay-div" />
                    <div className="row payslipStyle">
                        <div className="col-6 slipcolumns">
                            <div className="form-group justify-content-between d-flex">
                                <label><strong>Staff Name</strong></label>
                                <div className="d-flex">
                                    <p>{this.state.payslip.lastName + ' ' + this.state.payslip.firstName + ' '} {(this.state.payslip.middleName !== 'null' ? this.state.payslip.middleName : '')} </p>
                                </div>
                            </div>
                            <div className="form-group justify-content-between d-flex">
                                <label><strong>Department</strong></label>
                                <div className="d-flex">
                                    <p>{this.state.payslip.employeeDepartment}</p>
                                </div>
                            </div>
                            <div className="form-group justify-content-between d-flex">
                                <label><strong>Email</strong></label>
                                <div className="d-flex">
                                    <p>{this.state.selectedEmployee.workEmail}</p>
                                </div>
                            </div>
                            <div className="form-group justify-content-between d-flex">
                                <label><strong>Bank Name</strong></label>
                                <div className="d-flex">
                                    <p>{this.state.selectedEmployee.bankName}</p>
                                </div>
                            </div>
                            <div className="form-group justify-content-between d-flex">
                                <label><strong>Account number</strong></label>
                                <div className="d-flex">
                                    <p>{this.displayAccountNumber(this.state.selectedEmployee.accountNumber)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 slipcolumns">
                            <div className="form-group justify-content-between d-flex">
                                <label><strong>Staff ID</strong></label>
                                <div className="d-flex">
                                    <p>{this.state.payslip.employeeNumber}</p>
                                </div>
                            </div>
                            <div className="form-group justify-content-between d-flex">
                                <label><strong>Job Description</strong></label>
                                <div className="d-flex">
                                    <p>{this.state.payslip.employeePosition}</p>
                                </div>
                            </div>
                            <div className="form-group justify-content-between d-flex">
                                <label><strong>Annual Basic Salary</strong></label>
                                <div className="d-flex">
                                    <p>GHS {(this.state.payslip.basicSalary * 12)}</p>
                                </div>
                            </div>
                            <div className="form-group justify-content-between d-flex">
                                <label><strong>Branch</strong></label>
                                <div className="d-flex">
                                    <p>{this.state.selectedEmployee.branchName}</p>
                                </div>
                            </div>
                            <div className="form-group justify-content-between d-flex">
                                <label><strong>SSNIT Number</strong></label>
                                <div className="d-flex">
                                    <p>{this.state.selectedEmployee.customSSN}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*earnings row*/}
                    <div className="row">
                        <div className="col-12 slipcolumns">
                            <div className="form-group">
                                <label style={{fontSize: '18px'}}><strong className="payslipStyle">Earnings</strong></label>
                                <div>
                                    <TableContainer>
                                        <Table>
                                            <TableBody className={"tableBorder"}>
                                                <TableRow >
                                                    <TableCell className={"cellBorder"} component="th" scope="row">
                                                        <strong className="payslipStyle">Basic Salary</strong>
                                                    </TableCell>
                                                    <TableCell className={"cellBorder"} align="right">
                                                        GH¢ {this.state.payslip.basicSalary.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                                {
                                                    this.state.payslip.allowances?.map((allowance) => (
                                                        <TableRow >
                                                            <TableCell className={"cellBorder"} component="th" scope="row">
                                                                <strong className="payslipStyle">{allowance.description}</strong>
                                                            </TableCell>
                                                            <TableCell className={"cellBorder"} align="right">
                                                                GH¢ {allowance.monthlyAllowance.toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                                {
                                                    this.state.payslip.bonuses?.map((bonus) => (
                                                        <TableRow >
                                                            <TableCell className={"cellBorder"} component="th" scope="row">
                                                                <strong className="payslipStyle">{bonus.description}</strong>
                                                            </TableCell>
                                                            <TableCell className={"cellBorder"} align="right">
                                                                GH¢ {bonus.monthlyBonus.toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                                <TableRow >
                                                    <TableCell className={"cellBorder"} component="th" scope="row">
                                                        <strong className="payslipStyle">Total Earnings</strong>
                                                    </TableCell>
                                                    <TableCell className={"cellBorder"} align="right">
                                                        <strong>GH¢ {this.getTotalEarnings(this.state.payslip.basicSalary, this.state.payslip.allowances, this.state.payslip.bonuses)}</strong>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*deductions row*/}
                    <div className="row">
                        <div className="col-12 slipcolumns">
                            <div className="form-group">
                                <label style={{fontSize: '18px'}}><strong className="payslipStyle">Deductions</strong></label>
                                <div>
                                    <TableContainer>
                                        <Table>
                                            <TableBody className={"tableBorder"}>
                                                <TableRow >
                                                    <TableCell className={"cellBorder"} component="th" scope="row">
                                                        <strong className="payslipStyle">Employee 5.5% SSF</strong>
                                                    </TableCell>
                                                    <TableCell className={"cellBorder"} align="right">
                                                        GH¢ {this.state.payslip.employeeSSF.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow >
                                                    <TableCell className={"cellBorder"} component="th" scope="row">
                                                        <strong className="payslipStyle">P.A.Y.E.</strong>
                                                    </TableCell>
                                                    <TableCell className={"cellBorder"} align="right">
                                                        GH¢ {this.state.payslip.paye.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                                {
                                                    this.state.payslip.bonuses.length > 0 ?
                                                    (<TableRow >
                                                    <TableCell className={"cellBorder"} component="th" scope="row">
                                                    <strong className="payslipStyle">Tax On Bonuses</strong>
                                                    </TableCell>
                                                    <TableCell className={"cellBorder"} align="right">
                                                        GH¢ {this.state.payslip.totalTaxOnBonus.toFixed(2)}
                                                    </TableCell>
                                                    </TableRow>) : null

                                                }
                                                {
                                                    this.state.payslip.deductions?.map((deduction) => (
                                                        <TableRow >
                                                            <TableCell className={"cellBorder"} component="th" scope="row">
                                                                <strong className="">{deduction.description}</strong>
                                                            </TableCell>
                                                            <TableCell className={"cellBorder"} align="right">
                                                                GH¢ {deduction.monthlyDeduction.toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                                <TableRow >
                                                    <TableCell className={"cellBorder"} component="th" scope="row">
                                                        <strong className="payslipStyle">Total Deductions</strong>
                                                    </TableCell>
                                                    <TableCell className={"cellBorder"} align="right">
                                                        <strong>GH¢ {this.getTotalDeductions(this.state.payslip.employeeSSF, this.state.payslip.paye, this.state.payslip.totalTaxOnBonus, this.state.payslip.deductions )}</strong>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="net-pay-div" />
                    <div className="row">
                        <div className="col-12 mt-2 slipcolumnsSide justify-content-between d-flex align-items-center payslipStyle">
                            <label style={{fontSize: '18px'}}><strong>Net Pay</strong></label>
                            <div className="d-flex">
                                <p style={{fontSize: '18px'}}><strong>GHs {(this.state.payslip.payableNetSalary).toFixed(2)}</strong></p>
                            </div>
                        </div>
                    </div>
                    <div className="net-pay-div" />
                </DialogContent>
            </div>
        );
    }
}
export default PayslipClass