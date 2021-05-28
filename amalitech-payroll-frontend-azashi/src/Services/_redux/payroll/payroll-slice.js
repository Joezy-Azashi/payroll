import { createSlice } from "@reduxjs/toolkit";
import * as payroll from './index'

/**
 * create a slice for status/data monitoring from the employees api endpoint.
 */
export const payrollSlice = createSlice({
    name:"EmployeeSlice",
    initialState: {
        payroll:
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

        bonus:
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
            state[action.payload.type].alertType = action.payload.preloader
        },
    },
    extraReducers: {
        [payroll.fetchCurrentPayrollWithThunk.pending] : (state => {
            state.payroll.status = "Loading..."
            state.payroll.loaded = false;
            state.payroll.preloader = true;
            state.payroll.message = null;
        }),
        [payroll.fetchCurrentPayrollWithThunk.fulfilled] : ((state,{payload})=>{
            state.payroll.data  = payload.data;
            state.payroll.status = "Loaded successfully."
            state.payroll.loaded = true;
            state.payroll.message = null;
            state.payroll.preloader = false;
        }),
        [payroll.fetchCurrentPayrollWithThunk.rejected]:((state,action)=>{
            state.payroll.data  = {};
            state.payroll.loaded = false;
            state.payroll.status = "Failed";
            state.payroll.message = ''
            state.payroll.statusCode = action
            state.payroll.preloader = false;
        }),

        /*totals*/
        [payroll.fetchCurrentPayrollTotalsWithThunk.pending] : (state => {
            state.payrollTotals.status = "Loading..."
            state.payrollTotals.loaded = false;
            state.payrollTotals.preloader = true;
            state.payrollTotals.message = null;
        }),
        [payroll.fetchCurrentPayrollTotalsWithThunk.fulfilled] : ((state,{payload})=>{
            state.payrollTotals.data  = payload.data;
            state.payrollTotals.status = "Loaded successfully."
            state.payrollTotals.loaded = true;
            state.payrollTotals.message = null;
            state.payrollTotals.preloader = false;
        }),
        [payroll.fetchCurrentPayrollTotalsWithThunk.rejected]:((state,action)=>{
            state.payrollTotals.data  = {};
            state.payrollTotals.loaded = false;
            state.payrollTotals.status = "Failed";
            state.payrollTotals.message = ''
            state.payrollTotals.statusCode = action
            state.payrollTotals.preloader = false;
        }),

        /*payroll bonus*/
        [payroll.fetchCurrentPayrollBonusWithThunk.pending] : (state => {
            state.bonus.status = "Loading..."
            state.bonus.loaded = false;
            state.bonus.preloader = true;
            state.bonus.message = null;
        }),
        [payroll.fetchCurrentPayrollBonusWithThunk.fulfilled] : ((state,{payload})=>{
            state.bonus.data  = payload.data;
            state.bonus.status = "Loaded successfully."
            state.bonus.loaded = true;
            state.bonus.message = null;
            state.bonus.preloader = false;
        }),
        [payroll.fetchCurrentPayrollBonusWithThunk.rejected]:((state,action)=>{
            state.bonus.data  = {};
            state.bonus.loaded = false;
            state.bonus.status = "Failed";
            state.bonus.message = ''
            state.bonus.statusCode = action
            state.bonus.preloader = false;
        }),

    }
});

/** export employee reducer placeholder */
export const payrollReducer = ({payrollsReducer}) => payrollsReducer;

/**export default reducer of employees data from employee slice. */
export default payrollSlice.reducer;