const mysql = require('mysql2/promise');
const express = require('express');
const jwt = require('jsonwebtoken');

const { MYSQL_CONFIG, userLoginSchema, JWT_SECRET } = require('../config');

const router = express.Router();

const bcrypt = require('bcryptjs');


router.post("/", async (req, res) => {

    let userData = req.body;
    let response;
    try {

        userData = await userLoginSchema.validateAsync(userData);
    }
    catch (err) {
        return res.status(400).send({ err: `Incorrect email or password  ${err}` });
    }

    try {

        const connection = await mysql.createConnection(MYSQL_CONFIG);

        [response] = await connection.execute(`SELECT * FROM users WHERE email = ${mysql.escape(userData.email)}`);
        await connection.end();
        if (response.length === 0) {
            return res.status(404).send({ err: `Incorrect email or password  ${err}` });
        }

        const isAuthed = bcrypt.compareSync(userData.password, response[0].password);
        return isAuthed ? res.status(200).send({ msg: "Successfully logged in", token: jwt.sign({ id: response[0].id, email: response[0].email }, JWT_SECRET) }) : res.status(404).send({ err: `Incorrect email or password  ${err}` });


    } catch (err) {
        return res.status(404).send({ err: `Bad request  ${err}` });
    }

});


module.exports = router;
