import apiInstance from '../.././api';
import * as endpoint from '../endpoints'
import * as actions from './actions'
import {createAsyncThunk} from '@reduxjs/toolkit'
/**
 * initialize axios api 
 */
const api = apiInstance();

/**
 * async action to fetch all positions data using api endpoint.
 */
const getPosition = async () =>{
  return await api.get(endpoint.allPositionsEndpoint);
}


/**
 * fetch position data using redux thunk.
 */
export const fetchPositionsWithThunk = createAsyncThunk(actions.GET_POSITIONS,async () =>{
    const result =  await getPosition()
    return result.data;
})




