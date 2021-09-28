const express = require("express");
const app = express();
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
let mongoose = require('mongoose')
const CONNECTION_URL = "mongodb+srv://shubhamUser:pass12345@cluster0.fmezf.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "Sandbox";
const memjs = require('memjs');
const winston = require('winston');

const logConfiguration = {
    'transports': [
        new winston.transports.File({
            filename: 'logs/example.log'
        })
    ]
}

const logger = winston.createLogger(logConfiguration)

const client = memjs.Client.create('127.0.0.1:11211', {
    username: 'root',
    password: 'redhat@123'
  });    

let userDetailCollection 
let db

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));


app.listen(4000, () => {
 console.log("Server running on port 4000");

 


 MongoClient.connect(CONNECTION_URL, {
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    db = client.db('users')
    userDetailCollection = db.collection('userDetail')
    
  })
    
});

app.post('/users', async(req, res) => {

    try{
        const data = userDetailCollections.findOne({
            username:req.body.username
        })
        const dataArray = await userDetailCollection.find( { }).toArray()
        if(!data){
            userDetailCollection.insertOne(req.body)
          .then(result => {
            console.log(result)
            client.set('userDetails', JSON.stringify(dataArray));
            res.status(200).send("success")
          })
          .catch(error => {
            logger.error("Hello, Winston logger, the first error!")
            console.error(error)
          })
            
        }
        
        let query = {  username:req.body.username };
        let setVal = { $set: req.body };
        userDetailCollection.updateOne(query, setVal, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            client.set('userDetails', JSON.stringify(data))
            res.status(200).send("updated successfully")
          });
    }catch(err){
        logger.error(err)
        console.log(err);
    }
    
    
  })

  app.get('/users', async(req, res) => {

    try{
        const search = req.query.search
        // userDetailCollection.createIndex( { headline: "text", summary: "text" } )
        
        client.get('userDetails',  async(err, value, key) => {
            if(err) {
                logger.error(err)
                res.status(400).send("Bad Request")
            }
           
            if (values != null) {
                const resp = JSON.parse(value)
                const respData = resp.filter((val)=>{
                    return (val.headline.toLowerCase().includes(search.toLowerCase()) || val.summary.toLowerCase().includes(search.toLowerCase())) 
                })
                
                respData.length>0 ? res.status(200).json(respData) : []
            }else{
                const data = await userDetailCollection.find( { $text: { $search: search } }).toArray()
                if(!data){
                    res.status(404).send("not found")
                }
                res.status(200).json(data)
            }
        });
   
    }catch(err){
        logger.error(err)
        console.log(err);
    }
    
  })