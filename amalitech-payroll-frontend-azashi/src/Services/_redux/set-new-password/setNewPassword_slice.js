import {createSlice} from "@reduxjs/toolkit";
import * as resetPassword from './index'

const setNewPasswordSlice = createSlice({
    name: "SetNewPasswordSlice",
    initialState: {
        data: [],
        status: null,
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
        }
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
        handlePreloader:(state,action)=>{
            state.preloader = action.payload.preloader
        },
        handleStatusUpdate:(state,action)=>{
            console.log('status...', action.payload)
            state.request.status = action.payload.data
        }
    },
    extraReducers: {

        //handle set new password request
        [resetPassword.setNewPasswordWithThunk.pending] : (state => {
            state.request.preloader = true
            state.request.status = "Loading..."
        }),
        [resetPassword.setNewPasswordWithThunk.fulfilled] : (state => {
            state.request.preloader = false
            state.request.status = "Success"
            state.error = null
            state.successMessage.message = "Reset Password successfull"
            state.successMessage.alertType = 'success'
            state.successMessage.openAlert = true
        }),
        [resetPassword.setNewPasswordWithThunk.rejected] : ((state, action) => {
            state.request.status = "Failed"
            state.request.preloader = false
            state.error = action
        })
    }
})

export const setNewPasswordReducer = ({resetPassword}) => resetPassword
export const {handleStateAlert, handlePreloader, handleStatusUpdate, hanldeSuccesState} = setNewPasswordSlice.actions
export default setNewPasswordSlice.reducer