const express = require('express')
const Routes = express.Router()
const { User, Shopkeeper, Executive } = require("../Model/UserModels/Userschema")
const Product = require("../Model/ProductModel/ProductSchema")
const { generateotp, verifyotp } = require('../Services/OtpServices/OtpServices')
const { otptoemailforverification } = require('../Services/EmailServices/EmailServices')
const Resopnse_Handler = require('../Handle_response/ResponseHandler')
const jwt = require("jsonwebtoken")
const Token_Verification = require('../MiddleWares/TokenVerification')
const Customer = require("../Model/CustomerModels/CustomerSchema")
const { default: mongoose } = require('mongoose')
const OrderedItems = require('../Model/OrderedItemsModel/OrderedItemsSchema')
const { Invoice, Transaction } = require('../Model/TransectionModel/TransectionSchema')

Routes.get("/", async (request, response) => {
    return response.status(200).json({ message: "Server Health is Fine." })
})

Routes.post("/Shopkeeper_Verification", Token_Verification, async (request, response) => {
    try {
        const { name, phone, email, password, address, city, state } = request.body

        //Fileld check
        if (!name || !phone || !email || !password || !address || !city || !state || city === "none" || state === "none") return Resopnse_Handler(response, 404, "Field can't be Empty.")

        // Check E-mail for exixting account
        const ExistingUser = await User.findOne({ email })

        if (ExistingUser) return Resopnse_Handler(response, 400, "Account already Exists.")

        const OTP = generateotp(email)

        return await otptoemailforverification(response, email, OTP)
    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.post("/Shopkeper_OTP_Verification", Token_Verification, async (request, response) => {
    try {
        const { name, phone, email, password, address, city, state, OTP } = request.body

        //Fileld check
        if (!name || !phone || !email || !password || !address || !city || !state || city === "none" || state === "none") return Resopnse_Handler(response, 404, "Field can't be Empty.")

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

        if (!email || !password) return Resopnse_Handler(response, 401, "Field is Empty")

        const User_Account_ACK = await User.findOne({ email })

        if (!User_Account_ACK) return Resopnse_Handler(response, 401, "Invalid Email ID")
        if (password !== User_Account_ACK.password) return Resopnse_Handler(response, 401, "Invalid Credentials")
        if (!User_Account_ACK.service) return Resopnse_Handler(response, 401, "Services are Disabled. Contact Admin")

        const Payload = { id: User_Account_ACK._id }

        const User_Token = jwt.sign(Payload, process.env.JWT_SECURITY_KEY)

        return Resopnse_Handler(response, 201, "Login Successfully", { User_Token, role: User_Account_ACK.role })
    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.post("/Fatch_User_Details", Token_Verification, async (request, response) => {
    try {
        const Payload = { id: request.user._id }
        const User_Token = jwt.sign(Payload, process.env.JWT_SECURITY_KEY)
        return Resopnse_Handler(response, 202, "User is Valid.", { role: request.user.role, User_Token })

    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.get("/Fatch_Shopkeepers_Executives", Token_Verification, async (request, response) => {
    try {
        const Shopkeepers_Executives = await User.find({ role: { $ne: 'Superadmin' } }).select('-password')

        if (Shopkeepers_Executives.length === 0) return Resopnse_Handler(response, 200, "No User Found.")

        Resopnse_Handler(response, 202, "Users Fetched Successfully.", Shopkeepers_Executives)

    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.put("/Enabler", Token_Verification, async (request, response) => {
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

Routes.put("/Disabler", Token_Verification, async (request, response) => {
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

Routes.post("/Add_Product", Token_Verification, async (request, response) => {
    try {
        const { name, model, description, company, price, rate, tax, discount, stock, userid } = request.body

        // userid = request.user._id

        if (!name || !model || !description || !company || !price || !rate || !tax || !discount) return Resopnse_Handler(response, 400, "Field can't be Empty.")

        const Existing_Product = await Product.findOne({ model })
        if (Existing_Product) return Resopnse_Handler(response, 400, "This Product is Already Exixts.")

        const New_Product = await Product.create({ userid: request.user._id, name, company, model, description, price, discount, rate, tax, stock })

        return Resopnse_Handler(response, 202, "Product added Successfully.", New_Product)

    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

const Validate_Product = (Product_object, schema) => {
    const Schema_Keys = Object.keys(schema.paths).filter((key) => key !== "__v" && key !== "_id")
    const Product_Object_Keys = Object.keys(Product_object)
    for (let key of Schema_Keys) {
        if (!Product_object.hasOwnProperty(key) || Product_object[key] === null || Product_object[key] === "") return "key " + key + " is missing."
    }

    for (let key of Product_Object_Keys) {
        if (!Schema_Keys.includes(key)) return "key " + key + " is invalid or extra."
    }
    return null
}

Routes.post("/Add_Miltiple_Product", Token_Verification, async (request, response) => {
    try {
        const { Product_Excel } = request.body

        if (!Array.isArray(Product_Excel) || Product_Excel.length === 0) return Resopnse_Handler(response, 400, "Invalid input Format.")

        const Updated_Producl_Excel = Product_Excel.map(Product_Excel => { return { ...Product_Excel, userid: request.user._id } })
        const error = []
        Updated_Producl_Excel.map(async (Product_Data, index) => {
            const Validaton_Error = Validate_Product(Product_Data, Product.schema);
            if (Validaton_Error) error.push({ index, error: Validaton_Error })

            const Existing_Product = await Product.findOne({ model: Product_Data.model })
            if (Existing_Product) error.push({ index, error: "The Model Number " + Product_Data.model + " is already Exists." })
        })

        if (error.length > 0) return Resopnse_Handler(response, 400, "Validation Error Occured.", null, error)

        const Product_Insert_ACK = await Product.insertMany(Updated_Producl_Excel)
        return Resopnse_Handler(response, 202, "Product Added Successfully.", Product_Insert_ACK)

    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error", null, error)
    }
})

Routes.get("/Get_Products", Token_Verification, async (request, response) => {
    try {
        const All_Products = await Product.find({ userid: request.user._id }).select("-userid -__v")

        if (All_Products.length === 0) return Resopnse_Handler(response, 404, "Your product list is empty.")

        return Resopnse_Handler(response, 202, "All Products fetched successfully.", All_Products)
    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.delete("/Delete_Product/:id", Token_Verification, async (request, response) => {
    try {
        const { id } = request.params;
        if (!id) return Resopnse_Handler(response, 404, "Please select the product")

        const Existing_Product = await Product.findOne({ _id: id, userid: request.user._id });

        if (!Existing_Product) return Resopnse_Handler(response, 404, "This product is not found in the product list.")

        const Delete_Product_ACK = await Product.deleteOne({ _id: id, userid: request.user._id });

        return Resopnse_Handler(response, 202, "Product deleted successfully", Delete_Product_ACK)

    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.put("/Update_Product/:id", Token_Verification, async (request, response) => {
    try {
        const { name, company, model, stock, description, price, discount, rate, tax } = request.body;
        if (!name || !company || !model || !description || !price || !discount || !rate || !tax || !stock) return Resopnse_Handler(response, 404, "Field can't be Empty")

        const { id } = request.params;
        if (!id) return Resopnse_Handler(response, 404, "Please select the product.")

        const Existing_Product = await Product.findOne({ _id: id, userid: request.user._id });
        if (!Existing_Product) return Resopnse_Handler(response, 404, "This product is not found in the product list.")

        const Existing_Product_Model = await Product.findOne({ model, userid: request.user._id });
        if (Existing_Product_Model && Existing_Product_Model._id.toString() !== id) return Resopnse_Handler(response, 400, "Product of this model is already exists in your product list")

        const Update_Product_ACK = await Product.updateOne({ _id: id }, { $set: { name, company, model, description, price, discount, rate, tax, stock } });

        return Resopnse_Handler(response, 202, "Product Updated successfully", Update_Product_ACK)

    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.post("/Add_Customer", Token_Verification, async (request, response) => {
    try {
        const { name, phone, address } = request.body
        if (!name || !phone || !address) return Resopnse_Handler(response, 404, "Field is Empty.")

        const Existing_Customer = await Customer.findOne({ phone, customerof: request.user._id })
        if (Existing_Customer) return Resopnse_Handler(response, 404, "Customer Already Exists.")

        const Customer_ACK = await Customer.create({ name, phone, address, customerof: request.user._id })

        return Resopnse_Handler(response, 202, "Customer Added Successfully.", Customer_ACK)

    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

Routes.get("/Get_All_Customer", Token_Verification, async (request, response) => {
    try {
        const All_Customer = await Customer.find({ customerof: request.user._id }).select("-customerof -__v")
        if (!All_Customer || All_Customer.length === 0) return Resopnse_Handler(response, 404, "No Customer for Display.")

        return Resopnse_Handler(response, 202, "Customer Fetched Successfully.", All_Customer)

    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error")
    }
})

const Validate_Ordered_Items = (items) => {
    if (Object.keys(items).length === 0) return "Product Detail not found.";
    if (!items.id || items.id === "" || items.id == null || !mongoose.isValidObjectId(items.id)) return "Product id is invalid.";
    if (!items.quantity || items.quantity === "" || items.quantity === null || items.quantity <= 0) return "Product quantity is invalid.";

    return null
}

const Invoice_Number_Generator = async () => {
    const Last_Invoice = await Invoice.findOne().sort({ _id: -1 })
    let New_Invoice_Number;
    if (Last_Invoice) {
        let Last_Number = parseInt(Last_Invoice.InvoiceNo.split('-')[1]) + 1
        New_Invoice_Number = `INV-${Last_Number.toString().padStart(5, '0')}`
    } else {
        New_Invoice_Number = 'INV-00001'
    }
    return New_Invoice_Number
}

Routes.post("/Create_Invoice/:id", Token_Verification, async (request, response) => {
    try {
        const { id } = request.params
        if (!id || !mongoose.isValidObjectId(id)) return Resopnse_Handler(response, 404, "It's Not a Valid Customer.")

        const Existing_Customer = await Customer.findOne({ _id: id })
        if (!Existing_Customer) return Resopnse_Handler(response, 404, "Customer Not Found.")

        const { Ordered_Items } = request.body

        if (!Ordered_Items) return Resopnse_Handler(response, 404, "Please Select a Product.")
        if (!Array.isArray(Ordered_Items) || Ordered_Items.length === 0) return Resopnse_Handler(response, 404, "Invalid Item Input Style.")

        const error = []
        Ordered_Items.map(async (Items, index) => {
            const Validation_Error = Validate_Ordered_Items(Items)
            if (Validation_Error) error.push({ index, error: Validation_Error })
        })
        if (error.length > 0) return Resopnse_Handler(response, 404, "Validation Error.", null, error)

        let Total_Tax = 0
        let Total_Discount = 0
        let Total_Profit = 0
        let Total_Amount = 0

        Ordered_Items.map(item => {
            const discount = parseFloat((((item.price * item.discount) / 100) * item.quantity).toFixed(2))
            const tax = parseFloat(((((item.price - (item.price * item.discount / 100)) * item.tax) / 100) * item.quantity).toFixed(2))
            item.subtotal = parseFloat(((item.price * item.quantity) + tax - discount).toFixed(2))
            const profit = parseFloat((item.subtotal - tax - (item.rate * item.quantity)).toFixed(2))

            Total_Tax += tax
            Total_Discount += discount
            Total_Amount += item.subtotal
            Total_Profit += profit
        })
        Ordered_Items.map(async item => {
            const items_one = await Product.findOne({ _id: item.id })
            await Product.updateOne({ _id: item.id }, { $set: { stock: items_one.stock - item.quantity } })
        })

        const Orders_ACK = OrderedItems.insertMany(Ordered_Items)

        const All_ID = (await Orders_ACK).map(ord => ord._id)

        const Invoice_Number = await Invoice_Number_Generator()
        const User_id = request.user._id
        Complete_Invoice = await Invoice.create({ InvoiceNo: Invoice_Number, OrderItems: All_ID, TotalAmount: Total_Amount, TotalTax: Total_Tax, TotalDiscount: Total_Discount, TotalProfit: Total_Profit, Subtotal: Total_Amount, customerId: id, shopkeeperId: User_id })
        const Final_Ordered_Items = await OrderedItems.find({ _id: { $in: All_ID } })
        await Customer.updateOne({ _id: id }, { $set: { balance: Existing_Customer.balance + Total_Amount } })
        return Resopnse_Handler(response, 202, "Invoice Generated Successfully.", { Final_Ordered_Items, Complete_Invoice })
    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error", null, error)
    }
})

Routes.post("/Data_For_Invoice_PDF", Token_Verification, async (request, response) => {
    try {
        const { id } = request.body
        const Shopkeeper = await User.findOne({ _id: request.user._id }).select("name phone email address -_id")
        if (!Shopkeeper) return Resopnse_Handler(response, 404, "Invaild ShopKeeper.")
        const Customer_Data = await Customer.findOne({ _id: id }).select("name phone email address balance -_id")
        if (!Customer_Data) return Resopnse_Handler(response, 404, "Invaild Customer.")

        return Resopnse_Handler(response, 202, "Data Fetched Successfully..", { Shopkeeper, Customer_Data })
    } catch (error) {
        return Resopnse_Handler(response, 500, "Internal Server Error", null, error)
    }
})

// Routes.post("/User_Tokan_Verification", async (request, response) => {
//     const token = request.header("Authorization")
//     if (!token) return Resopnse_Handler(response, 404, "Token not Found.")
//     const User_Payload = jwt.verify(token, process.env.JWT_SECURITY_KEY)
//     if (!User_Payload || !User_Payload.id) return Resopnse_Handler(response, 401, "Invalid token.")

//     const User_Data = await User.findOne({ _id: User_Payload.id }).select("-password -_id -__v -service -createdAt")
//     if(!User_Data) return Resopnse_Handler(response,400,"User not Found.")

//     return Resopnse_Handler(response,201,"User Validation Successfull.",User_Data)
// })

module.exports = Routes