const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const isStringValid = require('../utils/stringValidation');
const e = require('express');

async function hashPassword(password, saltRounds) {
    try {
        // Await the bcrypt hash operation
        const hash = await bcrypt.hash(password, saltRounds);
        
        return hash; 
    } catch (err) {
        console.error(err);
    }
}

async function compare(userPassword, hashedPassword) {
    try{
        const isMatch = await bcrypt.compare(userPassword, hashedPassword);
        return isMatch;
    }catch{
        throw new Error("Something went wrong");
    }
    
}

exports.createUser = async (req, res, next)=>{
    
    try{
        console.log(req.body);
        
        const name = req.body.userName;
        const email = req.body.emailId;
        const password = req.body.password;
        const phone = req.body.phone;

        if(isStringValid(name) || isStringValid(email) || isStringValid(password) || isStringValid(phone)){
            console.log("Missing");
            
            return res.status(400).json("Missing parameters to create account");
        }

        const user = await User.findOne({ where: { phone:phone } });
        const user1 = await User.findOne({where: { email:email } });

        // Hashing the password
        const saltRounds = 10;
        
        const hash = await hashPassword(password, saltRounds);
        // console.log("Stored hash:", hash); // Access the hashed password here
        
        if(user==null && user1 == null){

            const user = await User.create({
                name:name,
                email:email,
                phone:phone,
                password:hash
            });
            return res.json({
                status:"Success",
                message: "User created Successfully",
                user,
                
            })
        }
        else{
            res.status(409).send("user Already Exists");
        }
    }
    catch(err){console.log(err)}
}

exports.check = (req, res, next)=>{
    console.log("reached"); 
}