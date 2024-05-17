const User=require('../model/user');
const jwt=require('jsonwebtoken');
const currentDate=new Date();


const signToken =id =>{
  return jwt.sign({id},"sfdghjer5678e4567ufgt5f6g654erfg",{
    expiresIn:10000000
  });
}


// Controller function to create user data
exports.Sign_up=(req, res) => {
    const testUser = new User(req.body);
    signToken(testUser._id);
    testUser.created_at=currentDate.getTime();
    testUser.save()
      .then(() => {
        res.status(201).json({
          status: "Success",
          data: {
            testUser
          }
        });
      }).catch((err) => {
        res.status(500).json({
          status: "Error",
          message:message.err
        });
      });
  }
// Controller function to get all user data based on query parameters

exports.get_AllUsersData=async (req,res)=>{
    try{
          // Extract query parameters and remove excluded fields
      const excludefields=["sort","page","limit","fields"];
      const queryObj={...req.query};
      excludefields.forEach((el)=>{
        delete queryObj[el];
      })
          // Find users based on query
        const users=await User.find(queryObj);
        console.log(req.query);
        res.json({
            status:"success",
            length:users.length,
            data:{
                users
            }
        })
    }
    catch(err){
      res.json({
        status:"Failed",
        message:message.err
      })
    } 
}
// Controller function to get user data by ID
exports.get_UserData=async (req,res)=>{
    try{
        const users=await User.find({_id: req.params.id});
        res.json({
            status:"success",
            length:users.length,
            data:{
                users
            }
        })
    }
    catch(err){
      res.json({
        status:"Failed",
        message:message.err
      })
    } 
}


// Controller function to update user data by ID
exports.Update_Data=async (req,res)=>{
    try{
        const users=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        users.updated_at=currentDate.getTime();
        res.json({
            status:"success",
            length:users.length,
            data:{
                users
            }
        })
    }
    catch(err){
      res.json({
        status:"Failed",
        message:message.err
      })
    } 
}

// Controller function to delete user data by ID
exports.Delete_Data=async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.json({
            status:"success",
            length:users.length,
            data:null
        })
    }
    catch(err){
      res.json({
        status:"Failed",
        message:message.err
      })
    } 
}


// Controller function for user login
exports.login=async (req,res,next)=>{

  const {email_id,password}=req.body;
  //check if email & pasword is present in request body
  if(!email_id || !password)
  {
    const error="Please provide email ID & password for login in!";
    return error;
  }

  // check if user User exists with given mail
  const user = await User.findOne({email_id}).select('+password');
  // const isMatch= await user.comparePasswordInDb(password,user.password);
  // check if the user exits and password matches
  if(!user || !(await user.comparePassword(password)))
  {
    res.status(401).json({
      status:"Error",
      message:"incorrect email or password"
    })
    return next();
  }
  user.login_time=new Date();
  const token =signToken(user._id);
  res.json({
    status:'success',
    token,
     user
  })
}

// Controller function for user logout
exports.logout = async (req, res, next) => {
  // Assuming you are using JWT for authentication
  // You may need to clear the JWT token stored on the client side during logout
  const userId = req.body; // Assuming you have the user ID in the request object

  try {
    // Find the user by ID
  
    const user = await User.findById(userId);
    if(!user)
    {
      res.json({
        status: 'Failed',
        message: 'User does not exits',
      });
    }
    // Update the logout_time field
    user.logout_time = new Date();
    
    // Save the changes
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'User successfully logged out.',
    });
  } catch (err) {
    
    next(err);
  }
};

// ... (existing code)
