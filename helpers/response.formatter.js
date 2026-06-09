const response = (status, message, data) => {
    if (data) {
        return {
            status: status,
            message: message,
            data: data,
        }
    } else {
        return {
            status: status,
            message: message,
        }
    }
}

module.exports = { response };