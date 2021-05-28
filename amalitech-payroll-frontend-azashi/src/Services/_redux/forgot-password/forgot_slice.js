import {createSlice} from "@reduxjs/toolkit";
import * as forgotPassword from './index'

const resetPasswordSlice = createSlice({
    name: "ResetPasswordSlice",
    initialState: {
        data: [],
        status: null,
        message: null,
        preloader: false,
        alertType: 'success',
        error: null,

        request: {
            preloader: false,
            status: null
        },

        successMessage: {
            message: null,
            openAlert: false,
            alertType: 'success'
        },
        errorMessage: {
            message: null,
            openAlert: false,
            alertType: 'error'
        }
    },
    reducers: {
        handleStateAlert:(state, action) => {
            state.alertType = action.payload.alertType
            state.message = action.payload.message
            state.openAlert = action.payload.openAlert
        },
        hanldeSuccesState:(state, action) =>{
            state.successMessage.alertType = action.payload.alertType
            state.successMessage.message = action.payload.message
            state. successMessage.openAlert = action.payload.openAlert
        },
        hanldeErrorState:(state, action) =>{
            state.errorMessage.alertType = action.payload.alertType
            state.errorMessage.message = action.payload.message
            state. errorMessage.openAlert = action.payload.openAlert
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

        //handle email request
        [forgotPassword.emailPostWithThunk.pending] : (state => {
            state.request.preloader = true
            state.request.status = "Loading..."
        }),
        [forgotPassword.emailPostWithThunk.fulfilled] : (state => {
            state.request.preloader = false
            state.request.status = "Success"
            state.error = null
            state.successMessage.message = "Reset link has been sent to your email"
            state.successMessage.alertType = 'success'
            state.successMessage.openAlert = true
        }),
        [forgotPassword.emailPostWithThunk.rejected] : ((state, action) => {
            state.request.status = "Failed"
            state.request.preloader = false
            state.error = action
            state.errorMessage.message = "User does not exist"
            state.errorMessage.openAlert = true
            state.errorMessage.alertType = 'error'
        })
    }
})

export const resetPasswordReducer = ({forgotPassword}) => forgotPassword
export const {handleStateAlert, handlePreloader, handleStatusUpdate, hanldeSuccesState, hanldeErrorState} = resetPasswordSlice.actions
export default resetPasswordSlice.reducer