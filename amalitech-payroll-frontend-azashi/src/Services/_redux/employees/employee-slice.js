import { createSlice } from "@reduxjs/toolkit";
import * as emps from './index'


/**
 * create a slice for status/data monitoring from the employees api endpoint.
 */
export const employeeSlice = createSlice({
    name:"EmployeeSlice",
    initialState: {
        data : {},
        loaded: false,
        status:null,
        errorMessage: null,
        isError: false,
        errorCode: 200,
        preloader: true,
        unsorted: {
            data : [],
            status: null,
            loaded: false,
            message: null,
            isError: false,
            error: 200,

        }
    },
    reducers:{
        showDialog:(state,action)=>{
            state.status = action.payload.status
        }
    },
    extraReducers: {
        [emps.fetchEmployeesWithThunk.pending] : (state => {
            state.status = "Loading..."
            state.loaded = false;
            state.preloader = true;
            state.errorMessage = null;
        }),
        [emps.fetchEmployeesWithThunk.fulfilled] : ((state,{payload})=>{
            state.data  = payload.data;
            state.status = "Loaded successfully."
            state.loaded = true;
            state.isError = true;
            state.errorMessage = null;
            state.preloader = false;
        }),

        [emps.fetchEmployeesWithThunk.rejected]:(state,action)=>{
            state.loaded = false;
            state.isError = true;
            state.data  = {};
            state.status = "Failed";
            state.errorCode = action
            state.preloader = false;
        },

        [emps.fetchEmployeesWithSort.pending] : (state => {
            state.status = "Loading..."
            state.loaded = false;
            state.errorMessage = null;
        }),

        [emps.fetchEmployeesWithSort.fulfilled] : ((state,{payload})=>{
            state.data  = payload.data;
            state.status = "Loaded successfully."
            state.loaded = true;
            state.isError = true;
            state.errorMessage = null;
        }),

        [emps.fetchEmployeesWithSort.rejected]:(state,action)=>{
            state.loaded = false;
            state.isError = true;
            state.data  = {};
            state.status = "Failed";
            state.errorCode = action
        },


        [emps.fetchEmployeesWithoutSort.pending] : (state => {
            state.unsorted.status = "Loading..."
            state.unsorted.loaded = false;
            state.unsorted.message = null;
        }),

        [emps.fetchEmployeesWithoutSort.fulfilled] : ((state,{payload})=>{
            state.unsorted.data  = payload.data;
            state.unsorted.status = "Loaded successfully."
            state.unsorted.loaded = true;
            state.unsorted.isError = false;
            state.unsorted.message = null;
        }),

        [emps.fetchEmployeesWithoutSort.rejected]:(state,action)=>{
            state.unsorted.loaded = false;
            state.unsorted.isError = true;
            state.unsorted.data  = {};
            state.unsorted.status = "Failed";
            state.unsorted.error = action
        },
    }
});

/** export employee reducer placeholder */
export const employeeReducer = ({employeesReducer}) => employeesReducer;


/**export default reducer of employees data from employee slice. */
export default employeeSlice.reducer;