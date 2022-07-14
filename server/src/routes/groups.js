const express = require('express');
const { isLoggedIn } = require('..//middleware/middleware');
const mysql = require('mysql2/promise');
const { MYSQL_CONFIG } = require('../config');

const router = express.Router();


router.get("/", isLoggedIn, async (req, res) => {

    try {
        const connection = await mysql.createConnection(MYSQL_CONFIG);

        [articles] = await connection.execute(`SELECT * FROM articles`);
        await connection.end();
        return res.status(200).send({ "articles": articles });

    }
    catch (err) {
        return res.status(404).send({ err: `Bad request  ${err}` });
    }



});


module.exports = router;