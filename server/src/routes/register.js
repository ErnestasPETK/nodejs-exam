const mysql = require('mysql2/promise');
const express = require('express');

const { MYSQL_CONFIG, userSchema } = require('../config');

const router = express.Router();

const bcrypt = require('bcryptjs');



router.post("/", async (req, res) => {

    let userData = req.body;
    let response;
    try {

        userData = await userSchema.validateAsync(userData);
    }
    catch (err) {
        return res.status(400).send({ err: `Bad request  ${err}` });
    }

    try {

        const hashedPassword = bcrypt.hashSync(userData.password);
        const connection = await mysql.createConnection(MYSQL_CONFIG);

        response = await connection.execute(`INSERT INTO users (email, password) VALUES (${mysql.escape(userData.email)}, '${hashedPassword}')`);
        await connection.end();
        return res.status(200).send("OK");


    } catch (err) {
        return res.status(404).send({ err: `Bad request  ${err}` });
    }

});


module.exports = router;
