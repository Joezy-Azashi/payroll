import React, { Component } from 'react'
import "../../../index.css";
import moment from "moment";
import Api from "../../../Services/api";
import {logoutUser} from "../../../Services/auth";

class JournalVoucher extends Component {

    constructor(props) {
        super(props)

        this.state = {
            setTotals: {},
            setTotalSsnit: {},
            setTierTwo: {},
            setPension: {},
            percentageCalculated: 0,
            setTierOnePercentage: 0,
            setTierTwoPercentage: 0
        }

        this.getDate = this.getDate.bind(this)
        this.getTotalData = this.getTotalData.bind(this)
        this.getPercentage = this.getPercentage.bind(this)
    }

    async componentDidMount(){
        await this.getTotalData()
        this.getPercentage()
    }

    getDate(){
        const date = new Date()
        return moment(date).format('MMMM, YYYY')
    }

    // FETCHING OF SUMMATIONS
    async getTotalData() {
        Api().get('/sum/report/jv').then((response) => {
            this.setState({
                setTotals: response.data
            })
        }).catch((error) => {
            if (error?.response?.status === 416) {
                logoutUser()
                window.location.reload()
            }
        })

    }

    // METHOD TO GET THE EMPLOYER SSF
    getPercentage(){
        let tierOnePercentage = 0
        let tierTwoPercentage = 0
        Api().get('/pensions/').then((response) => {
            response.data.map((item) => {
                if(item.label === 'Tier 1 Rate'){
                    tierOnePercentage = item.percentage
                }

                if(item.label === 'Tier 2 Rate'){
                    tierTwoPercentage = item.percentage
                }

            })
            this.setState({
                setTierOnePercentage: tierOnePercentage,
                setTierTwoPercentage: tierTwoPercentage
            })
        }).catch((error) => {
            if(error.response?.status === 416){
                logoutUser()
            }
        })

    }
   
    render() {
        return (
            <div style={{size: 'landscape'}}>
                <div className="bg-white py-5 mt-3">
                    <h3> Journal Voucher </h3>
                    <div align="right" className="mr-5">
                        <h6 style={{marginRight: '2%'}}> Date </h6>
                        <lable> {this.getDate()} </lable>
                    </div>
                    <div align="left" className="ml-5 mt-4">
                        <h5> Regular Payroll </h5>
                    </div>

                    {/* TABLE */}
                    <div className="table-responsive-sm">
                        <div className="voucherTable table-responsive-sm">
                            <div className="row bBottom mx-0">
                                <div className="col-4 bRight py-2">Item</div>
                                <div className="col-4 bRight py-2">Description</div>
                                <div className="col-2 bRight py-2">Debit</div>
                                <div className="col-2 py-2">Credit</div>
                            </div>

                            {/* GROSS SALARY */}
                            <div className="row mx-0">
                                <div align="left" className="col-4 bRight py-2">Gross Salary</div>
                                <div className="col-4 bRight py-2">  </div>
                                <div className="col-2 bRight py-2"> {this.state.setTotals?.grossSalary?.toFixed(2)} </div>
                                <div className="col-2 py-2">  </div>
                            </div>

                            {/* INCOME TAX (PAYE) */}
                            <div className="row mx-0">
                                <div align="left"  className="col-4 bRight py-2">Income Tax (PAYE)</div>
                                <div className="col-4 bRight py-2">  </div>
                                <div className="col-2 bRight py-2">  </div>
                                <div className="col-2 py-2"> {this.state.setTotals?.incomeTax?.toFixed(2)} </div>
                            </div>

                            {/* SOCIAL SECURITY TIER ONE (SSNIT) */}
                            <div className="row mx-0">
                                <div align="left"  className="col-4 bRight py-2"> Social Security ({this.state.setTierOnePercentage}%) SSNIT </div>
                                <div className="col-4 bRight py-2">  </div>
                                <div className="col-2 bRight py-2">  </div>
                                <div className="col-2 py-2"> {this.state.setTotals?.socialSecurity?.toFixed(2)} </div>
                            </div>

                            {/* SOCIAL SECURITY TIER TWO*/}
                            <div className="row mx-0">
                                <div align="left"  className="col-4 bRight py-2"> Social Security Fund ({this.state.setTierTwoPercentage}%)  AXIS </div>
                                <div className="col-4 bRight py-2">  </div>
                                <div className="col-2 bRight py-2">  </div>
                                <div className="col-2 py-2"> {this.state.setTotals?.socialSecurityFund?.toFixed(2)} </div>
                            </div>

                            {/* LOAN DEDUCTION */}
                            <div className="row mx-0">
                                <div align="left"  className="col-4 bRight py-2"> Various Staff Accounts - Loan Deduction </div>
                                <div className="col-4 bRight py-2">  </div>
                                <div className="col-2 bRight py-2">  </div>
                                <div className="col-2 py-2"> {this.state.setTotals?.loanDeduction?.toFixed(2)} </div>
                            </div>

                            {/* PAYROLL CONTROL */}
                            <div className="row mx-0">
                                <div align="left"  className="col-4 bRight py-2"> Payroll Control </div>
                                <div className="col-4 bRight py-2">  </div>
                                <div className="col-2 bRight py-2">  </div>
                                <div className="col-2 py-2"> {this.state.setTotals?.netSalary?.toFixed(2)} </div>
                            </div>

                            {/* OVERALL TOTAL */}
                            <div className="row mx-0">
                                <div align="left"  className="col-4 bRight py-2"> <strong>TOTAL</strong> </div>
                                <div className="col-4 bRight py-2">  </div>
                                <div className="col-2 bRight py-2"><strong> {this.state.setTotals?.grossSalary?.toFixed(2)} </strong> </div>
                                <div className="col-2 py-2 primary">
                                    <strong>
                                        {  this.state.setTotals?.creditTotals?.toFixed(2) }
                                 </strong>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default JournalVoucher;
