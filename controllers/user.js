const { sequelize, User ,Contact,Account} = require('../dbconnect');
const {Op}=require('sequelize');
const validate=require('validator');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
const passport=require('passport');

  const refreshTokens=[];
  const jwtSecret="this is jwt scret"
class usersController {
    static  async get_UserData(req, res) {
        try {
            const users = await User.findAll({
                // order:[['age','ASC']]
            });
            if(users)
            {
                res.status(200).json(users);
            }
            else 
            {
                res.status(404).json({
                    status:"fail",
                    message:"User not found"
                })
            }
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Bad Request' });
     
        }
    }          
    static async get_Distinct(req, res){
            try {
                const distinctEmails = await User.findAll({
                    attributes: [[sequelize.fn('DISTINCT', sequelize.col(req.params.columnName)), `distinct ${req.params.columnName}`]],
                });
                res.status(200).json(distinctEmails);
            } catch (error) {
                console.error(error);
                res.status(400).json({ error: 'Bad Request' });
         
            }

}

    static async get_filteredData(req,res){
try{
    const key = Object.keys(req.query)[0]; // Assuming there's only one key in the query string
    const value = req.query[key];

    const filteredUsers = await User.findAll({
        where: {
            [key]: { [Op.gte]: value}
        },
    });
    res.status(200).json(filteredUsers);
}catch(error){
    console.error(error);
    res.status(400).json({ error: 'Bad Request' });
}
}
    
    
    
    
    // const limitedUsers = await User.findAll({
    //     limit: 2, // Limit the result to 5 records
    //     offset: 1, // Skip the first 0 records
    // });
    // res.json(limitedUsers);
    
    
    // const betweenUsers = await User.findAll({
    //     where: {
    //         age: { [Op.between]: [20, 30] }, // Users aged between 20 and 30
    //     },
    // });
    // res.json(betweenUsers);
    
    
    
    // const likeUsers = await User.findAll({
    //     where: {
    //         first_name: { [Op.like]: 'A%' }, // Users with first name starting with 'A'
    //     },
    // });
    
    // res.json(likeUsers)
    
    
    
    
       // Group by and Having example
    //
    
    static async get_GroupBy(req,res){
        try{
            const groupedUsers = await User.findAll({
                    attributes: [req.params.columnName, [sequelize.fn('sum', sequelize.col(req.params.columnName)), `${req.params.columnName}count`]],
                    group: [req.params.columnName],
                    having: sequelize.where(sequelize.fn('COUNT', sequelize.col(req.params.columnName)), '>', 1),
                });
                 res.json(groupedUsers);
        }catch(error){
            console.error(error);
            res.status(400).json({ error: 'Bad Request' });
        }
    }
 
    
    
    
    static async get_max(req,res){
        try{
            const minMaxAgeUsers = await User.findAll({
                    attributes: [[sequelize.fn('MAX', sequelize.col(req.params.columnName)), 'MaxAge' ]],
                });
                res.json(minMaxAgeUsers);
        }catch(error){
            console.error(error);
            res.status(400).json({ error: 'Bad Request' });
        }
    }
       
    
    static async get_Time_Stamp (req,res){
        try{
        const timestampUser = await User.findAll({
        attributes: ['id','createdAt'],
        order: [['createdAt', 'DESC']],
    });
    res.json(timestampUser);
        }catch(error){
            console.error(error);
            res.status(400).json({ error: 'Bad Request' });
        }
    }
          
    // Timestamp example

    
    
    static async sign_up (req, res){
        try {
            let { first_name, last_name, age, email_id ,password} = req.body;
            if(validate.isEmail(email_id))
            {
                // User.beforeCreate(async (user, options) => {
                //     if (user.changed('password')) {
                //       try {
                //         // Ensure user.password is a string before hashing
                //         if (typeof user.password !== 'string') {
                //           throw new Error('Password must be a string');
                //         }
                                  //         user.password = await bcrypt.hash(user.password,12);

                //       } catch (error) {
                //         throw new Error(error);
                //       }
                //     }
                //   });
                password = await bcrypt.hash(password,12);
               const newUser = await User.create({ first_name, age,last_name,  email_id ,password});
                // const newcontact= await Contact.create({email_id,phone_no,userId:newUser.id});

                // const {Account_no}=req.body;
                // const userID=await User.findOne({where:{first_name:'aman'}});
                //  const newaccount=await Account.create({Account_no,phone_no,userId:userID.id});                console.log(token);

                res.status(201).json(
                    {
                        status:"Succes",
                        message:newUser,
                        // newcontact,
                    }
                );
            }
            else
            {
                res.status(400).json({
                    status:"fail",
                    message:"please provide valid email_id"
                })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static async follow  (req,res){
        try{
            const currentUser=await User.findOne({where:{first_name:'akash'}});
            const tofollowUser=await User.findOne({where:{first_name:'aman'}});
            currentUser.create(tofollowUser);
            res.json(currentUser);
        }catch(error){

        }
    }
    
    static async follow  (req,res){
        try{
            const currentUser=await User.findOne({where:{first_name:'akash'}});
            const tofollowUser=await User.findOne({where:{first_name:'aman'}});
            currentUser.create(tofollowUser);
            res.json(currentUser);
        }catch(error){

        }
    }
   static  async  login(req, res) {
        // Extract email and password from request body
        const { email_id, password } = req.body;
    
        try {

            if(!email_id && !password)
            {
              return res.status(400).json({ error: 'Email ID and password are required' });
            }

            if (!email_id) {
                return res.status(400).json({ error: 'Email ID is required' });
              }
              else if (!password) {
                return res.status(400).json({ error: 'Password is required' });
              }   
              
              
            // Check if the email exists in the database
            const user = await User.findOne({ where: { email_id } });
            // If the user does not exist or the password is incorrect, respond with an error
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

                   
         
            // If the email and password are correct, generate a JWT token
            const token = jwt.sign({ email_id: user.email_id }, jwtSecret, { expiresIn: '1h' });
    
            // Respond with a success message and the JWT token
            res.json({
                status: 'success',
                token,
                message: 'User login successful'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


static async profiles(req,res){
    try {
        // Get user information from request object after authentication
        const { email_id, first_name, last_name, age } = req.user;
        console.log(email_id);
        // Respond with the user's profile information
        res.json({
          status: 'success',
          profile: {
            email_id,
            first_name,
            last_name,
            age
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }    
}
//    static async refreshToken (req,res){
//     const {refreshToken}=req.body;
//     if(!refreshTokens.includes(refreshToken)){
//         res.status(401).json({error:"Invalid refresh token"})
//     }
//     const decoded = jwt.verify(refreshToken, jwtSecret);
//     const email_id = decoded.email_id;
//     const accessToken = jwt.sign({ email_id }, jwtSecret, { expiresIn: '15m' });
//     res.json({accessToken})
//    }



   static async delete(req,res){
        try{
            const deletedUser = await User.destroy({
                where: { id: req.params.id },
            });
            if(deletedUser==1)
         {
            res.status(200).json({
                status:"success",
                message:"User deleted"
            })
         }
         else{
            res.status(404).json({
                status:"fail",
                message:"User not found"
            })
         }
        }catch(error){
            console.log(error);
            res.status(400).json({
                status:"fail",
                message:'Bad reqest'+ error
            })
        }
    }
   static async update (req,res){
        try{
            
            const updatedUser = await User.update(
                { age: req.body.age },
                { where: { id: req.body.id } }
            );
         if(updatedUser==1)
         {
            res.status(200).json({
                status:"success",
                message:"updated"
            })
         }
         else{
            res.status(404).json({
                status:"fail",
                message:"User not found"
            })
         }
            
        }catch(error){
            console.log(error);
            res.status(400).json({
                status:"fail",
                message:'Bad reqest'+ error
            })
        }
    }

    static logout (req, res) {
        // Check if the user is authenticated
        if (req.isAuthenticated()) {
            // Call req.logout() to clear the login session
            req.logout();
            // Respond with a JSON message indicating successful logout
            res.status(200).json({ message: 'Logout successful' });
        } else {
            // If the user is not authenticated, respond with an error message
            res.status(401).json({ message: 'User is not authenticated' });
        }
    };

   
}


    


module.exports=usersController;