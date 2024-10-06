const Chat = require('../models/chatModel');
const isStringValid = require('../utils/stringValidation');

const User = require('../models/userModel');  // Assuming you have a User model
const { where } = require('sequelize');

exports.getChat = async (req, res) => {
    try {
        const { authId } = req.body;
        let name;

        // Check if user has already joined
        const existingChat = await Chat.findOne({
            where: { userId: authId } // Checking if this userId already exists in the Chats table
        });

        if (existingChat) {
            // console.log("User has already joined: " + existingChat.name);
            name = existingChat.name;  // Existing user's name
        } else {
            // console.log("New user joining");

            // Fetch username from User table if it's a new user
            const user = await User.findOne({ where: { id: authId } });

            if (user) {
                name = user.name;
                // console.log("New user name fetched: " + name);
                const content = "Joined here";
                // Persist new user and their chat message
                await Chat.create({
                    name: name,
                    userId: authId,
                    content: content
                });
            } else {
                return res.status(404).json({ success: false, message: "User not found" });
            }
        }

        // Fetch and return the chat messages
        const chat = await Chat.findAll({
            attributes: ['name', 'content']
        });
        console.log(JSON.stringify(chat) + " Chats");

        res.status(200).json({ chat: chat, success: true });
    } catch (err) {
        // console.error("Error: " + err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

exports.createChat = async (req, res)=>{

    try{
        const { authId,  } = req.body;
        const content = req.body.chatDetails.content;

        let name;
        const user = await User.findOne({ where: { id: authId } });
        // console.log(req.body);

        // console.log(content);
        
        name = user.name;
        let response = await Chat.create({
            name: name,
            userId: authId,
            content: content
    })
    
    // console.log("Chat Created");
    res.status(201).JSON({response:response, status:"success"});
    }
    catch(err){
        // console.log(err);
        res.status(500).JSON({err:err})
        
    }
}

