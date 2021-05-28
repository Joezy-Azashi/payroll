import { createSlice } from "@reduxjs/toolkit";
import * as dep from './index'

/**
 * create a slice for status/data monitoring from the department api endpoint.
 */
export const departmentSlice = createSlice({
    name:"DepartmentSlice",
    initialState: {
        data : [],
        loaded: false,
        status:null,
        errorMessage: null
    },
    extraReducers: {
        [dep.fetchDepartmentsWithThunk.pending] : (state => {
            state.status = "Loading..."
            state.loaded = false;
            state.errorMessage = null;
        }),
        [dep.fetchDepartmentsWithThunk.fulfilled] : ((state,{payload})=>{
            state.data  = payload;
            state.status = "Loaded succesfully."
            state.loaded = true;
            state.errorMessage = null;
        }),

        [dep.fetchDepartmentsWithThunk.rejected]:(state,action)=>{
            state.loaded = false;
            state.status = "Failed..";
            state.errorMessage = `${action.error.message}`
        },
    }
});

/** export department reducer placeholder */
export const departmentReducer = ({depReducer}) => depReducer;

/**export default reducer of department data from department slice. */
export default departmentSlice.reducer;