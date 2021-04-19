const express=require('express');
const mongoose=require('mongoose');
const config=require('config');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const swagger=require('./swagger');

const app=express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger.swaggerSpec)); //Swagger _setup

// Express Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

// DB Config
const db=config.get('mongoURI');

// Connect to Mongo
mongoose.connect(db,{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex:true,useFindAndModify: false })
    .then(()=>console.log('MongoDB Connected...'))
    .catch(err=>console.log(err))

// use route
app.use('/uploads',express.static('uploads'));
var indexRouter = require('./api/index');
app.use('/api',indexRouter);
app.use(function(err,req,res,next){
    res.status(422).json({error:err.errors})
})

const port=process.env.PORT || 5000;

app.listen(port, ()=>console.log(`server started on port ${port}`));