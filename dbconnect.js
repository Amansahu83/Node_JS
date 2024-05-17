const Sequelize = require('sequelize');
const {userModel,contact_info}= require('./models/user');
const account=require('./models/bank_account');
    const sequelize = new Sequelize("User", "postgres", "1234@Aman", {
        host: "localhost",
        dialect: "postgres"
    });
//Middleware



User = userModel(sequelize);
let Contact=contact_info(sequelize);
let Account=account(sequelize);
User.hasOne(Contact,{
    foriegnKey:{
        type:Sequelize.DataTypes,
        allowNull:false
    }
});
Contact.belongsTo(User);


//One to many 
User.hasMany(Account,{
    foriegnKey:{
        type:Sequelize.DataTypes,
        allowNull:false
    }  
})
Account.belongsTo(User);


// Many to many
User.belongsToMany(User,{as:"User",foriegnKey:"UserId",through:"Follow"});
User.belongsToMany(User,{as:"Followed",foriegnKey:"FollowedId",through:"Follow"});
sequelize.sync({alter:true});
console.log("table created");

module.exports={sequelize,User,Contact,Account};

