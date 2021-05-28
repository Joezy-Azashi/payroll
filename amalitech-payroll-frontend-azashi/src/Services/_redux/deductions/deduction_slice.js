import {createSlice} from "@reduxjs/toolkit";
import * as deductions from './index'

const deductionsSlice = createSlice({
    name: 'DeductionsSlice',
    initialState: {
        data: [], 
        loaded: false,
        status: null,
        message: null,
        preloader: true,
        alertType: 'success',
        error: null,

        request: {
            preloader: false,
            status: null,
            message: null,
        },

        successMessage: {
            message: null,
            openAlert: false,
            alertType: 'success',
        },
    },

    reducers: {
        handleStateAlert:(state, action) => {
            state.alertType = action.payload.alertType
            state.message = action.payload.message
            state.openAlert = action.payload.openAlert
        },
        hanldeSuccesState:(state, action) =>{
            state.successAlertType = action.payload.alertType
            state.successMessage = action.payload.message
            state. successOpenAlert = action.payload.openAlert
        },
        handleSuccessStateDed:(state, action) =>{
            state.successMessage.alertType = action.payload.alertType
            state.successMessage.message = action.payload.message
            state. successMessage.openAlert = action.payload.openAlert
        },
        handlePreloader:(state,action)=>{
            state.preloader = action.payload.preloader
        },
        handleStatusUpdate:(state,action)=>{
            console.log('status...', action.payload)
            state.request.status = action.payload.data
        }
    },
    extraReducers: {
        // handle deductions fetch request
        [deductions.fetchDeductionsWithThunk.pending] : (state => {
            state.preloader = true
            state.status = "Loading..."
            state.loaded = false
            state.message = null
        }),
        [deductions.fetchDeductionsWithThunk.fulfilled] : ((state, action) => {
            state.data = action.payload.data
            state.preloader = false
            state.loaded = true
            state.status = "Loaded successfully."
            state.message = null
        }),
        [deductions.fetchDeductionsWithThunk.rejected] : ((state, action) => {
            state.data = []
            state.loaded = false
            state.preloader = false
            state.status = "Failed"
            state.error = action
            
        }),

        //handle add deductions request
        [deductions.addDeductionsWithThunk.pending] : (state => {
            state.request.preloader = true
            state.request.status = "Loading..."
        }),
        [deductions.addDeductionsWithThunk.fulfilled] : ((state, {payload}) => {
            state.request.preloader = false
            state.request.status = "Success"
            state.error = null
            state.successMessage.message = "Deductions Added Successfully"
            state.successMessage.openAlert = true
            state.successMessage.alertType = 'success'
        }),
        [deductions.addDeductionsWithThunk.rejected] : ((state, action) => {
            state.request.status = "Failed"
            state.request.preloader = false
            state.error = action
            state.status = "Failed"
        }),
    }
})

export const deductionsReducer = ({deductions}) => deductions
export const {handleStateAlert, handlePreloader, handleStatusUpdate, hanldeSuccesState, handleSuccessStateDed} = deductionsSlice.actions
export default deductionsSlice.reducer