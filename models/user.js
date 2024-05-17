const Sequelize=require('sequelize');
const userModel=(sequelize)=>{
  const {DataTypes}=Sequelize;
    return sequelize.define("user",{
   first_name:{
   type:DataTypes.STRING,
   },
   last_name:{
      type:DataTypes.STRING,
   },
    age:{
      type:DataTypes.INTEGER
    },
    email_id:{
    type:DataTypes.STRING
    },
    password:{
      type:DataTypes.STRING
    }
  })
}
const contact_info=(sequelize)=>{
  const {DataTypes}=Sequelize;
   return sequelize.define("Contact",{
    email_id:{
    type:DataTypes.STRING
    },
    phone_no:{
      type:DataTypes.STRING
    }

  })
}


module.exports={userModel,contact_info};

