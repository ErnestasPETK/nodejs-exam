const express = require('express');
const { isLoggedIn } = require('..//middleware/middleware');
const mysql = require('mysql2/promise');
const { MYSQL_CONFIG, groupSchema } = require('../config');

const router = express.Router();


router.post("/", isLoggedIn, async (req, res) => {

    let { name } = req.body;
    let response;

    try {
        await groupSchema.validateAsync({ name })
    }
    catch (err) {
        return res.status(400).json({ message: err.details[0].message });
    }
    try {
        const connection = await mysql.createConnection(MYSQL_CONFIG);

        [response] = await connection.execute(`INSERT INTO groups (name) VALUES (${mysql.escape(name)})`);

        await connection.end();

        if (response.affectedRows === 1) {
            return res.status(201).send({ "message": "Group created" });
        }
        else if (response.affectedRows === 0) {
            return res.status(400).send({ "message": "Group already exists" });
        }
        else {
            return res.status(200).send({ "response": response });
        }
    }
    catch (err) {
        return res.status(404).send({ err: `Bad request  ${err}` });
    }
    xw
});


router.get("/", isLoggedIn, async (req, res) => {

    let response;
    try {
        const connection = await mysql.createConnection(MYSQL_CONFIG);

        [response] = await connection.execute(`SELECT * FROM groups`);

        await connection.end();

        return res.status(200).send({ "groups": response });
    }
    catch (err) {
        return res.status(404).send({ err: `Bad request  ${err}` });
    }



});


module.exports = router;