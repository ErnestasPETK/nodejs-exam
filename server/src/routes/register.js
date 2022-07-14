const mysql = require('mysql2/promise');
const express = require('express');

const { MYSQL_CONFIG, userRegisterSchema } = require('../config');

const router = express.Router();

const bcrypt = require('bcryptjs');



router.post("/", async (req, res) => {

    let userData = req.body;
    let response;
    try {

        userData = await userRegisterSchema.validateAsync(userData);
    }
    catch (err) {

        return res.status(400).send({ err: `Bad request  ${err}` });
    }

    try {

        const hashedPassword = bcrypt.hashSync(userData.password);
        const connection = await mysql.createConnection(MYSQL_CONFIG);
        const registerTimestamp = new Date();
        response = await connection.execute(`INSERT INTO users (full_name, email, password, reg_timestamp) VALUES (${mysql.escape(userData.full_name)}, ${mysql.escape(userData.email)}, '${hashedPassword}', ${mysql.escape(registerTimestamp)})`);
        await connection.end();
        return res.status(200).send("OK");


    } catch (err) {
        console.trace("Error: ", err);
        console.log(err);

        return res.status(404).send({ err: `Bad request  ${err}` });
    }

});


module.exports = router;
