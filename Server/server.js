const express= require('express');
const jwt=require('jsonwebtoken');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const cors =require('cors');

const app= express();

app.use(cors());

app.use(bodyParser.json());

const db="mongodb+srv://prat:prat@cluster0.zlfyb.gcp.mongodb.net/test";
mongoose.connect(db,(err)=>{
    if(err){
        console.log('Error!'+ err)
    }else{
        console.log('----connected to mongoDB-------')
    }
});
const PORT = 3001

app.get('/',(req,res)=>{
    res.send('Hello from server');
    
})


app.listen(PORT, ()=>{
    console.log('server running on localhost'+ PORT);
    
})


const login=require('./models/login');


function verifyToken(req, res, next) {
    console.log('*******');
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    //extract the token value from bearer token 
    let token = req.headers.authorization.split(' ')[1]
   
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }

    let payload = jwt.verify(token, 'secretKey')
 
 
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }

    req.userId = payload.subject
    next()
    
  }
  app.post('/signup',(req,res)=>{

    console.log(req.body);
    console.log("--------------");
    console.log('------------------------------------------')
    let userData= req.body;
    let user=new login(userData);

    user.save((error,registeredUser)=>{
        if(error){
            console.log('---------error bolte public-----------')
            console.log(error);

        }else{
         
            console.log("data inserted into the database");
            res.status(200).send(true);
        }
    })
})
app.post('/login',(req,res)=>{
    console.log('|||||||||||||||||||||||||||||||');

    let userData=req.body;
    console.log(userData);
    login.findOne({email: userData.email},(error,user)=>{
        console.log(user.password);
        if(error){
            console.log(error);
          }
        else{
            if(!user){
                res.status(401).send('invalid email')
            }else{
                if(user.password !== userData.password){
                    res.status(401).send('Invalid password')
                }else{
                    console.log('||||||------- its here')
                   
                    let payload = {subject: user._id};
                    let token=jwt.sign(payload,'secretKey')
                    res.status(200).send({token, user1: user});

                    

                }
            }
        }
    })
})
