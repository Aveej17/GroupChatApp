const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./utils/database');

const User = require('./models/userModel');
const Group = require('./models/groupModel');
const userGroup = require('./models/userGroups');

require('dotenv').config();

const app = express();


app.use(cors(
    origin="http://127.0.0.1:5500",
));

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupsRoutes');

app.use('/users', userRoutes);
app.use('/chats', chatRoutes);
app.use('/groups', groupRoutes);

User.belongsToMany(Group, { through: userGroup, foreignKey: 'userId' });
Group.belongsToMany(User, { through: userGroup, foreignKey: 'groupId' });


app.use((req, res)=>{
    console.log("sorry can't find");
    res.status(404).json("sorry can't find");
    
})


sequelize
.sync()
.then(result =>{
    app.listen(3000);
    // app.listen(3500);
})
.catch(err=>{
    console.log(err)
});



