const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

router.post("/register",async (req,res)=>{
    const {email,password} = req.body;
    try{
        const existingUser = await User.findOne({email:email});
        if(existingUser){ return res.status(400).json({message: "User already exists"});}
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({email:email,password:hashedPassword});
        await user.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"10h"});
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            path: '/',
        });
        res.status(201).json({message:"User registered successfully!"});
    } catch(err){
        res.status(500).json({message:"User registration failed."})
    }
});

router.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user || !(bcrypt.compare(password,user.password))){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"10h"});
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            path: '/',
        });
        res.status(201).json({message:"Logged In successfully!"});
    } catch(err){
        res.status(500).json({message:"Login Failed"});
    }
});

router.post("/logout",async (req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.status(500).json({message:"Log Out failed"});
        }
        res.clearCookie("connect.sid");
        res.json({message:"Logout successful"});
    })
});

module.exports = router;