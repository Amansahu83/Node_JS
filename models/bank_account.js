const Sequelize=require('sequelize');
const user_account=(sequelize)=>{
    const {DataTypes}=Sequelize;
    return sequelize.define("user_account",{
     Account_no:{
     type:DataTypes.BIGINT
     },
     phone_no:{
       type:DataTypes.STRING
     }
  
   })
  }
  module.exports=user_account