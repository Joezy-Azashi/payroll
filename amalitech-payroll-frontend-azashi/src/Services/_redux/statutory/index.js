import apiInstance from '../.././api'
import * as endpoint from '../endpoints'
import * as actions from './actions'

import {createAsyncThunk} from '@reduxjs/toolkit'

/**
 * initialize axios api
 */
 const api = apiInstance();

//  fetch statutory tax using redux thunk
export const fetchTaxWithThunk = createAsyncThunk(actions.GET_TAX, async() => {
    return api.get(endpoint.fetchTaxEndpoints)
})

// add statutory tax using redux thunk
export const addTaxWiththunk = createAsyncThunk(actions.ADD_TAX, async(data) => {
    return api.post(endpoint.addTaxEndpoints, data)
})

// edit statutory tax using redux thunk
export const editTaxWthThunk = createAsyncThunk(actions.EDIT_TAX, async(data) => {
    return api.patch(endpoint.editTaxEndpoints, data)
})

// delete statutory tax using redux thunk
export const deleteTaxWithThunk = createAsyncThunk(actions.DELETE_TAX, async(data) => {
    return api.delete(endpoint.deleteTaxEndpoints, data)
})

//  fetch statutory ssnit using redux thunk
export const fetchSsnitWithThunk = createAsyncThunk(actions.GET_SSNIT, async() => {
    return api.get(endpoint.fetchSsnitEndpoints)
})

// add statutory ssnit using redux thunk
export const addSsnitWithThunk = createAsyncThunk(actions.ADD_SSNIT, async(data) => {
    return api.post(endpoint.addSsnitEndpoints, data)
})

// edit statutory ssnit using redux thunk
export const editSsnitWithThunk = createAsyncThunk(actions.EDIT_SSNIT, async(data) => {
    return api.patch(endpoint.editSsnitEndpoints, data)
})

// delete statutory ssnit using redux thunk
export const deleteSsnitWithThunk = createAsyncThunk(actions.DELETE_SSNIT, async(data) => {
    return api.delete(endpoint.deleteSsnitEndpoints, data)
})
