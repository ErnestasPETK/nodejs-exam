const dotEnv = require('dotenv').config();
const dotenvExpand = require('dotenv-expand');
dotenvExpand.expand(dotEnv);
const Joi = require('joi');

const userLoginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().required(),
});

const userRegisterSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    full_name: Joi.string().required(),
    password: Joi.string().required(),
    repeat_password: Joi.ref('password'),
}).with('password', 'repeat_password');

const accountsSchema = Joi.object({
    group_id: Joi.number().min(0).required(),
    user_id: Joi.number().min(0).required(),
});

const groupSchema = Joi.object({
    name: Joi.string().required(),
});

const billSchema = Joi.object({
    group_id: Joi.number().min(1).required(),
    amount: Joi.number().min(0.01).max(250).required(),
    description: Joi.string().required(),
});



const JWT_SECRET = process.env.JWT_SECRET;

const MYSQL_CONFIG = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT
};




module.exports = {
    MYSQL_CONFIG,
    userLoginSchema,
    userRegisterSchema,
    groupSchema,
    billSchema,
    accountsSchema,
    JWT_SECRET
}
