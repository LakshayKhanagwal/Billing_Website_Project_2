const nodemailer = require("nodemailer")

require("dotenv").config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'klakshay889@gmail.com',
    pass: process.env.EMAIL_SERVICES_PASSWORD
  }
});

const otptoemailforverification=async(response,email,OTP)=>{
    
    const mailOptions = {
        from: 'klakshay889@gmail.com',
        to: email,
        subject: 'OTP for Account Creation on Shopkeeper App',
        text: 'Your OTP is:'+OTP,
      };
      
    try {
        const info= await transporter.sendMail(mailOptions)
        return response.status(202).json({Message:"OTP sent successfully",data:info.response})
    } catch (error) {
        return resp.status(400).json({Message:"Email is not valid."})
    }
}

module.exports={otptoemailforverification}