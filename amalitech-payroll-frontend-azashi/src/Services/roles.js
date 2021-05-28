 import { getUserRole } from './auth'

export function canApproved () {
    const roles = getUserRole()
    return (roles.includes('MANAGER') || roles.includes('SUPER_ADMIN'))
}

export function canAuthorize () {
    const roles = getUserRole()
    return (roles.includes('SENIOR_ACCOUNTANT') || roles.includes('SUPER_ADMIN'))
}

export function canEdit () {
    const roles = getUserRole()
    return (roles.includes('SENIOR_ACCOUNTANT') || roles.includes('ACCOUNTANT') || roles.includes('SUPER_ADMIN'))
}

export function canAdd () {
    const roles = getUserRole()
    return (roles.includes('SENIOR_ACCOUNTANT') || roles.includes('ACCOUNTANT') || roles.includes('SUPER_ADMIN'))
}

export function canDelete () {
    const roles = getUserRole()
    return (roles.includes('SENIOR_ACCOUNTANT') || roles.includes('ACCOUNTANT') || roles.includes('SUPER_ADMIN'))
}

export function canAccessUsers(){
    const roles = getUserRole()
    return (roles.includes('SUPER_ADMIN'))
}
