import apiInstance from '../.././api'
import * as endpoint from '../endpoints'
import * as actions from './actions'
import {createAsyncThunk} from '@reduxjs/toolkit'

const api = apiInstance();

//post email for forgot password
export const emailPostWithThunk = createAsyncThunk(actions.EMAIL_POST, async( data) => {
    return api.post(endpoint.forgottenPassword, data)
})