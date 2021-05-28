import apiInstance from '../.././api'
import * as endpoint from '../endpoints'
import * as actions from './actions'
import {createAsyncThunk} from '@reduxjs/toolkit'

const api = apiInstance();

//set new password
export const ChangePasswordWithThunk = createAsyncThunk(actions.CHANGE_PASSWORD, async( data) => {
    return api.patch(endpoint.changePassword, data)
})