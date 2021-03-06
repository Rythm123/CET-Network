require('dotenv').config();
const express=require("express");

const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const session=require("express-session");


const dbuser=process.env.DB_USER;
const dbuserpass=process.env.DB_USERPASS;
//////////////////////////////////////////////////////////////////////////////////////////
//Connecting mongoDB to our aplication.

mongoose.connect(`mongodb+srv://${dbuser}:${dbuserpass}@cetnetwork.y0rl4.mongodb.net/cetNetworkDB`,{useNewUrlParser:true,useUnifiedTopology:true});

const adminreqSchema={
    name:String,
    email:String,
    year:String,
    thoughts:String
}

const Adminreq=mongoose.model("adminreq",adminreqSchema);


const ebookSchema={
    subject:String,
    year:String,
    link:String
};

const Ebook=mongoose.model("ebook",ebookSchema);

const adminSchema={
    username:String,
    password:String
};

const Admin=mongoose.model("admin",adminSchema);

const admin1=new Admin({
    username:"rythm123",
    password:"qwerty"
});

const admin2=new Admin({
    username:"rohit",
    password:"rohit123"
});

const allAdmins=[admin1,admin2];

// This is to add admins explicitely for the first time.



////////////////////////////////////////////////////////////////////////////////////////////

const app=express();

app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session(
    {secret:"MyProject",
    resave:false,
    saveUninitialized:false
    }
    ));



app.get("/",function(req,res){

    res.render("home",{   
        authtoken:req.session.loginfo
    });
    
});

app.get("/first",function(req,res){

    Ebook.find({year:"first"},function(err,foundList){
        console.log(foundList);
        console.log(req.session.loginfo)
        res.render("year",
        {year:"first",
        authtoken:req.session.loginfo,
        mySubs:foundList}
    );
    });
    
});

app.get("/second",function(req,res){
    Ebook.find({year:"second"},function(err,foundList){
        console.log(foundList);
        res.render("year",
        {year:"second",
        authtoken:req.session.loginfo,
        mySubs:foundList}
    );
    });
})
app.get("/third",function(req,res){
    Ebook.find({year:"third"},function(err,foundList){
        console.log(foundList);
        res.render("year",
        {year:"third",
        authtoken:req.session.loginfo,
        mySubs:foundList}
    );
    });
})
app.get("/fourth",function(req,res){
    Ebook.find({year:"fourth"},function(err,foundList){
        console.log(foundList);
        res.render("year",
        {year:"fourth",
        authtoken:req.session.loginfo,
        mySubs:foundList}
    );
    });
})

app.get("/upload" ,function(req,res){
    if(req.session.loginfo===true){
        res.render("upload");
    }
    else{
        console.log("User is not authenticated");
        res.redirect("/adminlogin");
    }
    
});


app.get("/adminlogin",function(req,res){
    res.render("adminLogin",{errormessage:"",error:false});
});

app.post("/adminaccess",function(req,res){
    console.log("helo")
    const name=req.body.adminname;
    const email=req.body.adminemail;
    const year=req.body.ayear;
    const thoughts=req.body.athoughts;

    adminreq=new Adminreq({
        name:name,
        email:email,
        year:year,
        thoughts:thoughts
    });
    const allAdmins=[adminreq]

    Adminreq.insertMany(allAdmins,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Admin request has been submitted");
        }

    })

    console.log(name,email,year);
    console.log("Data recieved");

    res.redirect("/");
});


app.post("/adminlogin",function(req,res){
    ssn=req.session;
    const username=req.body.username;
    const password=req.body.password;

    Admin.findOne({username:username},function(err,foundAdmin){
        if(err){
            console.log(err);

        }
        else if(foundAdmin){
            if(foundAdmin.password===password){
                req.session.loginfo=true;
                req.session.save();
                console.log("Session log info is changed to " + req.session.loginfo);
                res.redirect("/");
            }
            else{
                res.render("adminlogin",{errormessage:"Wrong Password",error:true});
            }
        }
        else{
            res.render("adminLogin",
            {errormessage:"No such user found",
            error:true});
        }

    })
    
})



app.post("/upload",function(req,res){
    console.log(req.body);
    const ebookuploaded=new Ebook({
        subject:req.body.Subject,
        year:req.body.year,
        link:req.body.Link

    });
    ebookuploaded.save();
    res.redirect("/")
});


app.post("/delete",function(req,res){
    let tobedeleted=req.body.delbutton;
    Ebook.findByIdAndRemove(tobedeleted,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Successfully Deleted that item");
        }
    });
    res.redirect('back');
});


app.post("/logout",function(req,res){
    req.session.loginfo=false;
    req.session.destroy();
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("Server started at port 3000");
});




