import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import employeesReducer  from '../_redux/employees/employee-slice'
import payrollStatus from '../_redux/payrollStatus/payroll_slice'
import additions from '../_redux/additions/addition_slice'
import definitions from '../_redux/definitions/definition_slice'
import statutory from '../_redux/statutory/statutory_slice'
import deductions from '../_redux/deductions/deduction_slice'
import payrollsReducer from '../_redux/payroll/payroll-slice'
import totals from '../_redux/totals/totals_slice'
import forgotPassword from '../_redux/forgot-password/forgot_slice'
import resetPassword from '../_redux/set-new-password/setNewPassword_slice'
import payrollsReportTotalsReducer from '../_redux/reportTotals/payroll-report-totals-slice'
import payrollsReportReducer from '../_redux/payrollReport/payroll-report-slice'
import changePassword from '../_redux/ChangePassword/changePassword_slice'
import user from '../_redux/Users/users_slice'

const store = configureStore({
    reducer: {
        employeesReducer,
        payrollStatus,
        additions,
        definitions,
        statutory,
        deductions,
        payrollsReducer,
        totals,
        forgotPassword,
        resetPassword,
        payrollsReportTotalsReducer,
        payrollsReportReducer,
        changePassword,
        user
    },
    middleware: getDefaultMiddleware({
        serializableCheck:false
    })
})

export default store;