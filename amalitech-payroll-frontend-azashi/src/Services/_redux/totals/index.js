import apiInstance from '../.././api'
import * as endpoint from '../endpoints'
import * as actions from './actions'

import {createAsyncThunk} from '@reduxjs/toolkit'

/**
 * initialize axios api
 */
const api = apiInstance();

//  fetch tier one totals using redux thunk
export const fetchTier1TotalsWithThunk = createAsyncThunk(actions.GET_TIER1_TOTALS, async() => {
    return api.get(endpoint.tier1totalsEndpoint)
})

//  fetch tier two totals using redux thunk
export const fetchTier2TotalsWithThunk = createAsyncThunk(actions.GET_TIER2_TOTALS, async() => {
    return api.get(endpoint.tier2totalsEndpoint)
})

//  fetch gra totals using redux thunk
export const fetchBonusTotalsWithThunk = createAsyncThunk(actions.GET_BONUS_TOTALS, async() => {
    return api.get(endpoint.bonusTotalsEndpoint)
})