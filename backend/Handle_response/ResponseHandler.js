const Resopnse_Handler = (response, status, Message, Data = null, error = null) => {
    return response.status(status).json({ Message, Data, error })
}

module.exports = Resopnse_Handler