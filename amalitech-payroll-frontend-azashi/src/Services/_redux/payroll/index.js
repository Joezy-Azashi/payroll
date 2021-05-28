import apiInstance from '../.././api';
import * as endpoint from '../endpoints'
import * as actions from './actions'
import {createAsyncThunk} from '@reduxjs/toolkit'
/**
 * initialize axios api 
 */
const api = apiInstance();

/**
 * fetch payroll data using redux thunk.
 */
export const fetchCurrentPayrollWithThunk = createAsyncThunk(actions.GET_PAYROLL,async ({page = 0}) =>{
    return api.get(endpoint.currentPayrollEndpoint.concat(`/?&page=${page}`))
})

/**
 * ftech payroll bonus data using redux thunk
 * */
export const fetchCurrentPayrollBonusWithThunk = createAsyncThunk(actions.GET_PAYROLL_BONUS,async ({page = 0}) =>{
    return api.get(endpoint.payrollBonusEndpoint.concat(`/?&page=${page}`))
})

/**
 * fetch payroll data using redux thunk.
 */
export const fetchCurrentPayrollTotalsWithThunk = createAsyncThunk(actions.GET_PAYROLL_SUMMATION,async () =>{
    return api.get(endpoint.payrollTotalsEndpoint)
})




