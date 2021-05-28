import apiInstance from '../.././api';
import * as endpoint from '../endpoints'
import * as actions from '../employees/actions'
import {createAsyncThunk} from '@reduxjs/toolkit'
/**
 * initialize axios api 
 */
const api = apiInstance();


/**
 * fetch employees data using redux thunk.
 */
export const fetchEmployeesWithThunk = createAsyncThunk(actions.GET_EMPLOYEES,async ({page = 0}) =>{
    return api.get(endpoint.allEmployeesEndpoint.concat(`/?&page=${page}`))
})

/**
 * fetch sorted employees data using redux thunk.
 */
export const fetchEmployeesWithSort = createAsyncThunk(actions.GET_SORTED_EMPLOYEES,async ({page = 0, data}) =>{
    return await api.post(endpoint.sortedEmployeesEndpoint.concat(`/?&page=${page}`), data);
})

export const fetchEmployeesWithoutSort = createAsyncThunk(actions.GET_UNSORTED_EMPLOYEES,async () =>{
    return await api.get(endpoint.unsortedEmployeesEndpoint);
})




