
const express=require('express');
const userController=require('../Controller/userController')
const router=express.Router();

// Define routes
router.get('/user/:id',userController.get_UserData)
.get('/users',userController.get_AllUsersData)
.post('/Sign_up', userController.Sign_up)
.post('/login', userController.login)
.post('/logout', userController.logout)
.patch('/user/:id', userController.Update_Data)
.delete('/user/:id', userController.Delete_Data);


module.exports=router;