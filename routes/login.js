var express = require('express');
var mysql = require('mysql2/promise');
var bcrypt = require('bcrypt');

var queryDB = require('../helper/queryDB');
var { createToken } = require('../helper/token');



var router = express.Router();

router.get('/login', async (req, res, next) => {
    if (!req.query.userName || !req.query.passWord) {
        res.status(400).send({ userData: null });
        return;
    }
    var query = `SELECT ID, PassWord_Encrypted FROM users WHERE UserName = ${mysql.escape(req.query['userName'])}`;
    try {
        var [rows] = await queryDB(query);
    } catch (err) {
        if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
        res.status(500).send();
    }
    if (!rows || rows.length == 0) {
        res.status(200).send({ userData: null });
        return;
    }
    try {
        var passWordResult = bcrypt.compare(req.query['passWord'], rows[0]['PassWord_Encrypted'])
    } catch (err) {
        if (process.env.DEBUG) { console.error('[ERROR]: ', err); }
        res.status(500).send();
    }
    if (!passWordResult) {
        res.status(400).send({ userData: null });
    }
    try {
        var userData = {
            userID: rows[0]['ID'],
            userName: req.query['userName'],
            token: createToken(rows[0]?.userID)
        };
    } catch (err) {
        if (process.env.DEBUG) { console.error("[ERROR]: ", err); }
        res.status(500).send();
    }
    res.status(200).send(userData);
});


module.exports = router;