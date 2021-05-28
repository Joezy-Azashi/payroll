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
export const fetchMonthlyPayrollReportWithThunk = createAsyncThunk(actions.GET_MONTHLY_PAYROLL_REPORT,async ({page, data}) =>{
    return api.post(endpoint.monthlyPayrollReportEndpoint.concat(`/?&page=${page}`), data)
})

/*fetch sorted payroll report*/
export const fetchIndividualPayrollsReportWithThunk = createAsyncThunk(actions.GET_INDIVIDUAL_PAYROLL_REPORT,async (data = {}, {rejectWithValue}) =>{
    console.log('in redux', data.data)
    return await api.post(endpoint.employeePayrollReportEndpoint, data.data)
})
/*fetch sorted payroll report*/
export const fetchTierOneReportWithThunk = createAsyncThunk(actions.GET_TIER_ONE_PAYROLL_REPORT,async ({page, data}) =>{
    return api.post(endpoint.monthlyPayrollReportEndpoint.concat(`/?&page=${page}`), data)
})
/*fetch sorted payroll report*/
export const fetchTierTwoReportWithThunk = createAsyncThunk(actions.GET_TIER_TWO_PAYROLL_REPORT,async ({page, data}) =>{
    return api.post(endpoint.monthlyPayrollReportEndpoint.concat(`/?&page=${page}`), data)
})
/*fetch sorted payroll report*/
export const fetchGraReportWithThunk = createAsyncThunk(actions.GET_GRA_PAYROLL_REPORT,async ({page, data}) =>{
    return api.post(endpoint.monthlyPayrollReportEndpoint.concat(`/?&page=${page}`), data)
})
/*fetch sorted payroll report*/
export const fetchBankAdviceReportWithThunk = createAsyncThunk(actions.GET_BANK_ADVICE_PAYROLL_REPORT,async ({page, data}) =>{
    return api.post(endpoint.monthlyPayrollReportEndpoint.concat(`/?&page=${page}`), data)
})
/*fetch sorted jv report*/
export const fetchSalaryJVReportWithThunk = createAsyncThunk(actions.GET_SALARY_JV_PAYROLL_REPORT,async ({page, data}) =>{
    return api.post(endpoint.jvReportEndpoint, data)
})

/*fetch sorted payroll report*/
export const fetchMonthlyPayrollReportUnsortedWithThunk = createAsyncThunk(actions.GET_MONTHLY_PAYROLL_REPORT_UNSORTED,async (data = {}) =>{
    return api.post(endpoint.monthlyPayrollReportUnsortedEndpoint, data)
})

/*fetch report totals*/
export const fetchMonthlyReportTotalsWithThunk = createAsyncThunk(actions.GET_MONTHLY_REPORT_TOTALS,async (data = {}) =>{
    return api.post(endpoint.monthlyColumnsTotalsEndpoint, data)
})





