import { createSlice } from "@reduxjs/toolkit";
import * as payroll from './index'

/**
 * create a slice for status/data monitoring from the employees api endpoint.
 */
export const payrollReportSlice = createSlice({
    name:"PayrollReportSlice",
    initialState: {
        monthlyPayroll:
            {
                data: {},
                loaded: false,
                status: null,
                message: null,
                openAlert: false,
                alertType: "success",
                statusCode: 200,
                preloader: true,

            },

        individualPayrolls:
            {
                data: {},
                loaded: false,
                status: null,
                message: null,
                openAlert: false,
                alertType: "success",
                statusCode: 200,
                preloader: false,

            },
        tierOne:
            {
                data: {},
                loaded: false,
                status: null,
                message: null,
                openAlert: false,
                alertType: "success",
                statusCode: 200,
                preloader: true,

            },
        tierTwo:
            {
                data: {},
                loaded: false,
                status: null,
                message: null,
                openAlert: false,
                alertType: "success",
                statusCode: 200,
                preloader: true,

            },
        gra:
            {
                data: {},
                loaded: false,
                status: null,
                message: null,
                openAlert: false,
                alertType: "success",
                statusCode: 200,
                preloader: true,

            },
        bankAdvice:
            {
                data: {},
                loaded: false,
                status: null,
                message: null,
                openAlert: false,
                alertType: "success",
                statusCode: 200,
                error: {},
                preloader: true,

            },

        salaryJV:
            {
                data: {},
                loaded: false,
                status: null,
                message: null,
                openAlert: false,
                alertType: "success",
                statusCode: 200,
                preloader: true,

            },
        exportData:
            {
                data: [],
                loaded: false,
                status: null,
                message: null,
                openAlert: false,
                alertType: "success",
                statusCode: 200,
                preloader: true,

            },
        payrollTotals:
            {
                data: {},
                loaded: false,
                status: null,
                message: null,
                openAlert: false,
                alertType: "success",
                statusCode: 200,
                preloader: true,

            },
    },
    reducers:{
        handleStateAlert:(state,action)=>{
            state[action.payload.type].alertType = action.payload.alertType
            state[action.payload.type].message = action.payload.message
            state[action.payload.type].openAlert = action.payload.openAlert
        },
        handleStatePreloader:(state,action)=>{
            state[action.payload.type].preloader = action.payload.preloader
        },
    },
    extraReducers: {
        //monthly payroll report start
        [payroll.fetchMonthlyPayrollReportWithThunk.pending] : (state => {
            state.monthlyPayroll.status = "Loading..."
            state.monthlyPayroll.loaded = false;
            state.monthlyPayroll.preloader = true;
            state.monthlyPayroll.message = null;
        }),
        [payroll.fetchMonthlyPayrollReportWithThunk.fulfilled] : ((state,{payload})=>{
            state.monthlyPayroll.data  = payload.data;
            state.monthlyPayroll.status = "Loaded successfully."
            state.monthlyPayroll.loaded = true;
            state.monthlyPayroll.message = null;
            state.monthlyPayroll.preloader = false;
        }),
        [payroll.fetchMonthlyPayrollReportWithThunk.rejected]:((state,action)=>{
            state.monthlyPayroll.data  = {};
            state.monthlyPayroll.loaded = false;
            state.monthlyPayroll.status = "Failed";
            state.monthlyPayroll.message = ''
            state.monthlyPayroll.statusCode = action
            state.monthlyPayroll.preloader = false;
        }),
        //monthly payroll report ends

        //individual payroll report start
        [payroll.fetchIndividualPayrollsReportWithThunk.pending] : (state => {
            state.individualPayrolls.status = "Loading..."
            state.individualPayrolls.loaded = false;
            state.individualPayrolls.preloader = true;
            state.individualPayrolls.message = null;
        }),
        [payroll.fetchIndividualPayrollsReportWithThunk.fulfilled] : ((state,{payload})=>{
            state.individualPayrolls.data  = payload.data;
            state.individualPayrolls.status = "Loaded successfully."
            state.individualPayrolls.loaded = true;
            state.individualPayrolls.message = null;
            state.individualPayrolls.preloader = false;
            console.log('fulfilled')
        }),
        [payroll.fetchIndividualPayrollsReportWithThunk.rejected]:((state, {action})=>{
            state.individualPayrolls.data  = {};
            state.individualPayrolls.loaded = false;
            state.individualPayrolls.status = "Failed";
            state.individualPayrolls.message = ''
            // state.individualPayrolls.statusCode = action
            state.individualPayrolls.error = action
            state.individualPayrolls.preloader = false;
            console.log('in redux', action)
        }),
        //individual payroll report ends

        //tier one payroll report start
        [payroll.fetchTierOneReportWithThunk.pending] : (state => {
            state.tierOne.status = "Loading..."
            state.tierOne.loaded = false;
            state.tierOne.preloader = true;
            state.tierOne.message = null;
        }),
        [payroll.fetchTierOneReportWithThunk.fulfilled] : ((state,{payload})=>{
            state.tierOne.data  = payload.data;
            state.tierOne.status = "Loaded successfully."
            state.tierOne.loaded = true;
            state.tierOne.message = null;
            state.tierOne.preloader = false;
        }),
        [payroll.fetchTierOneReportWithThunk.rejected]:((state,action)=>{
            state.tierOne.data  = {};
            state.tierOne.loaded = false;
            state.tierOne.status = "Failed";
            state.tierOne.message = ''
            state.tierOne.statusCode = action
            state.tierOne.preloader = false;
        }),
        //tier one payroll report ends

        //tier two payroll report start
        [payroll.fetchTierTwoReportWithThunk.pending] : (state => {
            state.tierTwo.status = "Loading..."
            state.tierTwo.loaded = false;
            state.tierTwo.preloader = true;
            state.tierTwo.message = null;
        }),
        [payroll.fetchTierTwoReportWithThunk.fulfilled] : ((state,{payload})=>{
            state.tierTwo.data  = payload.data;
            state.tierTwo.status = "Loaded successfully."
            state.tierTwo.loaded = true;
            state.tierTwo.message = null;
            state.tierTwo.preloader = false;
        }),
        [payroll.fetchTierTwoReportWithThunk.rejected]:((state, {action})=>{
            state.tierTwo.data  = {};
            state.tierTwo.loaded = false;
            state.tierTwo.status = "Failed";
            state.tierTwo.message = ''
            state.tierTwo.statusCode = action
            state.tierTwo.preloader = false;
        }),
        //tier two payroll report ends

        //gra payroll report start
        [payroll.fetchGraReportWithThunk.pending] : (state => {
            state.gra.status = "Loading..."
            state.gra.loaded = false;
            state.gra.preloader = true;
            state.gra.message = null;
        }),
        [payroll.fetchGraReportWithThunk.fulfilled] : ((state,{payload})=>{
            state.gra.data  = payload.data;
            state.gra.status = "Loaded successfully."
            state.gra.loaded = true;
            state.gra.message = null;
            state.gra.preloader = false;
        }),
        [payroll.fetchGraReportWithThunk.rejected]:((state,action)=>{
            state.gra.data  = [];
            state.gra.loaded = false;
            state.gra.status = "Failed";
            state.gra.message = ''
            state.gra.statusCode = action
            state.gra.preloader = false;
        }),
        //gra payroll report ends

        //bank advice payroll report start
        [payroll.fetchBankAdviceReportWithThunk.pending] : (state => {
            state.bankAdvice.status = "Loading..."
            state.bankAdvice.loaded = false;
            state.bankAdvice.preloader = true;
            state.bankAdvice.message = null;
        }),
        [payroll.fetchBankAdviceReportWithThunk.fulfilled] : ((state,{payload})=>{
            state.bankAdvice.data  = payload.data;
            state.bankAdvice.status = "Loaded successfully."
            state.bankAdvice.loaded = true;
            state.bankAdvice.message = null;
            state.bankAdvice.preloader = false;
        }),
        [payroll.fetchBankAdviceReportWithThunk.rejected]:((state,action)=>{
            state.bankAdvice.data  = [];
            state.bankAdvice.loaded = false;
            state.bankAdvice.status = "Failed";
            state.bankAdvice.message = ''
            state.bankAdvice.statusCode = action
            state.bankAdvice.preloader = false;
        }),
        //bank advice payroll report ends

        //salary journal voucher payroll report start
        [payroll.fetchSalaryJVReportWithThunk.pending] : (state => {
            state.salaryJV.status = "Loading..."
            state.salaryJV.loaded = false;
            state.salaryJV.preloader = true;
            state.salaryJV.message = null;
        }),
        [payroll.fetchSalaryJVReportWithThunk.fulfilled] : ((state,{payload})=>{
            state.salaryJV.data  = payload.data;
            state.salaryJV.status = "Loaded successfully."
            state.salaryJV.loaded = true;
            state.salaryJV.message = null;
            state.salaryJV.preloader = false;
            console.log('totals success')
        }),
        [payroll.fetchSalaryJVReportWithThunk.rejected]:((state,action)=>{
            state.salaryJV.data  = {};
            state.salaryJV.loaded = false;
            state.salaryJV.status = "Failed";
            state.salaryJV.message = ''
            state.salaryJV.statusCode = action
            state.salaryJV.preloader = false;
        }),
        //salary journal voucher payroll report ends

        //report for export start
        [payroll.fetchMonthlyPayrollReportUnsortedWithThunk.pending] : (state => {
            state.exportData.status = "Loading..."
            state.exportData.loaded = false;
            state.exportData.preloader = true;
            state.exportData.message = null;
        }),
        [payroll.fetchMonthlyPayrollReportUnsortedWithThunk.fulfilled] : ((state,{payload})=>{
            state.exportData.data  = payload.data;
            state.exportData.status = "Loaded successfully."
            state.exportData.loaded = true;
            state.exportData.message = null;
            state.exportData.preloader = false;
            console.log('totals success')
        }),
        [payroll.fetchMonthlyPayrollReportUnsortedWithThunk.rejected]:((state,action)=>{
            state.exportData.data  = [];
            state.exportData.loaded = false;
            state.exportData.status = "Failed";
            state.exportData.message = ''
            state.exportData.statusCode = action
            state.exportData.preloader = false;
        }),
        //report for export ends

        //report for totals start
        [payroll.fetchMonthlyReportTotalsWithThunk.pending] : (state => {
            state.reportTotals.status = "Loading..."
            state.reportTotals.loaded = false;
            state.reportTotals.preloader = true;
            state.reportTotals.message = null;
        }),
        [payroll.fetchMonthlyReportTotalsWithThunk.fulfilled] : ((state,{payload})=>{
            state.reportTotals.data  = payload.data;
            state.reportTotals.status = "Loaded successfully."
            state.reportTotals.loaded = true;
            state.reportTotals.message = null;
            state.reportTotals.preloader = false;
            console.log('totals success')
        }),
        [payroll.fetchMonthlyReportTotalsWithThunk.rejected]:((state,action)=>{
            state.reportTotals.data  = {};
            state.reportTotals.loaded = false;
            state.reportTotals.status = "Failed";
            state.reportTotals.message = ''
            state.reportTotals.statusCode = action
            state.reportTotals.preloader = false;
        }),
        //report for totals ends

    }
});

/** export employee reducer placeholder */
export const payrollReportReducer = ({payrollsReportReducer}) => payrollsReportReducer;

export const { handleStateAlert, handleStatePreloader } = payrollReportSlice.actions

/**export default reducer of employees data from employee slice. */
export default payrollReportSlice.reducer;