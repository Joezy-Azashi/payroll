import React, { Component } from 'react'
import "../../../index.css";
import moment from "moment";
import Api from "../../../Services/api";

class JournalVoucherReport extends Component {

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
        const date = this.props.vDate.yearMonth
        return moment(date, 'YYYY-MM').format('MMMM, YYYY')
    }

    // FETCHING OF SUMMATIONS
    async getTotalData() {
        const [totalSum, totalSsnit, totalTierTwo, pensionPercentage] = await Promise.all([
            Api().get('/sum/payroll-columns'),
            Api().get('/sum/tier1'),
            Api().get('/sum/tier2'),
            Api().get('/pensions/')
        ])
                this.setState({
                    setTotals: totalSum.data,
                    setTotalSsnit: totalSsnit.data,
                    setTierTwo: totalTierTwo.data,
                    setPension: pensionPercentage.data
                })

    }

    // METHOD TO GET THE EMPLOYER SSF
    getPercentage(){
        const items = this.state.setPension
        let tierOnePercentage = 0
        let tierTwoPercentage = 0
        let addPercentage = 0
        let calculatePercentage = 0
        const filterLabel = items.map((item) => {
            if (item.label === 'Employer SSF Rate'){
                addPercentage = item.percentage
            }
            calculatePercentage = (addPercentage / 100)

            if(item.label === 'Tier 1 Rate'){
                tierOnePercentage = item.percentage
            }

            if(item.label === 'Tier 2 Rate'){
                tierTwoPercentage = item.percentage
            }
            
        })
        this.setState({
            percentageCalculated: calculatePercentage,
            setTierOnePercentage: tierOnePercentage,
            setTierTwoPercentage: tierTwoPercentage
        })
    }
    
    render() {
        return (
            <div className={"jounalVouch"}>
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
                                <div className="col-2 bRight py-2"> {this.props.salaryJV.data.grossSalary} </div>
                                <div className="col-2 py-2">  </div>
                            </div>

                            {/* INCOME TAX (PAYE) */}
                            <div className="row mx-0">
                                <div align="left"  className="col-4 bRight py-2">Income Tax (PAYE)</div>
                                <div className="col-4 bRight py-2">  </div>
                                <div className="col-2 bRight py-2">  </div>
                                <div className="col-2 py-2"> {this.props.salaryJV.data.incomeTax} </div>
                            </div>

                            {/* SOCIAL SECURITY TIER ONE (SSNIT) */}
                            <div className="row mx-0">
                                <div align="left"  className="col-4 bRight py-2"> Social Security ({this.state.setTierOnePercentage}%) SSNIT </div>
                                <div className="col-4 bRight py-2">  </div>
                                <div className="col-2 bRight py-2">  </div>
                                <div className="col-2 py-2"> {this.props.salaryJV.data.socialSecurity} </div>
                            </div>

                            {/* SOCIAL SECURITY TIER TWO*/}
                            <div className="row mx-0">
                                <div align="left"  className="col-4 bRight py-2"> Social Security Fund ({this.state.setTierTwoPercentage}%)  AXIS </div>
                                <div className="col-4 bRight py-2">  </div>
                                <div className="col-2 bRight py-2">  </div>
                                <div className="col-2 py-2"> {this.props.salaryJV.data.socialSecurityFund} </div>
                            </div>

                            {/* LOAN DEDUCTION */}
                            <div className="row mx-0">
                                <div align="left"  className="col-4 bRight py-2"> Various Staff Accounts - Loan Deduction </div>
                                <div className="col-4 bRight py-2">  </div>
                                <div className="col-2 bRight py-2">  </div>
                                <div className="col-2 py-2"> {this.props.salaryJV.data.loanDeduction} </div>
                            </div>

                            {/* PAYROLL CONTROL */}
                            <div className="row mx-0">
                                <div align="left"  className="col-4 bRight py-2"> Payroll Control </div>
                                <div className="col-4 bRight py-2">  </div>
                                <div className="col-2 bRight py-2">  </div>
                                <div className="col-2 py-2"> {this.props.salaryJV.data.netSalary} </div>
                            </div>

                            {/* OVERALL TOTAL */}
                            <div className="row mx-0">
                                <div align="left"  className="col-4 bRight py-2"> <strong>TOTAL</strong> </div>
                                <div className="col-4 bRight py-2">  </div>
                                <div className="col-2 bRight py-2"><strong> {this.props.salaryJV.data.grossSalary} </strong> </div>
                                <div className="col-2 py-2 primary">
                                    <strong>
                                        {this.props.salaryJV.data.creditTotals}
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

export default JournalVoucherReport;
