const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4141;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
app.use(cors());
app.use(bodyParser.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e0fhg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const productCollection = client.db("emaJohnStore").collection("products");
    const orderCollection = client.db("emaJohnStore").collection("orders");
    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productCollection.insertOne(products)
            .then(result => {
                res.send(result.insertedCount);
        })
    });
    app.get('/products',(req,res)=>{
        productCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    })
    app.get('/product/:key',(req,res)=>{
        productCollection.find({key:req.params.key})
        .toArray((err,documents)=>{
            res.send(documents[0]);
        })
    })
    app.post('/productsByKeys',(req,res)=>{
        const productKeys = req.body;
        productCollection.find({key:{$in: productKeys}})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
        })
    });
    console.log('Success!');
});



app.get('/', (req, res) => {
    res.send('Welcome To ema-john-app');
})

app.listen(PORT);