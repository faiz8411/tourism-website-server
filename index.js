const express = require('express')
const app = express()
const cors = require("cors")
require('dotenv').config()
const ObjectId = require("mongodb").ObjectId

const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wusl0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri)
async function run() {
    try {
        await client.connect()
        // console.log('data connct sucessfully ')
        const database = client.db('tourism_database')
        const serviceCollection = database.collection('service')
        const bookingCollection = database.collection("booking")
        // addService
        app.post('/addService', async (req, res) => {
            console.log(req.body)
            const result = await serviceCollection.insertOne(req.body)
            res.send(result)
        });
        // get all service
        app.get("/allServices", async (req, res) => {
            const result = await serviceCollection.find({}).limit(6).toArray();
            res.send(result);
            // console.log(result);
        });
        // single service
        app.get("/singleProduct/:id", async (req, res) => {
            const result = await serviceCollection.find({ _id: ObjectId(req.params.id) })
                .toArray();
            res.send(result[0]);
        });

        app.post('/confirmOrder', async (req, res) => {
            const result = await bookingCollection.insertOne(req.body)
            res.send(result)
        })
        app.get("/orders", async (req, res) => {
            let query = {}
            const email = req.query.email
            if (email) {
                query = { email: email }
            }
            const result = await bookingCollection.find({}).toArray()
            res.send(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello travel lover')
})

app.listen(port, () => {
    console.log(`Example app listening at${port}`)
})