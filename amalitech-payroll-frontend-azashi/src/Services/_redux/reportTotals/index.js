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
export const fetchMonthlyPayrollReportTotalsWithThunk = createAsyncThunk(actions.GET_MONTHLY_PAYROLL_REPORT_TOTALS,async ({page, data}) =>{
    return api.post(endpoint.employeePayrollReportEndpoint.concat(`/?&${page}`), data)
})

/*fetch sorted payroll report*/
export const fetchIndividualPayrollsReportTotalsWithThunk = createAsyncThunk(actions.GET_INDIVIDUAL_PAYROLL_REPORT_TOTALS,async ({page, data}) =>{
    return api.post(endpoint.monthlyPayrollReportEndpoint.concat(`/?&page=${page}`), data)
})
/*fetch sorted payroll report*/
export const fetchTierOneReportTotalsWithThunk = createAsyncThunk(actions.GET_TIER_ONE_PAYROLL_REPORT_TOTALS,async ({page, data}) =>{
    return api.post(endpoint.monthlyPayrollReportEndpoint.concat(`/?&page=${page}`), data)
})
/*fetch sorted payroll report*/
export const fetchTierTwoReportTotalsWithThunk = createAsyncThunk(actions.GET_TIER_TWO_PAYROLL_REPORT_TOTALS,async ({page, data}) =>{
    return api.post(endpoint.monthlyPayrollReportEndpoint.concat(`/?&page=${page}`), data)
})
/*fetch sorted payroll report*/
export const fetchGraReportTotalsWithThunk = createAsyncThunk(actions.GET_GRA_PAYROLL_REPORT_TOTALS,async ({page, data}) =>{
    return api.post(endpoint.monthlyPayrollReportEndpoint.concat(`/?&page=${page}`), data)
})
/*fetch sorted payroll report*/
export const fetchBankAdviceReportTotalsWithThunk = createAsyncThunk(actions.GET_BANK_ADVICE_PAYROLL_REPORT_TOTALS,async ({page, data}) =>{
    return api.post(endpoint.monthlyPayrollReportEndpoint.concat(`/?&page=${page}`), data)
})
/*fetch sorted payroll report*/
export const fetchSalaryJVReportTotalsWithThunk = createAsyncThunk(actions.GET_SALARY_JV_PAYROLL_REPORT_TOTALS,async ({page, data}) =>{
    return api.post(endpoint.monthlyPayrollReportEndpoint.concat(`/?&page=${page}`), data)
})




