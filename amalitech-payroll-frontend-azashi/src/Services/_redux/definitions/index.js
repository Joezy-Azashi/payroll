import apiInstance from '../.././api'
import * as endpoint from '../endpoints'
import * as actions from './actions'

import {createAsyncThunk} from '@reduxjs/toolkit'

/**
 * initialize axios api
 */
 const api = apiInstance();

// fetch definitons tags data using redux thunk.
export const fetchDefinitionsWithThunk = createAsyncThunk(actions.GET_DEFINITIONS, async() => {
    return await (await api.get(endpoint.fetchDefinitionsEndpoint))
})

// add definitions tags data using redux thunk
export const addDefinitionsWithThunk = createAsyncThunk(actions.ADD_DEFINITIONS, async(data) => {
    return api.post(endpoint.addDefinitionsEndpoint, data)
})

// edit definitions tag data using redux thunk
export const editDefinitionsWithThunk = createAsyncThunk(actions.EDIT_DEFINITIONS, async(data) => {
    return api.patch(endpoint.editDefinitionsEndpoint, data)
})

// delete definitions tag using redux thunk
export const deleteDefinitionsWithThunk = createAsyncThunk(actions.DELETE_DEFINITIONS, async(data) => {
    return api.delete(endpoint.deleteDefinitionsEndpoints, data)
})