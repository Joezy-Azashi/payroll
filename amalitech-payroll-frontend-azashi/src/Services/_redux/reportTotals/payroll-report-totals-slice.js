import { createSlice } from "@reduxjs/toolkit";
import * as payroll from './index'

/**
 * create a slice for status/data monitoring from the employees api endpoint.
 */
export const payrollReportTotalsSlice = createSlice({
    name:"PayrollReportTotalsSlice",
    initialState: {
        monthlyPayroll:
            {
                data: [],
                loaded: false,
                status: null,
                message: null,
                openAlert: false,
                alertType: "success",
                statusCode: 200,
                preloader: false,

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
                preloader: false,

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
                preloader: false,

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
                preloader: false,

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
                preloader: false,

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
                preloader: false,

            },
    },
    reducers:{
        handleStateAlert:(state,action)=>{
            state[action.payload.type].alertType = action.payload.alertType
            state[action.payload.type].message = action.payload.message
            state[action.payload.type].openAlert = action.payload.openAlert
        },
        handleStatePreloader:(state,action)=>{
            state[action.payload.type].alertType = action.payload.preloader
        },
    },
    extraReducers: {
        //monthly payroll report start
        [payroll.fetchMonthlyPayrollReportTotalsWithThunk.pending] : (state => {
            state.monthlyPayroll.status = "Loading..."
            state.monthlyPayroll.loaded = false;
            state.monthlyPayroll.preloader = true;
            state.monthlyPayroll.message = null;
        }),
        [payroll.fetchMonthlyPayrollReportTotalsWithThunk.fulfilled] : ((state,{payload})=>{
            state.monthlyPayroll.data  = payload.data;
            state.monthlyPayroll.status = "Loaded successfully."
            state.monthlyPayroll.loaded = true;
            state.monthlyPayroll.message = null;
            state.monthlyPayroll.preloader = false;
            console.log('data success')
        }),
        [payroll.fetchMonthlyPayrollReportTotalsWithThunk.rejected]:((state,action)=>{
            state.monthlyPayroll.data  = [];
            state.monthlyPayroll.loaded = false;
            state.monthlyPayroll.status = "Failed";
            state.monthlyPayroll.message = ''
            state.monthlyPayroll.statusCode = action
            state.monthlyPayroll.preloader = false;
        }),
        //monthly payroll report ends

        //individual payroll report start
        [payroll.fetchIndividualPayrollsReportTotalsWithThunk.pending] : (state => {
            state.individualPayrolls.status = "Loading..."
            state.individualPayrolls.loaded = false;
            state.individualPayrolls.preloader = true;
            state.individualPayrolls.message = null;
        }),
        [payroll.fetchIndividualPayrollsReportTotalsWithThunk.fulfilled] : ((state,{payload})=>{
            state.individualPayrolls.data  = payload.data;
            state.individualPayrolls.status = "Loaded successfully."
            state.individualPayrolls.loaded = true;
            state.individualPayrolls.message = null;
            state.individualPayrolls.preloader = false;
            console.log('totals success')
        }),
        [payroll.fetchIndividualPayrollsReportTotalsWithThunk.rejected]:((state,action)=>{
            state.individualPayrolls.data  = [];
            state.individualPayrolls.loaded = false;
            state.individualPayrolls.status = "Failed";
            state.individualPayrolls.message = ''
            state.individualPayrolls.statusCode = action
            state.individualPayrolls.preloader = false;
        }),
        //individual payroll report ends

        //tier one payroll report start
        [payroll.fetchTierOneReportTotalsWithThunk.pending] : (state => {
            state.tierOne.status = "Loading..."
            state.tierOne.loaded = false;
            state.tierOne.preloader = true;
            state.tierOne.message = null;
        }),
        [payroll.fetchTierOneReportTotalsWithThunk.fulfilled] : ((state,{payload})=>{
            state.tierOne.data  = payload.data;
            state.tierOne.status = "Loaded successfully."
            state.tierOne.loaded = true;
            state.tierOne.message = null;
            state.tierOne.preloader = false;
        }),
        [payroll.fetchTierOneReportTotalsWithThunk.rejected]:((state,action)=>{
            state.tierOne.data  = [];
            state.tierOne.loaded = false;
            state.tierOne.status = "Failed";
            state.tierOne.message = ''
            state.tierOne.statusCode = action
            state.tierOne.preloader = false;
        }),
        //tier one payroll report ends

        //tier two payroll report start
        [payroll.fetchTierTwoReportTotalsWithThunk.pending] : (state => {
            state.individualPayrolls.status = "Loading..."
            state.individualPayrolls.loaded = false;
            state.individualPayrolls.preloader = true;
            state.individualPayrolls.message = null;
            console.log('fetching totals...')
        }),
        [payroll.fetchTierTwoReportTotalsWithThunk.fulfilled] : ((state,{payload})=>{
            state.individualPayrolls.data  = payload.data;
            state.individualPayrolls.status = "Loaded successfully."
            state.individualPayrolls.loaded = true;
            state.individualPayrolls.message = null;
            state.individualPayrolls.preloader = false;
            console.log('totals success')
        }),
        [payroll.fetchTierTwoReportTotalsWithThunk.rejected]:((state,action)=>{
            state.individualPayrolls.data  = [];
            state.individualPayrolls.loaded = false;
            state.individualPayrolls.status = "Failed";
            state.individualPayrolls.message = ''
            state.individualPayrolls.statusCode = action
            state.individualPayrolls.preloader = false;
        }),
        //tier two payroll report ends

        //gra payroll report start
        [payroll.fetchGraReportTotalsWithThunk.pending] : (state => {
            state.gra.status = "Loading..."
            state.gra.loaded = false;
            state.gra.preloader = true;
            state.gra.message = null;
        }),
        [payroll.fetchGraReportTotalsWithThunk.fulfilled] : ((state,{payload})=>{
            state.gra.data  = payload.data;
            state.gra.status = "Loaded successfully."
            state.gra.loaded = true;
            state.gra.message = null;
            state.gra.preloader = false;
        }),
        [payroll.fetchGraReportTotalsWithThunk.rejected]:((state,action)=>{
            state.gra.data  = [];
            state.gra.loaded = false;
            state.gra.status = "Failed";
            state.gra.message = ''
            state.gra.statusCode = action
            state.gra.preloader = false;
        }),
        //gra payroll report ends

        //bank advice payroll report start
        [payroll.fetchBankAdviceReportTotalsWithThunk.pending] : (state => {
            state.bankAdvice.status = "Loading..."
            state.bankAdvice.loaded = false;
            state.bankAdvice.preloader = true;
            state.bankAdvice.message = null;
        }),
        [payroll.fetchBankAdviceReportTotalsWithThunk.fulfilled] : ((state,{payload})=>{
            state.bankAdvice.data  = payload.data;
            state.bankAdvice.status = "Loaded successfully."
            state.bankAdvice.loaded = true;
            state.bankAdvice.message = null;
            state.bankAdvice.preloader = false;
        }),
        [payroll.fetchBankAdviceReportTotalsWithThunk.rejected]:((state,action)=>{
            state.bankAdvice.data  = [];
            state.bankAdvice.loaded = false;
            state.bankAdvice.status = "Failed";
            state.bankAdvice.message = ''
            state.bankAdvice.statusCode = action
            state.bankAdvice.preloader = false;
        }),
        //bank advice payroll report ends

        //salary journal voucher payroll report start
        [payroll.fetchSalaryJVReportTotalsWithThunk.pending] : (state => {
            state.salaryJV.status = "Loading..."
            state.salaryJV.loaded = false;
            state.salaryJV.preloader = true;
            state.salaryJV.message = null;
        }),
        [payroll.fetchSalaryJVReportTotalsWithThunk.fulfilled] : ((state,{payload})=>{
            state.salaryJV.data  = payload.data;
            state.salaryJV.status = "Loaded successfully."
            state.salaryJV.loaded = true;
            state.salaryJV.message = null;
            state.salaryJV.preloader = false;
            console.log('totals success')
        }),
        [payroll.fetchSalaryJVReportTotalsWithThunk.rejected]:((state,action)=>{
            state.salaryJV.data  = [];
            state.salaryJV.loaded = false;
            state.salaryJV.status = "Failed";
            state.salaryJV.message = ''
            state.salaryJV.statusCode = action
            state.salaryJV.preloader = false;
        }),
        //salary journal voucher payroll report ends


    }
});

/** export employee reducer placeholder */
export const payrollReportTotalsReducer = ({payrollsReportTotalsReducer}) => payrollsReportTotalsReducer;

/**export default reducer of employees data from employee slice. */
export default payrollReportTotalsSlice.reducer;