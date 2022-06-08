const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

function veryfyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, decoded)=>{
        if(err){
            return res.status(403).send({message: 'forbidden access'});
        }
        req.decoded = decoded 
        next();
    });
    console.log('inside verifyJWT', authHeader);
}
// const DB_USER = 'geniusUser';
// const DB_PASSWORD = 'Owd5AixUTA55Zd72';
const uri = `mongodb+srv://geniusCar2:jxNaB1USBlofevLB@cluster0.01i8p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);
async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('services');
        const ordersCollection = client.db('geniusCar').collection('orders');

        app.post('/login', async(req, res)=>{
            const user = req.body;
            console.log(user);
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.send({accessToken})
        })
        app.get('/service', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        })
        app.get('/service/:serviceId', async(req, res)=>{
            const id = req.params.serviceId;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })
        app.post('/service', async(req, res)=>{
            const newServices = req.body;
            const newResult = await serviceCollection.insertOne(newServices);
            res.send(newResult);
        })
        app.delete('/service/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
        // Order Collection API
        app.get('/orders', veryfyJWT, async(req, res) => {
            const authHeader = req.headers.authorization;
            const decodedEmail = req.body.email;
            const email = req.query.email;
            if(email === decodedEmail){
                const query = {email: email};
                const cursor = ordersCollection.find(query);
                const orders = await cursor.toArray();
                res.send(orders);
            }
            else{
                return res.status(403).send({message: 'forbidden access'})

            }
        })
        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        })
    }
    finally{

    };
}

run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('server is ready');
});

app.get('/hero', (req, res)=>{
    res.send('Hero meets heroku!');
});
app.get('/', (req, res)=>{
    res.send('server is running!');
});

app.listen(port, ()=>{
    console.log('server is running on port: ', port);
});