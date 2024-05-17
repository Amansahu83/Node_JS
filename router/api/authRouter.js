// routes.js
const express=require('express');
const userController=require('../../controllers/user');
const router = express.Router();
const passport=require('../../passport');
/**
 * @swagger
 *  components:
 *      schema:
 *          user:
 *              type: object
 *              properties:
 *                  id: 
 *                    type: integer
 *                  first_name:
 *                    type: string
 *                  last_name:
 *                    type: string
 *                  age:
 *                    type: integer
 *                  email_id:
 *                    type: string
 *                  password:
 *                    type: string
 */


/**
 * @swagger
 * /:
 *   get:
 *     summary: This API is used to check if the GET method is working or not.
 *     description: This API is used to check if the GET API is working or not.
 *     responses:
 *       200:
 *         description: To test the GET method.
 */


// Fetch data

/**
 * @swagger
 * /user:
 *  get:
 *      summary: To get data from mongodb
 *      description: this api is used to fetch data from mongodb
 *      responses:
 *          200:
 *              description: This api is used fetch data
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/user'
 */


/**
 * @swagger
 * /distinct/{columnName}:
 *  get:
 *      summary: To get distinct data 
 *      description: this api is used to fetch data from mongodb
 *      parameters:
 *          - in: path
 *            name: columnName
 *            required: true
 *            description: Column name is required
 *            schema:
 *               type: string
 *      responses:
 *          200:
 *              description: This api is used fetch data
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/user'
 */




// Documentation for post request
/**
 * @swagger
 * /user/sign_up:
 *  post:
 *      summary: used to insert data to mongodb
 *      description: this api is used to insert data in mongodb
 *      requestBody:
 *            required: true   
 *            content:
 *                  application/json:
 *                      schema:
 *                           $ref: '#components/schema/user'      
 *      responses:
 *          201:
 *              description: added successfully
 */


//Document for update data

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Used to update data in MongoDB
 *     description: This API is used to update data in MongoDB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 age:
 *                   type: integer
 */

// Documentation for delete data

/**
 * @swagger
 * /user/delete/{id}:
 *  delete:
 *      summary: used to delete record from mongodb
 *      description: this api is used to delete data in mongodb   
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Id is required
 *            schema:
 *               type: integer
 *      responses:
 *            200:
 *              description: Data is deleted
 */

// Documentation for login 
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate user and generate access token and refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_id:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns access token and refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *       401:
 *         description: Invalid username or password
 */


// Documentaion for refresh token
/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Refresh Access Token
 *     description: Generate a new access token using a refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *       401:
 *         description: Invalid refresh token
 */
router.get('/user',userController.get_UserData)
.get('/distinct/:columnName',userController.get_Distinct)
.get('/user',userController.get_filteredData)
.get('/groupby/:columnName',userController.get_GroupBy)
.get('/timestamp',userController.get_Time_Stamp)
.get('/max/:columnName',userController.get_max)
.post('/user/sign_up',userController.sign_up)
.post('/user/follow',userController.follow)
// .post('/refresh',userController.refreshToken)
.post('/user/login',passport.authenticate('local',{session:false}), userController.login)
// .post('/user/login',userController.login)
// .post('/user/login', )
.get('/user/profiles',passport.authenticate('jwt',{session:false}),userController.profiles)
.delete('/user/delete/:id',userController.delete)
.put('/user/update',userController.update)
.post('/user/logout',userController.logout);
module.exports = router;
