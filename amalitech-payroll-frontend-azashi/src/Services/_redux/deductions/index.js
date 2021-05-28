import apiInstance from '../.././api'
import * as endpoint from '../endpoints'
import * as actions from './actions'
import {createAsyncThunk} from '@reduxjs/toolkit'

const api = apiInstance();

//fetch deduction data using redux thunk
export const fetchDeductionsWithThunk = createAsyncThunk(actions.GET_DEDUCTIONS, async({page = 0}) => {
    return  api.get(endpoint.fetchdeductionEndpoints.concat(`/?&page=${page}`))
})

//add new deduction using redux thunk
export const addDeductionsWithThunk = createAsyncThunk(actions.ADD_DEDUCTIONS, async( data) => {
    return api.post(endpoint.addDeductions, data)
})