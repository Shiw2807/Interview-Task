var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

// Connecting server to database
mongoose.connect('mongodb://localhost:27017/mydb',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

// Checking if connected
db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.post("/sign_up",(req,res)=>{
    var fname = req.body.fname;
    var lname= req.body.lname;
    var birth= req.body.birth;
    var email = req.body.email;
    var phno = req.body.phno;
    var address = req.body.address;

    var data = {
        "fname": fname,
        "lname": lname,
        "birth": birth,
        "email" : email,
        "phno": phno,
        "address" : address
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('signup_success.html')

})


app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
}).listen(3000);


// Fetching user details
app.get('/api/users', (req, res) =>{

    db.collection('users').find({}).toArray((err,result) => {
        if (err) throw err
         res.send(result)
    })
})
   

console.log("Listening on PORT 3000");