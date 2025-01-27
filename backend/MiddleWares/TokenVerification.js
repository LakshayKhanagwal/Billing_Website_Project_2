const Resopnse_Handler = require("../Handle_response/ResponseHandler")
const { User } = require("../Model/UserModels/Userschema")
const jwt = require("jsonwebtoken")

const Token_Verification = async (request, response,next) => {
    const token = request.header("Authorization")
    if (!token) return Resopnse_Handler(response, 404, "Token not Found.")
    const User_Payload = jwt.verify(token, process.env.JWT_SECURITY_KEY)
    if (!User_Payload || !User_Payload.id) return Resopnse_Handler(response, 401, "Invalid token.")

    const User_Data = await User.findOne({ _id: User_Payload.id }).select("-password")
    if (!User_Data) return Resopnse_Handler(response, 400, "User not Found.")

    // return Resopnse_Handler(response, 201, "User Validation Successfull.", User_Data)

    request.user = User_Data
    next()
}

module.exports = Token_Verification