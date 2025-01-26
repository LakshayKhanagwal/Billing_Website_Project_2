const express = require('express')
const Routes = express.Router()
const { User, Shopkeeper, Executive } = require("../Model/UserModels/Userschema")
const { Product } = require("../Model/ProductModel/ProductSchema")
const { generateotp, verifyotp } = require('../Services/OtpServices/OtpServices')
const { otptoemailforverification } = require('../Services/EmailServices/EmailServices')
const Resopnse_Handler = require('../Handle_response/ResponseHandler')
const jwt = require("jsonwebtoken")

Routes.get("/", async (request, response) => {
    return response.status(200).json({ message: "Server Health is Fine." })
})

Routes.post("/Shopkeeper_Verification", async (request, response) => {
    try {
        const { name, phone, email, password, address, city, state } = request.body

        //Fileld check
        if (!name || !phone || !email || !password || !address || !city || !state) return Resopnse_Handler(response, 404, "Field can't be Empty.")

        // Check E-mail for exixting account
        const ExistingUser = await User.findOne({ email })

        if (ExistingUser) return Resopnse_Handler(response, 400, "Account already Exists.")

        const OTP = generateotp(email)

        return await otptoemailforverification(response, email, OTP)
    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.post("/Shopkeper_OTP_Verification", async (request, response) => {
    try {
        const { name, phone, email, password, address, city, state, OTP } = request.body

        //Fileld check
        if (!name || !phone || !email || !password || !address || !city || !state) return Resopnse_Handler(response, 404, "Field can't be Empty.")

        if (!OTP) return Resopnse_Handler(response, 404, "Enter The OTP")

        // Check E-mail for exixting account
        const ExistingUser = await User.findOne({ email })
        if (ExistingUser) return Resopnse_Handler(response, 400, "Account already Exists.")

        const OTP_verification_ACK = verifyotp(email, OTP)
        if (!OTP_verification_ACK.status) return Resopnse_Handler(response, 400, OTP_verification_ACK.message)

        const Shopkeeper_Acount_Create_ACK = await Shopkeeper.create({ name, phone, email, password, address, city, state })

        return Resopnse_Handler(response, 201, "Account Created Successfully", Shopkeeper_Acount_Create_ACK)
    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }

})

Routes.post("/Login", async (request, response) => {
    try {
        const { email, password } = request.body

        if (!email || !password) return Resopnse_Handler(response,401,"Field is Empty") 

        const User_Account_ACK = await User.findOne({ email })

        if (!User_Account_ACK) return Resopnse_Handler(response,401, "Invalid Email ID")
        if (password !== User_Account_ACK.password) return Resopnse_Handler(response,401,"Invalid Credentials")
        if (!User_Account_ACK.service) return Resopnse_Handler(response,401,"Services are Disabled. Contact Admin")

        const Payload = { id: User_Account_ACK._id }

        const User_Token = jwt.sign(Payload,process.env.JWT_SECURITY_KEY)

        return Resopnse_Handler(response,201,"Login Successfully",User_Token)
    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.post("/Enabler", async (request, response) => {
    try {
        const { id } = request.body

        if (!id) return response.status(404).json({ Message: "Please Select The User." })

        const User_Account_Details = await User.findOne({ _id: id })
        if (!User_Account_Details) return response.status(404).json({ Message: "User not found." })

        const User_Account_Details_Update_ACK = await User.updateOne({ _id: id }, { $set: { service: true } })
        return response.status(202).json({ Message: "Service is Enabled", User_Account_Details_Update_ACK })
    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.post("/Disabler", async (request, response) => {
    try {
        const { id } = request.body

        if (!id) return response.status(404).json({ Message: "Please Select The User." })

        const User_Account_Details = await User.findOne({ _id: id })
        if (!User_Account_Details) return response.status(404).json({ Message: "User not found." })

        const User_Account_Details_Update_ACK = await User.updateOne({ _id: id }, { $set: { service: false } })
        return response.status(202).json({ Message: "Service is Disabled", User_Account_Details_Update_ACK })
    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.post("/Add_Product", async (request, response) => {
    try {
        const { name, model, description, company, price, rate, tax, discount, stock, userid } = request.body

        if (!name || !model || !description || !company || !price || !rate || !tax || !discount || !userid) return response.status(404).json({ Message: "Field can't be Empty." })

        const Existing_Product = await Product.findOne({ model })
        if (Existing_Product) return response.status(400).json({ Message: "This Product is Already Exixts." })

        const New_Product = await Product.create({ userid, name, company, model, description, price, discount, rate, tax, stock, })

        return response.status(201).json({ Message: "Product added Successfully", New_Product })

    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.get("/Get_Products", async (request, response) => {
    try {
        const All_Products = await Product.find({ userid: "67913e0af355f679f16b04b4" })

        if (All_Products.length === 0) return resp.status(404).json({ message: "Your product list is empty" });

        return response.status(202).json({ Message: "All Products fetched successfully.", All_Products });

    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.delete("/Delete_Product/:id", async (request, response) => {
    try {
        const { id } = request.params;
        if (!id) return response.status(404).json({ Message: "Please select the product" });

        const Existing_Product = await Product.findOne({ _id: id, userid: "67913e0af355f679f16b04b4", });

        if (!Existing_Product) return response.status(404).json({ Message: "This product is not found in the product list." });

        const Delete_Product_ACK = await Product.deleteOne({ _id: id, userid: "67913e0af355f679f16b04b4" });

        return response.status(202).json({ Message: "Product deleted successfully", Delete_Product_ACK });

    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.put("/Update_Product/:id", async (request, response) => {
    try {
        const {
            name, company, model, stock, description, price, discount, rate, tax, } = req.body;
        if (!name || !company || !model || !description || !price || !discount || !rate || !tax) return resp.status(404).json({ Message: "Field can't be Empty" });

        const { id } = request.params;
        if (!id) return response.status(404).json({ Message: "Please select the product" });

        const Existing_Product = await Product.findOne({ _id: id });

        if (!Existing_Product) return response.status(404).json({ Message: "This product is not found in the product list." });

        const Existing_Modal = await Product.findOne({ model });
        if (Existing_Modal) return resp.status(400).json({ Message: "Product of this model is already exists in your product list" });

        const Update_Product_ACK = await Product.updateOne({ _id: id }, { $set: { name, company, model, description, price, discount, rate, tax, stock } });

        return response.status(202).json({ Message: "Product Updated successfully", Update_Product_ACK });

    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

module.exports = Routes