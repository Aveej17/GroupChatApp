const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Chat = sequelize.define("Chat",{
  
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    content:{
        type:Sequelize.STRING,
        allowNull:false,
    }
})


module.exports = Chat;