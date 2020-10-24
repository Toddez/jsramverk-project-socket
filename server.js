const express = require('express');
const app = express();

require('dotenv').config();

const cors = require('cors');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const db = require('./db/database.js');
const ObjectId = require('mongodb').ObjectID;

const port = process.env.SOCKET_PORT || 3001;

let stocks = {};

(async () => {
    await db.connect();

    app.use(cors());
    io.origins('*:*');

    const collection = db.client().db('project').collection('stocks');

    collection.find().toArray((err, res) => {
        if (err) {
            return;
        }

        res.forEach((stock) => {
            stocks[stock._id] = stock.value;
        });
    });

    io.on('connection', (socket) => {
        socket.on('stock connect', (message) => {
            collection.findOne({ _id: new ObjectId(message.id) }, (err, stock) => {
                if (err) {
                    return;
                }

                if (!stock) {
                    return;
                }

                const filtered = stock.value.filter((value) => {
                    if (value) {
                        const now = new Date();
                        return Math.abs(now - new Date(value.date)) / 3.6e6 <= 5;
                    }
                });

                socket.emit('stock correction', { id: message.id, value: filtered, name: stock.name });
            });
        });
    });

    setInterval(() => {
        for (const key in stocks) {
            if (stocks[key]) {
                const value = stocks[key];

                const newValue = value[value.length - 1].value + (Math.random() > 0.5 ? 1 : -1);
                const data = {
                    date: new Date().toISOString(),
                    value: Math.max(0, newValue)
                };

                stocks[key].push(data);

                collection.updateOne({ _id: new ObjectId(key) }, {
                    $push: {
                        value: data
                    }
                }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });

                io.emit('stock update', { id: key, value: data });
            }
        }
    }, 30000);

    server.listen(port, () => {
        console.log(`Running socket server on port ${port}`);
    });
})();
