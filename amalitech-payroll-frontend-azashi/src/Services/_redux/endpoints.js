/** employee endpoints */
export const allEmployeesEndpoint = "/employees"


/** sorted employee endpoints */
export const sortedEmployeesEndpoint = "/employees/sort"

/** unsorted employee endpoints */
export const unsortedEmployeesEndpoint = "/employees/unsorted-all"



/*** department endpoints */
export const allDepartmentsEndpoint = "/departments"

/*** position endpoints */
export const allPositionsEndpoint = "/positions"


/*** payroll endpoints */
export const currentPayrollEndpoint = "/payrolls"

/*** payroll totals endpoints */
export const payrollTotalsEndpoint = "/sum/payroll-columns"

/*** generate payroll endpoints */
export const generatePayrollEndpoint = "/payrolls/generate-payroll"

/*** payroll status endpoints */
export const currentPayrollStatusEndpoint = "/payrolls/current-payroll-status"

/*** approve payroll status endpoints */
export const approvePayrollStatusEndpoint = "/payrolls/approve"

/*** payroll status endpoints */
export const authorizePayrollStatusEndpoint = "/payrolls/authorize"

/*** update payroll status endpoints */
export const updatePayrollStatusEndpoint = "/payrolls/authorize"

/*** fetch payroll status endpoints */
export const fetchPayrollStatusEndpoint = "/payrolls/current-payroll-status"

/*** fetch bonuses endpoints */
export const fetchBonusesEndpoint = "/bonuses"

/*** fetch allowances endpoints */
export const fetchAllowancesEndpoint = "/allowances"

/*** add bonuses endpoints */
export const addBonusesEndpoint = "/bonuses/create"

/*** add allowances endpoints */
export const addAllowancesEndpoint = "/allowances/create"

/*** fetch definitions endpoints */
export const fetchDefinitionsEndpoint = "/tags/"

/*** add definitions endpoints */
export const addDefinitionsEndpoint = "/tags/create"

/*** edit definitions endpoints */
export const editDefinitionsEndpoint = "/tags/update"

/*** delete definitions endpoints */
export const deleteDefinitionsEndpoints = "/tags/delete"

// fetch statutory tax endpoints
export const fetchTaxEndpoints = "/paye/"

// add statutory tax endpoints
export const addTaxEndpoints = "/paye/create"

// edit statutory tax endpoints
export const editTaxEndpoints = "/paye/update"

// delete statutory tax endpoints
export const deleteTaxEndpoints = "/paye/delete"

// fetch statutory ssnit endpoints
export const fetchSsnitEndpoints = "/pensions/"

// add statutory ssnit endpoints
export const addSsnitEndpoints = "/pensions/create"

// edit statutory ssnit endpoints
export const editSsnitEndpoints = "/pensions/update"

// delete statutory ssnit endpoints
export const deleteSsnitEndpoints = "/pensions/delete"

//get deductions endpoints
export const fetchdeductionEndpoints = "/deductions"

//add deductions endpoints
export const addDeductions = "/deductions/create"
// tier one totals endpoint
export const tier1totalsEndpoint = '/sum/tier1'

// tier two totals endpoint
export const tier2totalsEndpoint = '/sum/tier2'

// bonus totals endpoint
export const bonusTotalsEndpoint = '/sum/bonus'

//change password endpoint
export const changePassword = '/auth/change-password'

//forgot password
export const forgottenPassword = '/auth/request-password-reset'

//set new password
export const setNewPassword = '/auth/reset-password'
// monthly payroll report sorted endpoint
export const monthlyPayrollReportEndpoint = '/payrolls/payroll-report-month-year-paginate'

// employee payroll report endpoint
export const employeePayrollReportEndpoint = '/payrolls/reports-sort-employee-payroll'

// monthly payroll report sorted endpoint
export const monthlyPayrollReportUnsortedEndpoint = '/payrolls/payroll-report-month-year-none-paginate'

//  monthly payroll columns totals report endpoint
export const monthlyColumnsTotalsEndpoint = '/report-payroll-columns'

//  monthly payroll employeeSSF totals report endpoint
export const monthlyEmployeeSSFTotalsEndpoint = '/report/employeeSSF'

//  monthly payroll employerSSF totals report endpoint
export const monthlyEmployerSSFTotalsEndpoint = '/report/employerSSF'

//  monthly payroll tier1 totals report endpoint
export const monthlyTier1TotalsEndpoint = '/report/tier1'

//  monthly payroll tier2 totals report endpoint
export const monthlyTier2TotalsEndpoint = '/report/tier2'

//fetch all users endpoint
export const getAllUsers = '/auth/'

// activate/deactivate user endpoint
export const userStatus = '/auth/activate'

//delete user endpoint
export const deleteUser = '/auth/delete'

//add user endpoint
export const registerUser = '/auth/register'

//update user endpoint
export const updateUser = '/auth/update'

//JV report endpoint
export const jvReportEndpoint = '/sum/report/jv-specific-period'

export const payrollBonusEndpoint = '/bonuses/with-bonus'