import apiInstance from '../.././api';
import * as endpoint from '../endpoints'
import * as actions from './actions'

import {createAsyncThunk} from '@reduxjs/toolkit'
/**
 * initialize axios api
 */
const api = apiInstance();

/**
 * fetch bonuses data using redux thunk.
 */
export const fetchBonusesWithThunk = createAsyncThunk(actions.GET_BONUSES,async ({page = 0},{rejectWithValue}) =>{
    try{
        return await api.get(endpoint.fetchBonusesEndpoint.concat(`/?&page=${page}`))
    } catch (error) {
        return rejectWithValue(error)
    }
})

/**
 * add bonuses using redux thunk.
 */
export const addBonusesWithThunk = createAsyncThunk(actions.ADD_BONUS,async (data) =>{
    return api.post(endpoint.addBonusesEndpoint, data)
})

/**
 * fetch bonuses data using redux thunk.
 */
export const fetchAllowancesWithThunk = createAsyncThunk(actions.GET_ALLOWANCES,async ({page = 0}) =>{
    return api.get(endpoint.fetchAllowancesEndpoint.concat(`/?&page=${page}`))
})

/**
 * add bonuses using redux thunk.
 */
export const addAllowancesWithThunk = createAsyncThunk(actions.ADD_ALLOWANCES,async (data) =>{
    return api.post(endpoint.addAllowancesEndpoint, data)
})