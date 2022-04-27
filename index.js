const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// const DB_USER = 'geniusUser';
// const DB_PASSWORD = 'Owd5AixUTA55Zd72';
const uri = `mongodb+srv://geniusCar2:jxNaB1USBlofevLB@cluster0.01i8p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);
async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('services');
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
            res.send(result)
        })
    }
    finally{
0
    }
}

run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('server is ready')
})

app.get('/', (req, res)=>{
    res.send('server is running!')
})

app.listen(port, ()=>{
    console.log('server is running on port: ', port);
})