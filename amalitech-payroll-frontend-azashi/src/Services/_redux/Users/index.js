import apiInstance from '../.././api'
import * as endpoint from '../endpoints'
import * as actions from './actions'

import {createAsyncThunk} from '@reduxjs/toolkit'

const api = apiInstance();

//fetch all users using redux thunk
export const fetchAllUsersWithThunk = createAsyncThunk(actions.GET_USER, async() => {
    return api.get(endpoint.getAllUsers)
})

//add users using redux thunk
export const addUsersWithThunk = createAsyncThunk(actions.ADD_USER, async(data) => {
    return api.post(endpoint.registerUser, data)
})

//activate/deactivate users using redux thunk
export const userStatusWithThunk = createAsyncThunk(actions.USER_STATUS, async(data) => {
    return api.patch(endpoint.userStatus, data)
})

//edit user using redux thunk
export const editUserWithThunk = createAsyncThunk(actions.UPDATE_USER, async(data) => {
    return api.post(endpoint.updateUser, data)
})

//delete user using redux thunk
export const deleteUserWithThunk = createAsyncThunk(actions.DELETE_USER, async(data) => {
    return api.delete(endpoint.deleteUser, {data:data})
})