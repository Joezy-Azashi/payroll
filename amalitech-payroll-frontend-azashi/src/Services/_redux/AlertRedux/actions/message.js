import { SHOW_ALERT, CLOSE_ALERT } from "./types";

export const showAlert = ({alertType, alertMessage}) => ({
    type: SHOW_ALERT,
    payload: {alertType, alertMessage}
})

export const closeAlert = ({alertType, alertMessage}) => ({
    type: CLOSE_ALERT,
    payload: {alertType, alertMessage}
})