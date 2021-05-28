import { createSlice } from "@reduxjs/toolkit";
import * as additions from './index'

const additionsSlice =createSlice({
    name: 'AdditionSlice',
    initialState: {
        bonus: {
            data : {},
            loaded: false,
            status:null,
            message: null,
            preloader: true,
            openAlert: false,
            alertType: 'success',
            error: null
        },
        allowance: {
            data : {},
            loaded: false,
            status:null,
            message: null,
            preloader: true,
            openAlert: false,
            alertType: 'success',
            error: null
        },
        request: {
            preloader: false,
            ssss: false,
            status: null
        },   
        succuessMessage: {
            message: null,
            openAlert: false,
            alertType: 'success',
        }
    },
    reducers: {
        handleStateAlert:(state,action)=>{
            state[action.payload.type].alertType = action.payload.alertType
            state[action.payload.type].message = action.payload.message
            state[action.payload.type].openAlert = action.payload.openAlert
        },
        handlePreloader:(state,action)=>{
            state[action.payload.type].preloader = action.payload.preloader
        },
        handleStatusUpdate:(state,action)=>{
            console.log('status...', action.payload)
            state.request.status = action.payload.data
        },
        hanldeSuccesState:(state, action) =>{
            state.succuessMessage.alertType = action.payload.alertType
            state.succuessMessage.message = action.payload.message
            state.succuessMessage.openAlert = action.payload.openAlert
        }
    },
    extraReducers: {
        /*handle bonus fetch request*/
        [additions.fetchBonusesWithThunk.pending] : (state => {
            state.bonus.preloader = true
            state.bonus.status = "Loading..."
            state.bonus.loaded = false;
            state.bonus.message = null;
        }),
        [additions.fetchBonusesWithThunk.fulfilled] : ((state,{payload})=>{
            state.bonus.data  = payload.data;
            state.bonus.preloader = false
            state.bonus.status = "Loaded successfully."
            state.bonus.loaded = true;
            state.bonus.isError = true;
            state.bonus.message = null;
        }),
        [additions.fetchBonusesWithThunk.rejected]:(state, {action})=>{
            state.bonus.preloader = false
            state.bonus.loaded = false;
            state.bonus.data  = {};
            state.bonus.error = action
            state.bonus.status = "Failed";
        },

        /*handle bonus add request*/
        [additions.addBonusesWithThunk.pending] : (state => {
            state.request.status = "Loading..."
            state.request.preloader = true
        }),
        [additions.addBonusesWithThunk.fulfilled] : ((state,{payload})=>{
            state.request.status = "Success"
            state.request.preloader = false
            state.bonus.error = null
            state.succuessMessage.message = "Bonus Added Successfully"
            state.succuessMessage.alertType = 'success'
            state.succuessMessage.openAlert = true
        }),
        [additions.addBonusesWithThunk.rejected]:(state,action)=>{
            state.request.status = "Failed"
            state.request.preloader = false
            state.bonus.error = action
            state.allowance.state = "Failed"
            console.log("action", action)
        },

        /*handle allowance fetch request*/
        [additions.fetchAllowancesWithThunk.pending] : (state => {
            state.allowance.preloader = true
            state.allowance.status = "Loading..."
            state.allowance.loaded = false;
            state.allowance.message = null;
        }),
        [additions.fetchAllowancesWithThunk.fulfilled] : ((state,{payload})=>{
            state.allowance.data  = payload.data;
            state.allowance.preloader = false
            state.allowance.status = "Loaded successfully."
            state.allowance.loaded = true;
            state.allowance.isError = true;
            state.allowance.message = null;
        }),
        [additions.fetchAllowancesWithThunk.rejected]:(state,action)=>{
            state.allowance.loaded = false;
            state.allowance.isError = true;
            state.allowance.data  = {};
            state.allowance.status = "Failed";
            state.allowance.errorCode = action
        },

        /*handle allowance add request*/
        [additions.addAllowancesWithThunk.pending] : (state => {
            state.request.status = "Loading..."
            state.request.preloader = true
        }),
        [additions.addAllowancesWithThunk.fulfilled] : ((state,{payload})=>{
            state.allowance.status = "Success."
            state.request.preloader = false
            state.allowance.error = null
            state.succuessMessage.message = "Allowance Added Successfully"
            state.succuessMessage.alertType = 'success'
            state.succuessMessage.openAlert = true
        }),
        [additions.addAllowancesWithThunk.rejected]:(state,action)=>{
            state.allowance.data  = {};
            state.allowance.status = "Failed";
            state.allowance.error = action
            state.allowance.state = "Failed"
        },
    }
})

export const additionsReducer = ({additions}) => additions
export const { handleStateAlert, handlePreloader, handleStatusUpdate, hanldeSuccesState } = additionsSlice.actions
export default additionsSlice.reducer