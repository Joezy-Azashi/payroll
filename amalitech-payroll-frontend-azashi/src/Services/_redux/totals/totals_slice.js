import { createSlice } from "@reduxjs/toolkit";
import * as totals from './index'

const totalsSlice = createSlice({
    name: 'TotalsSlice',
    initialState: {
        tier1Totals: {
            data: {},
            loaded: false,
            status: null,
            message: null,
            preloader: false,
            openAlert: false,
            alertType: 'success',
            error: null,
        },
        tier2Totals: {
            data: {},
            loaded: false,
            status: null,
            message: null,
            preloader: false,
            openAlert: false,
            alertType: 'success',
            error: null,
        },
        bonus: {
            data: {},
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
        successMessage: {
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
        // handle tier1Totals fetch request
        [totals.fetchTier1TotalsWithThunk.pending] : (state => {
            state.tier1Totals.preloader = true
            state.tier1Totals.status = "Loading..."
            state.tier1Totals.loaded = false
            state.tier1Totals.message = null
        }),
        [totals.fetchTier1TotalsWithThunk.fulfilled] : ((state, {payload}) => {
            state.tier1Totals.data = payload.data
            state.tier1Totals.preloader = false
            state.tier1Totals.status = "Loaded successfully."
            state.tier1Totals.loaded = true
            state.tier1Totals.message = null

        }),
        [totals.fetchTier1TotalsWithThunk.rejected] : (state, action) => {
            state.tier1Totals.data = {}
            state.tier1Totals.preloader = false
            state.tier1Totals.status = "Failed"
            state.tier1Totals.error = action
            state.tier1Totals.loaded = false
        },

        // handle tier2Totals fetch request
        [totals.fetchTier2TotalsWithThunk.pending] : (state => {
            state.tier2Totals.preloader = true
            state.tier2Totals.status = "Loading..."
            state.tier2Totals.loaded = false
            state.tier2Totals.message = null
        }),
        [totals.fetchTier2TotalsWithThunk.fulfilled] : ((state, {payload}) => {
            state.tier2Totals.data = payload.data
            state.tier2Totals.preloader = false
            state.tier2Totals.status = "Loaded successfully."
            state.tier2Totals.loaded = true
            state.tier2Totals.message = null

        }),
        [totals.fetchTier2TotalsWithThunk.rejected] : (state, action) => {
            state.tier2Totals.data = {}
            state.tier2Totals.preloader = false
            state.tier2Totals.status = "Failed"
            state.tier2Totals.error = action
            state.tier2Totals.loaded = false
        },

        // handle Bonus Totals fetch request
        [totals.fetchBonusTotalsWithThunk.pending] : (state => {
            state.bonus.preloader = true
            state.bonus.status = "Loading..."
            state.bonus.loaded = false
            state.bonus.message = null
        }),
        [totals.fetchBonusTotalsWithThunk.fulfilled] : ((state, {payload}) => {
            state.bonus.data = payload.data
            state.bonus.preloader = false
            state.bonus.status = "Loaded successfully."
            state.bonus.loaded = true
            state.bonus.message = null

        }),
        [totals.fetchBonusTotalsWithThunk.rejected] : (state, action) => {
            state.bonus.data = {}
            state.bonus.preloader = false
            state.bonus.status = "Failed"
            state.bonus.error = action
            state.bonus.loaded = false
        },
    }

})

export const totalsReducer = ({totals}) => totals
export const { handleStateAlert, handlePreloader, handleStatusUpdate, hanldeSuccesState } = totalsSlice.actions
export default totalsSlice.reducer