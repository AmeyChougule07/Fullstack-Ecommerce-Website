import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

const createToken = (id)=>{
  return jwt.sign({id},process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req,res)=>{
  try {
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    if (!user) {
      return res.json({success:false, message:"User doesn't exists"});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({success:true,token})
    }
    else{
      res.json({success:false,message:"Invalid credentials"});
    }

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// Route for user registration
const registerUser = async (req,res)=>{
  try {

    const {name,email,password} = req.body;

    // Checking if user already exists or not
    const exists = await userModel.findOne({email})   
    if(exists){
      return res.json({success:false, message:"User already exists"});
    }

    //validating email and strong password
    if (!validator.isEmail(email)) {
      return res.json({success:false, message:"Please enter a valid email"});
    }
    if (password.length < 8) {
      return res.json({success:false, message:"Please enter a strong password"});
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = new userModel({
      name,
      email,
      password:hashedPassword
    })

    const user = await newUser.save();

    const token = createToken(user._id)
    res.json({success:true,token})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// Route for admin login
const adminLogin = async(req,res)=>{
  try {
    const {email,password} = req.body

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD  ) {
      const token = jwt.sign(email+password,process.env.JWT_SECRET);
      res.json({success:true,token})
    }else{
      res.json({success:false,message:"Invalid credentials"})
    }

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// Send OTP function

const sendResetOtp = async (req,res) => {
  try {

    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user)
      return res.json({ success:false, message:"User not found" });

    const otp = Math.floor(100000 + Math.random()*900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10*60*1000;

    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ success:true, message:"OTP sent to email" });

  } catch(error){
    res.json({ success:false, message:error.message });
  }
};

//Reset OTP function

const resetPassword = async (req,res)=>{
  try {

    const { email, otp, newPassword } = req.body;

    const user = await userModel.findOne({ email });

    if (!user)
      return res.json({ success:false, message:"User not found" });

    const enteredOtp = otp.toString(); 

    if (
      user.resetOtp !== enteredOtp ||
      user.resetOtpExpireAt < Date.now()
    ){
      return res.json({
        success:false,
        message:"Invalid or expired OTP"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword,10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    res.json({ success:true, message:"Password updated successfully" });

  } catch(error){
    res.json({ success:false, message:error.message });
  }
};

export { loginUser,registerUser,adminLogin,sendResetOtp,resetPassword }