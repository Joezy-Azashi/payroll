import api from './api'
import * as endpoints from './_redux/endpoints'
export function getErrorCode(errorMessage) {
    if (errorMessage && errorMessage.length > 0) {
        return errorMessage.split(' ')
    } else {
        return ''
    }
}

export function yearList(){
    const years = [];
    let startYear = 2021;
    let currentYear = new Date().getFullYear();
    while((currentYear + 10) >= startYear) {
        years.unshift(startYear);
        startYear++;
    }
    return years;
}

export function monthList(){
    return [
        { name: 'January', value: 1},
        { name: 'February', value: 2},
        { name: 'March', value: 3},
        { name: 'April', value: 4},
        { name: 'May', value: 5},
        { name: 'June', value: 6},
        { name: 'July', value: 7},
        { name: 'August', value: 8},
        { name: 'September', value: 9},
        { name: 'October', value: 10},
        { name: 'November', value: 11},
        { name: 'December', value: 12}
    ];
}

export function monthListString(){
    return [
        { name: 'January', value: '01'},
        { name: 'February', value: '02'},
        { name: 'March', value: '03'},
        { name: 'April', value: '04'},
        { name: 'May', value: '05'},
        { name: 'June', value: '06'},
        { name: 'July', value: '07'},
        { name: 'August', value: '08'},
        { name: 'September', value: '09'},
        { name: 'October', value: '10'},
        { name: 'November', value: '11'},
        { name: 'December', value: '12'}
    ];
}

export function getDataForExport(date) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api().post(endpoints.monthlyPayrollReportUnsortedEndpoint, date)
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}

export function pageNumbering(page){
    if (page === 0) {
        return 0
    } else {
        return (page * 20)
    }
}

export function getCurrentMonthYear(){
    const year =  new Date().getFullYear()
    const month = (new Date().toLocaleString('default', { month: 'long' }))
    return `${year} ${month}`
}

export function getCurrentMonthYearFromDate(date){
    const year =  new Date(date).getFullYear()
    const month = (new Date(date).toLocaleString('default', { month: 'long' }))
    return `${year} ${month}`
}

