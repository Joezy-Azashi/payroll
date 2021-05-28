import {createSlice} from "@reduxjs/toolkit";
import * as user from './index'

const userSlice = createSlice({
    name: 'UserSlice',
    initialState: {
        data: [],
        loaded: false,
        status: null,
        preloader: false,
        alertType: 'success',
        error: null,
        message: null,

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
            state.successMessage.openAlert = action.payload.openAlert
            state.successMessage.AlertType = action.payload.alertType
            state.successMessage.message = action.payload.message
        
        },
        handlePreloader:(state,action)=>{
            state.preloader = action.payload.preloader
        },
        handleStatusUpdate:(state,action)=>{
            state.request.status = action.payload.data
        }
    },
    extraReducers: {

        //handle fetch user request
        [user.fetchAllUsersWithThunk.pending] : (state => {
            state.preloader = true
            state.status = "Loading..."
            state.loaded = false
            state.message = null
        }),
        [user.fetchAllUsersWithThunk.fulfilled] : ((state, {payload} )=> {
            state.data = payload.data
            state.preloader = false
            state.status = "Success"
            state.error = null
            state.message = "Data loaded successfully"
        }),
        [user.fetchAllUsersWithThunk.rejected] : ((state, action) => {
            state.status = "Failed"
            state.preloader = false
            state.error = action
        }),

        //handle add new user request
        [user.addUsersWithThunk.pending] : (state => {
            state.request.preloader = true
            state.request.status = "Loading..."
        }),
        [user.addUsersWithThunk.fulfilled] : (state => {
            state.request.preloader = false
            state.request.status = "Success"
            state.error = null
            state.successMessage.message = 'User Added Successfully'
            state.successMessage.alertType = 'success'
            state.successMessage.openAlert = true
        }),
        [user.addUsersWithThunk.rejected] : ((state, action) => {
            state.request.status = "Failed"
            state.request.preloader = false
            state.error = action
            state.status = 'Failed'
            console.log("action", action)
        }),

            //handle edit new user request
            [user.editUserWithThunk.pending] : (state => {
                state.request.preloader = true
                state.request.status = "Loading..."
            }),
            [user.editUserWithThunk.fulfilled] : (state => {
                state.request.preloader = false
                state.request.status = "Success"
                state.error = null
                state.successMessage.message = 'User Data Edited Successfully'
                state.successMessage.alertType = 'success'
                state.successMessage.openAlert = true
            }),
            [user.editUserWithThunk.rejected] : ((state, action) => {
                state.request.status = "Failed"
                state.request.preloader = false
                state.error = action
                state.status = "Failed"
            }),

        //handle delete user request
        [user.deleteUserWithThunk.pending] : (state => {
            state.request.preloader = true
            state.request.status = "Loading..."
        }),
        [user.deleteUserWithThunk.fulfilled] : (state => {
            state.request.preloader = false
            state.request.status = "Success"
            state.error = null
            state.successMessage.message = "User Deleted Successfully"
            state.successMessage.alertType = 'success'
            state.successMessage.openAlert = true
        }),
        [user.deleteUserWithThunk.rejected] : ((state, action) => {
            state.request.status = "Failed"
            state.request.preloader = false
            state.error = action
            state.status = "Failed"
        }),

        //handle activate/deactivate user request
        [user.userStatusWithThunk.pending] : (state => {
            state.request.status = "Loading..."
        }),
        [user.userStatusWithThunk.fulfilled] : (state => {
            state.request.status = "Success"
            state.error = null
            state.successMessage.message = "User Status Changed Successfully"
            state.successMessage.alertType = 'success'
            state.successMessage.openAlert = true
        }),
        [user.userStatusWithThunk.rejected] : ((state, action) => {
            state.request.status = "Failed"
            state.request.preloader = false
            state.error = action
            state.status = "Failed"
            console.log("#######", action)
        }),
    }
})

export const userReducer = ({user}) => user
export const { handleStateAlert, hanldeSuccesState, handlePreloader, handleStatusUpdate} = userSlice.actions
export default userSlice.reducer