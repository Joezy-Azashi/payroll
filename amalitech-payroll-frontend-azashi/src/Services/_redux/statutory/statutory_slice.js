import { createSlice } from "@reduxjs/toolkit";
import * as statutory from './index'

const statutorySlice = createSlice({
    name: 'StatutorySlice',
    initialState: {
        tax: {
            data: [],
            loaded: false,
            status: null,
            message: null,
            preloader: false,
            openAlert: false,
            alertType: 'success',
            error: null,
        },
        ssnit: {
            data: [],
            loaded: false,
            status: null,
            message: null,
            preloader: false,
            openAlert: false,
            alertType: 'success',
            error: null,
        },
        request: {
            preloader: false,
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
        // handle tax fetch request
        [statutory.fetchTaxWithThunk.pending] : (state => {
            state.tax.preloader = true
            state.tax.status = "Loading..."
            state.tax.loaded = false
            state.tax.message = null
        }),
        [statutory.fetchTaxWithThunk.fulfilled] : ((state, {payload}) => {
            state.tax.data = payload.data
            state.tax.preloader = false
            state.tax.status = "Loaded successfully."
            state.tax.loaded = true
            state.tax.message = null

        }),
        [statutory.fetchTaxWithThunk.rejected] : (state, action) => {
            state.tax.data = {}
            state.tax.preloader = false
            state.tax.status = "Failed"
            state.tax.error = action
            state.tax.loaded = false
        },

         // handle ssnit fetch request
         [statutory.fetchSsnitWithThunk.pending] : (state => {
            state.ssnit.preloader = true
            state.ssnit.status = "Loading..."
            state.ssnit.loaded = false
            state.ssnit.message = null
        }),
        [statutory.fetchSsnitWithThunk.fulfilled] : ((state, {payload}) => {
            state.ssnit.data = payload.data
            state.ssnit.preloader = false
            state.ssnit.status = "Loaded successfully."
            state.ssnit.loaded = true
            state.ssnit.message = null

        }),
        [statutory.fetchSsnitWithThunk.rejected] : (state, action) => {
            state.ssnit.data = []
            state.ssnit.preloader = false
            state.ssnit.status = "Failed"
            state.ssnit.error = action
            state.ssnit.loaded = false
        },

        // handle add tax request
        [statutory.addTaxWiththunk.pending] : (state => {
            state.request.preloader = true
            state.request.status = "Loading..."
        }),
        [statutory.addTaxWiththunk.fulfilled] : ((state, {payload}) => {
            state.request.status = "Success"
            state.request.preloader = false
            state.tax.error = null
            state.succuessMessage.message = "Tax Added Successfully"
            state.succuessMessage.alertType = 'success'
            state.succuessMessage.openAlert = true
        }),
        [statutory.addTaxWiththunk.rejected] : (state, action) => {
            state.request.preloader = false
            state.request.status = "Failed"
            state.tax.error = action
        },

        // handle add ssnit request
        [statutory.addSsnitWithThunk.pending] : (state => {
            state.request.preloader = true
            state.request.status = "Loading..."
        }),
        [statutory.addSsnitWithThunk.fulfilled] : ((state, {payload}) => {
            state.request.status = "Success"
            state.request.preloader = false
            state.ssnit.error = null
            state.succuessMessage.message = "Tax Added Successfully"
            state.succuessMessage.alertType = 'success'
            state.succuessMessage.openAlert = true
        }),
        [statutory.addSsnitWithThunk.rejected] : (state, action) => {
            state.request.preloader = false
            state.request.status = "Failed"
            state.ssnit.error = action
        },

        // handle edit tax request
        [statutory.editTaxWthThunk.pending] : (state => {
            state.request.preloader = true
            state.request.state = "Loading..."
        }),
        [statutory.editTaxWthThunk.fulfilled] : ((state, {payload}) => {
            state.request.preloader = false
            state.request.state = "Success"
            state.ssnit.error = null
            state.succuessMessage.message = "Tax Edited Successfully"
            state.succuessMessage.alertType = 'success'
            state.succuessMessage.openAlert = true

        }),
        [statutory.editTaxWthThunk.rejected] : (state, action)=> {
            state.request.status = "Failed"
            state.request.preloader = false
            state.ssnit.error = action
        },

        // handle edit tax request
        [statutory.editSsnitWithThunk.pending] : (state => {
        state.request.preloader = true
        state.request.state = "Loading..."
        }),
        [statutory.editSsnitWithThunk.fulfilled] : ((state, {payload}) => {
            state.request.preloader = false
            state.request.state = "Success"
            state.ssnit.error = null
            state.succuessMessage.message = "SSNIT Edited Successfully"
            state.succuessMessage.alertType = 'success'
            state.succuessMessage.openAlert = true

        }),
        [statutory.editSsnitWithThunk.rejected] : (state, action)=> {
            state.request.status = "Failed"
            state.request.preloader = false
            state.error = action
        },

        // handle delete tax request
        [statutory.deleteTaxWithThunk.pending] : (state => {
            state.request.preloader = true
            state.request.status = "Loading..."
        }),
        [statutory.deleteTaxWithThunk.fulfilled] : ((state, {payload}) => {
            state.request.status = "Success"
            state.request.preloader = false
            state.tax.error = null
            state.succuessMessage.message = "Tax Deleted Successfully"
            state.succuessMessage.alertType = 'success'
            state.succuessMessage.openAlert = true
        }),
        [statutory.deleteTaxWithThunk.rejected] : (state, action) => {
            state.request.preloader = false
            state.request.status = "Failed"
            state.tax.error = action
        },

        // handle delete ssnit request
        [statutory.deleteSsnitWithThunk.pending] : (state => {
            state.request.preloader = true
            state.request.status = "Loading..."
        }),
        [statutory.deleteSsnitWithThunk.fulfilled] : ((state, {payload}) => {
            state.request.status = "Success"
            state.request.preloader = false
            state.ssnit.error = null
            state.succuessMessage.message = "Tax Deleted Successfully"
            state.succuessMessage.alertType = 'success'
            state.succuessMessage.openAlert = true
        }),
        [statutory.deleteSsnitWithThunk.rejected] : (state, action) => {
            state.request.preloader = false
            state.request.status = "Failed"
            state.ssnit.error = action
        }

    }

})

export const statutoryReducer = ({statutory}) => statutory
export const { handleStateAlert, handlePreloader, handleStatusUpdate, hanldeSuccesState } = statutorySlice.actions
export default statutorySlice.reducer