const mysql = require('mysql');

const conn = mysql.createConnection({
    host: '172.20.5.1',
    user: 'root',
    password: '**123**GTPay',
    database: 'gtpay',
    port: '3306'
});
conn.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("SQL CONNECTED");
});



const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const { use } = require('express/lib/application');
const morgan = require('morgan')
app.use(morgan('combined'))


app.set("view engine", "ejs");
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.render("main");
    // res.sendFile(path.join(__dirname, '/main.html'));
});

app.post('/', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    const query = `SELECT * FROM users WHERE email='${email}' AND password='${password}';`;
    // ' OR '1'='1
    // ' OR password like '1%
    // ' OR 1=1-- 
    // ' OR password like '%1%
    conn.query(query, (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.log("Query Executed Successfully")
            console.log(rows)
            console.log(query);

            if (Object.keys(rows).length > 0) {
                res.render("main", { email: email, password: password, success: 1, row: query });
            }else {
                res.render("main", { email: email, password: password, success: 0, row: query });
            }
            
        }
    })

    // res.end("User name = "+user_name+", password is "+password);

});

var SplunkLogger = require("splunk-logging").Logger;

var config = {
    token: "c8edeac1-1458-4fa4-978b-a0143bbd6f07",
    url: "http://172.20.4.2:8088"
};

var Logger = new SplunkLogger(config);

var payload = {
    // Message can be anything; doesn't have to be an object
    message: {
        temperature: "70F",
        chickenCount: 500
    }
};

console.log("Sending payload", payload);
Logger.send(payload, function(err, resp, body) {
    // If successful, body will be { text: 'Success', code: 0 }
    console.log("Response from Splunk", body);
});

app.listen('80', () => {
    console.log("server started on port 3000")
})
