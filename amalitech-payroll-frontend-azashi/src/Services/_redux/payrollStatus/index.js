import apiInstance from '../.././api';
import * as endpoint from '../endpoints'
import * as actions from './actions'

import {createAsyncThunk} from '@reduxjs/toolkit'
/**
 * initialize axios api
 */
const api = apiInstance();

/**
 * fetch employees payroll status data using redux thunk.
 */
export const fetchPayrollStatusWithThunk = createAsyncThunk(actions.GET_PAYROLL_STATUS,async () =>{
    return api.get(endpoint.fetchPayrollStatusEndpoint)
})