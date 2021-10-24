const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { query } = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://mydbpm:RD4d7hh4a9THehcI@cluster0.w0gjq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("productsManagement");
        const productsCollection = database.collection("products");

        // GET API

        app.get('/products', async (req, res) => {

            const cursor = productsCollection.find({})
            const products = await cursor.toArray();
            res.send(products);

        })

        // SINGLE GET API 

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productsCollection.findOne(query);
            // console.log("load user with id", id, productsCollection);
            res.send(product);
        })

        //UPDATED API

        app.put('/products/:id', async(req, res)=>{

            const id = req.params.id;
            const updateProduct = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert : true};
            const updateDoc = {
                $set:{
                    productName : updateProduct.productName,
                    productPrice : updateProduct.productPrice,
                    productQuantuty : updateProduct.productQuantuty
                }
            };
            const result = await productsCollection.updateOne(filter,updateDoc,options);
            console.log(req.body);
            res.json(result)

        })

        //DELETE API

        app.delete('/products/:id', async (req, res) => {

            const id = req.params.id;
            console.log(("delete product with id", id));
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);

        })

        // POST API 

        app.post('/products', async (req, res) => {

            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            console.log("got new user", req.body);
            console.log("added user", result);
            res.json(result)

        })





    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my product management')
})

app.listen(port, () => {
    console.log('Running server', port);
});
