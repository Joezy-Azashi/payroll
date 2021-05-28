import { createSlice } from "@reduxjs/toolkit";
import * as payrollStatus from './index'

const payrollStatusSlice =createSlice({
    name: 'PayrollStatusSlice',
    initialState: {
        data : {},
        loaded: false,
        status:null,
        errorMessage: null,
    },
    reducers: {},
    extraReducers: {
        [payrollStatus.fetchPayrollStatusWithThunk.pending] : (state => {
            state.status = "Loading..."
            state.loaded = false;
            state.errorMessage = null;
        }),
        [payrollStatus.fetchPayrollStatusWithThunk.fulfilled] : ((state,{payload})=>{
            state.data  = payload.data;
            state.status = "Loaded successfully."
            state.loaded = true;
            state.isError = true;
            state.errorMessage = null;
        }),

        [payrollStatus.fetchPayrollStatusWithThunk.rejected]:(state,action)=>{
            state.loaded = false;
            state.isError = true;
            state.data  = {};
            state.status = "Failed";
            state.errorCode = action
        },
    }
})

export const payrollCurrentStatus = ({payrollStatus}) => payrollStatus
export default payrollStatusSlice.reducer