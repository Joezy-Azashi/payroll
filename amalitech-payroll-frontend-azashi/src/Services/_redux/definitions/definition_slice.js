import { createSlice } from "@reduxjs/toolkit";
import * as definitions from './index'

const definitionsSlice = createSlice({
    name: 'DefinitionsSlice',
    initialState: {
        data: [],
        loaded: false,
        status: null,
        message: null,
        preloader: false,
        openAlert: false,
        alertType: 'success',
        error: null,
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
        handleStateAlert:(state, action) => {
            state.alertType = action.payload.alertType
            state.message = action.payload.message
            state.openAlert = action.payload.openAlert
        },
        hanldeSuccesState:(state, action) =>{
            state.succuessMessage.alertType = action.payload.alertType
            state.succuessMessage.message = action.payload.message
            state.succuessMessage.openAlert = action.payload.openAlert
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
        // handle definitions tags fetch request
        [definitions.fetchDefinitionsWithThunk.pending] : (state => {
            state.preloader = true
            state.status = "Loading..."
            state.loaded = false
            state.message = null
        }),
        [definitions.fetchDefinitionsWithThunk.fulfilled] : ((state, action) => {
            state.data = action.payload.data
            state.preloader = false
            state.loaded = true
            state.status = "Loaded successfully."
            state.message = null
        }),
        [definitions.fetchDefinitionsWithThunk.rejected] : (state, action) => {
            state.data = []
            state.loaded = false
            state.preloader = false
            state.status = "Failed"
            state.error = action
            
        },

        // handle add definitions tags request
        [definitions.addDefinitionsWithThunk.pending] : (state => {
            state.request.preloader = true
            state.request.status = "Loading..."
        }),
        [definitions.addDefinitionsWithThunk.fulfilled] : ((state, {payload}) => {
            state.request.preloader = false
            state.request.status = "Success"
            state.error = null
            state.succuessMessage.message = "Definition Added Successfully"
            state.succuessMessage.alertType = 'success'
            state.succuessMessage.openAlert = true
        }),
        [definitions.addDefinitionsWithThunk.rejected] : (state, action) => {
            state.request.status = "Failed"
            state.request.preloader = false
            state.error = action
            state.status = "Failed"

        },

        // handle edit definitions tag request
        [definitions.editDefinitionsWithThunk.pending] : (state => {
            state.request.preloader = true
            state.request.status = "Loading..."
        }),
        [definitions.editDefinitionsWithThunk.fulfilled] : ((state, {payload}) => {
            state.request.preloader = false
            state.request.status = "Success"
            state.error = null
            state.succuessMessage.message = "Definition Edited Successfully"
            state.succuessMessage.alertType = 'success'
            state.succuessMessage.openAlert = true
        }),
        [definitions.editDefinitionsWithThunk.rejected] : (state, action) => {
            state.request.status = "Failed"
            state.request.preloader = false
            state.error = action
            state.status = "Failed"
        },

        // handle delete definition tag request
        [definitions.deleteDefinitionsWithThunk.pending] : (state => {
            state.request.preloader = true
            state.request.status = "Loading..."
        }),
        [definitions.deleteDefinitionsWithThunk.fulfilled] : ((state, {payload}) => {
            state.request.preloader = false
            state.request.status = "Success"
            state.error = null
            state.succuessMessage.message = "Definition Deleted Successfully"
            state.succuessMessage.alertType = 'success'
            state.succuessMessage.openAlert = true
        }),
        [definitions.deleteDefinitionsWithThunk.rejected] : (state, action) => {
            state.request.preloader = false
            state.error = action
            state.request.status = "Failed"
        }
    }

})

export const definitionsReducer = ({definitions}) => definitions
export const { handleStateAlert, handlePreloader, handleStatusUpdate, hanldeSuccesState } = definitionsSlice.actions
export default definitionsSlice.reducer