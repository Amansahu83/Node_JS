const mongoose=require('mongoose');
const fs=require('fs');
const validator = require('validator');
const bcrypt=require('bcryptjs')
// User Schema definition
const UserSchema= new mongoose.Schema({
    _id:{
        type:Number,
        required:true,
        unique:true
    },
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email_id:{
      type:String,
      required:true,
      unique:true,
      validate:[validator.isEmail,"plaese enter a valid email"]
    },
    login_time:{
        type:Date,
    },
    logout_time:{
        type:Date,
    },
    updated_at:{
        type:Date,
    },
    created_at:{
        type:Date,
    },
    created_by:{
        type:String
    }
    },{_id:false});
// Exexted before the document is saved  
//insert many, findIDandupdate will not work 
// UserSchema.pre('save',function(next){
//     console.log(this);
//     this.created_at=Date.now();
//     next();
//   })



// Pre-save hook to hash the password before saving to the database


UserSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();

    try {
      // Ensure this.password is a string before hashing
      if (typeof this.password !== 'string') {
        throw new Error('Password must be a string');
      }
  
      this.password = await bcrypt.hash(this.password, 12);
      next();
    } catch (error) {
      return next(error);
    }
})

// Method to compare the provided password with the stored hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
  
// UserSchema.post('save',function(next){
//     fs.writeFileSync('./log/log.txt',content,{flag:'a'},(err)=>{
//         console.log(err.message);
//     })
//     next();

// })


// Model creation
const User=mongoose.model("User",UserSchema);

    
module.exports=User;