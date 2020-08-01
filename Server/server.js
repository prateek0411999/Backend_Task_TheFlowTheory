const express= require('express');
const jwt=require('jsonwebtoken');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const cors =require('cors');
const multer=require('multer');
const app= express();
const swaggerJsDoc=require('swagger-jsdoc');
const swaggerUi=require('swagger-ui-express');
const uploader= require('./models/uploader');


  
app.use(bodyParser.json());

app.use(cors({
    origin: function(origin, callback){
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
  }));

//connecting the database
const db="mongodb+srv://prat:prat@cluster0.zlfyb.gcp.mongodb.net/TheFlowTheory";
mongoose.connect(db, { useNewUrlParser: true },(err)=>{
    if(err){
        console.log('Error!'+ err)
    }else{
        console.log('----connected to mongoDB-------')
    }
});

var obj={
    email: String,
    attachedimages: [{ 
    originalname: String,
    uploadname: String
}]
    
}
//Extended: https://swagger.io/specification/#infoObject
const swaggerOptions={
    swaggerDefinition:{
    info: {
        title: 'TheFlowTheory API',
        description: "API informations",
        contact: {
            name: "Prateek Sharma"
        },
        servers: ["http://localhost:3001"]
    }
},
    apis: ["server.js"]
};
const swaggerDocs= swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


var store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './uploads');
    },
    filename:function(req,file,cb){
        cb(null, Date.now()+'.'+file.originalname);
    }
});


var upload = multer({storage:store}).single('file');
//var upload = multer({storage:store}).array('file',5);



app.post('/upload',function(req,res,next){
    upload(req,res,function(err){
        if(err){
            return res.status(501).json({error:err});
        }
        //do all database record saving activity
        console.log('!!!!!!!!!')
        console.log(req.file.filename);
        return res.sendFile( __dirname + "/uploads/" + req.file.filename );
        //return res.send("uploaded");
    });
});


const PORT = 3001

/**
 *  @swagger
 *  /:
 *  get:
 *      description: checking the server 
 *      responses:
 *        '200':
 *           description: A successful request
 */
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

  /**
 *  @swagger
 *  /signup:
 *  post:
 *      description: User signing up and saving it's data to mongodb atlas 
 *      responses:
 *        '200':
 *           description: A successful request
 */
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


let aa;
/**
 *  @swagger
 *  /login:
 *  post:
 *      description: User loggin in  
 *      responses:
 *        '200':
 *           description: A successful request
 */
app.post('/login',(req,res)=>{
    console.log('|||||||||||||||||||||||||||||||');

    let userData=req.body;
    console.log(userData);
    aa=userData.email;
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
/**
 *  @swagger
 *  /getsigned:
 *  get:
 *      description: verifying the token and sending the email of authenticated user 
 *      responses:
 *        '200':
 *           description: A successful request
 */
app.get('/getsigned',verifyToken,(req,res)=>{
    console.log("token verified");
    console.log(aa);
    res.status(200).json(aa);
})

