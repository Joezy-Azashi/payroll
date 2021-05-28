export const required = (val, propertyType) => {
  return (val && (val.length > 0) && true) || `You must provide ${propertyType}`
}

export const minLength = (propertyType, minLength) => {
  // eslint-disable-next-line no-mixed-operators
  return v => v && v.length >= minLength || `${propertyType} must be at least ${minLength} characters`
}

export const maxLength = (propertyType, maxLength) => {
  // eslint-disable-next-line no-mixed-operators
  return v => (v && v.length <= maxLength) || (`${propertyType} must be less than ${maxLength} characters`)
}

export const notRequiredMaxLength = (val, propertyType, maxLength) => {
  if (val !== '' && val !== null) {
    // eslint-disable-next-line no-mixed-operators
    return val.length <= maxLength || `${propertyType} must be less than ${maxLength} characters`
  }
  return true
}
// const onlyNumbers = (event) => {
//   if (!/\d/.test(event.key)) return event.preventDefault()
// }

export const onlyNumbers = () => {
  // eslint-disable-next-line no-mixed-operators
  return v => v && v.match(/(^[1-9]\d*$)/) || 'Must be a number greater than zero and should not have spaces'
}

export const emailFormat = () => {
  const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  // eslint-disable-next-line no-mixed-operators
  return v => v && regex.test(v) || 'Must be a valid email'
}
export const username = (val) => {
  const letters = /[a-zA-Z]/g
  const regex = /.+@.+\..+/
  if (val && letters.test(val)) {
    // eslint-disable-next-line no-mixed-operators
    return v => v && regex.test(v) || 'Must be a valid email'
  } else {
    // eslint-disable-next-line no-mixed-operators
    return v => v && v.length >= 10 || 'Phone Number must be at least 10 characters'
  }
}

export const validEmail = (val) => {
  const regex = /.+@.+\..+/
  // eslint-disable-next-line no-mixed-operators
  return val && regex.test(val) || 'Must be a valid email'
}
export const mustContainNumber = () => {
  // eslint-disable-next-line no-mixed-operators
  return v => v && v.match(/([0-9])/) || 'Must contain a numeric value'
}
// eslint-disable-next-line no-unused-vars
export const noSpaceAllowed = (val) => {
  const regex = /^\S+$/
  if (val !== '' && val !== null) {
    // eslint-disable-next-line no-mixed-operators
    return v => v && v.match(regex) || 'No spaces allowed'
  }
  return true
  //  !!(val.match(/^\S+$/)) || 'Name must have no spaces'
}
export const mustContainAlpha = (password) => {
  const regex = /([a-z].*[A-Z])|([A-Z].*[a-z])/
  // eslint-disable-next-line no-mixed-operators
  return v => v && v.match(regex) || 'Must contain at least one upper case'
}
export const mustContainLower = (password) => {
  const regex = /^[a-z]+$/
  // eslint-disable-next-line no-mixed-operators
  return password.match(regex) || 'Must contain at least one lower case'
}
export const mustContainSymbol = (password) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /[-!$%^&*@#()_+|~=`{}\[\]:";'<>?,.\/]/
  // eslint-disable-next-line no-mixed-operators
  return password.match(regex) || 'Must contain at least one symbol'
}

export const passwordMatch = (password) => {
  // eslint-disable-next-line no-mixed-operators
  return v => v && v === password || 'Password Do Not Match'
}
export const passwordStrength = () => {
  const regex = /(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!%&@#$^*?_~])[\w!%&@#$^*?_~]{8,}/
  // eslint-disable-next-line no-mixed-operators
  return v => v && v.match(regex) || 'Password must contain at least one upper case, one lower case, a number and a special character'
}
export const maxFileSize = (prototype, maxSize) => {
  return files => !files || !files.some(file => file.size > (maxSize * 1024 * 1024)) || `${prototype} size should be less than ${maxSize} MB!`
}

export const isValidUrl = (url) => {
  const regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.?\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[?6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1?,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00?a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u?00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i
  // return validUrl.test(url)
  if (url !== '' && url !== null) {
    // eslint-disable-next-line no-mixed-operators
    return v => v && regex.test(v) || 'Must be a valid Url with http or https'
  }
  return true
}

export const phoneNumberFormat = () => {
  const regex = /^\+?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,9})$/
  // eslint-disable-next-line no-mixed-operators
  return v => v && regex.test(v) || 'Must be a valid phone number'
}

export const notRequiredPhoneNumberFormat = (val) => {
  if (val) {
    const regex = /^\+?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,9})$/
    // eslint-disable-next-line no-mixed-operators
    return v => v && regex.test(v) || 'Must be a valid phone number'
  } else {
    return true
  }
}

export const removeDot = () => {
  const regex = /checked.split('.').join("")/
  // eslint-disable-next-line no-mixed-operators
  return v => v && regex.test(v) || 'Must not contain any dot'
}
export const FileSizeValidation = (fileSize, requiredSize) => {
  // const sizeInMb = requiredSize / 1024 / 1024
  return (requiredSize >= fileSize)
}

export default {
  FileSizeValidation,
  maxFileSize,
  isValidUrl,
  passwordStrength,
  passwordMatch,
  mustContainAlpha,
  mustContainLower,
  mustContainNumber,
  mustContainSymbol,
  emailFormat,
  username,
  required,
  minLength,
  maxLength,
  notRequiredMaxLength,
  noSpaceAllowed,
  validEmail,
  onlyNumbers,
  phoneNumberFormat,
  removeDot,
  notRequiredPhoneNumberFormat
}
