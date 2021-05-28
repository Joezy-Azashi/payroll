import apiInstance from '../.././api'
import * as endpoint from '../endpoints'
import * as actions from './actions'
import {createAsyncThunk} from '@reduxjs/toolkit'

const api = apiInstance();

//set new password
export const setNewPasswordWithThunk = createAsyncThunk(actions.SET_NEWPASSWORD, async( data) => {
    return api.patch(endpoint.setNewPassword, data)
})