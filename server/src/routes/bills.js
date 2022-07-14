const express = require('express');
const { isLoggedIn } = require('..//middleware/middleware');
const mysql = require('mysql2/promise');
const { MYSQL_CONFIG, billSchema } = require('../config');

const router = express.Router();


router.post("/", isLoggedIn, async (req, res) => {

    let { groupId: group_id, amount, description } = req.body;
    let response;

    try {
        await billSchema.validateAsync({ group_id, amount, description })
    }
    catch (err) {
        return res.status(400).json({ message: err.details[0].message });
    }

    try {
        const connection = await mysql.createConnection(MYSQL_CONFIG);

        [response] = await connection.execute(`INSERT INTO bills (group_id, amount, description) VALUES (${mysql.escape(group_id)}, ${mysql.escape(amount)}, ${mysql.escape(description)})`);

        await connection.end();

        if (response.affectedRows === 1) {
            return res.status(201).send({ "message": "Bill created" });
        }
        else if (response.affectedRows === 0) {
            return res.status(400).send({ "message": "Failed to create bill" });
        }
        else {
            return res.status(200).send({ "response": response });
        }
    }
    catch (err) {
        return res.status(404).send({ err: `Bad request  ${err}` });
    }
});


router.get("/:groupId", isLoggedIn, async (req, res) => {

    let { groupId: group_id } = req.params;

    let response;

    try {
        const connection = await mysql.createConnection(MYSQL_CONFIG);

        [response] = await connection.execute(`SELECT * FROM groups LEFT JOIN bills ON groups.id = bills.group_id WHERE groups.id = ${mysql.escape(group_id)}`);

        await connection.end();

        if (response.length === 0) {
            return res.status(404).send({ "message": "No bills found" });
        }
        else {
            return res.status(200).send({ "bills": response });
        }
    }
    catch (err) {
        return res.status(404).send({ err: `Bad request  ${err}` });
    }



});


module.exports = router;