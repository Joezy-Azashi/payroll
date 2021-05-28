import apiInstance from '../.././api';
import * as endpoint from '../endpoints'
import * as actions from './actions'
import {createAsyncThunk} from '@reduxjs/toolkit'
/**
 * initialize axios api 
 */
const api = apiInstance();

/**
 * async action to fetch all departments data using api endpoint.
 */
const getDepartments = async () =>{
  return await api.get(endpoint.allDepartmentsEndpoint);
}


/**
 * fetch departments data using redux thunk.
 */
export const fetchDepartmentsWithThunk = createAsyncThunk(actions.GET_DEPARTMENTS,async () =>{
    const result =  await getDepartments()
    return result.data;
})




