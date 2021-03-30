const swaggerJSDoc = require("swagger-jsdoc");
const express = require("express");
const app = express();

const swaggerDefinition={
    info:{
        swagger:'3.0',
        title:"Grocery Shop",
        description:"Grocery Shop APIs"
    },
    host:"localhost:5000",
    basePath:'/api',
    securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          scheme: 'jwt',
          in: 'header',
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./api/*.js'],
};

module.exports.swaggerSpec  = swaggerJSDoc(options);
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});