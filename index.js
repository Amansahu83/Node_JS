const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const swaggerJSDoc =require('swagger-jsdoc')
const swaggerUi=require('swagger-ui-express')
// const pgSession = require('connect-pg-simple');
require('./passport')
// GET all users


app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


const options={
    definition:{
        openapi :'3.0.0',
        info:{
            title: 'Node js API project for mongodb',
            version:'1.0.0'
        },
        servers:[
            {
               url: 'http://localhost:8080/'
            },
        ],
    },
    apis: ['./router/api/authRouter.js']
};

const swaggerSpec=swaggerJSDoc(options)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));

const port = 8000;
app.use(express.json());
app.use(require('./router'));
app.listen(port, () => {
    console.log("app is listening on " + port);
});

module.exports=app;