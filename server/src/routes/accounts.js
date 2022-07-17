const express = require('express');
const { isLoggedIn } = require('..//middleware/middleware');
const mysql = require('mysql2/promise');
const { MYSQL_CONFIG, accountsSchema } = require('../config');

const router = express.Router();


router.post("/", isLoggedIn, async (req, res) => {

    let { groupId: group_id } = req.body;
    let { id: user_id } = req.user;
    let response;

    try {
        await accountsSchema.validateAsync({ group_id, user_id });
    }
    catch (err) {
        return res.status(400).json({ message: err.details[0].message });
    }

    try {
        const connection = await mysql.createConnection(MYSQL_CONFIG);

        [response] = await connection.execute(`INSERT INTO accounts (group_id, user_id) SELECT ${mysql.escape(group_id)},'${mysql.escape(user_id)}' FROM (SELECT 1 as dummy) s WHERE NOT EXISTS (SELECT group_id, user_id FROM accounts WHERE accounts.group_id = ${mysql.escape(group_id)} AND accounts.user_id = '${mysql.escape(user_id)}');`);
        await connection.end();

        if (response.affectedRows === 1) {
            return res.status(201).send({ "message": "Account created" });
        }
        else if (response.affectedRows === 0) {
            return res.status(400).send({ "message": "Account has already been added" });
        }
        else {
            return res.status(200).send({ "response": response });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(404).send({ err: `Bad request  ${err}` });
    }
});


router.get("/", isLoggedIn, async (req, res) => {

    let { id: user_id } = req.user;

    let response;



    try {
        const connection = await mysql.createConnection(MYSQL_CONFIG);

        [response] = await connection.execute(`SELECT * FROM accounts LEFT JOIN groups ON accounts.group_id = groups.id WHERE accounts.user_id = ${mysql.escape(user_id)}`);

        await connection.end();

        if (response.length === 0) {
            return res.status(404).send({ "message": "No accounts found" });
        }
        else {
            return res.status(200).send({ "accounts": response });
        }
    }
    catch (err) {
        return res.status(404).send({ err: `Bad request  ${err}` });
    }



});


module.exports = router;