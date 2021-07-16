const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const session=require("express-session");
// var ssn.ssn.loggedin=false;
var ssn;
var loggedIn=false;

mongoose.connect("mongodb://localhost:27017/cetNetworkDB",{useNewUrlParser:true,useUnifiedTopology:true});


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


// Admin.insertMany(allAdmins,function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("Successfully added a new admin");
//     }

// })

const ebook1=new Ebook({
    subject:"Maths",
    year:"first",
    link: "https://getbootstrap.com/docs/4.5/components/card/"

});

const ebook2 = new Ebook({
    subject: "Physics",
    year: "second",
    link: "https://www.youtube.com/"

});

const defaultebooks=[ebook1,ebook2];

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

    // Ebook.find({},function(err,foundList){
    //     if(foundList.length===0){
    //         Ebook.insertMany(defaultebooks,function(err){
    //             if(err){
    //                 console.log(err);
    //             }
    //             else{
    //                 console.log("Successfully added the ebooks")
    //             }
    //         });
    //         res.redirect("/");
    //     }
    //     else{
    //         res.render("home",{
    //             authtoken:ssn.ssn.loggedin
    //         });
    //     }
    // })
    res.render("home",{
        
        authtoken:req.session.loginfo
    });
    
});

app.get("/first",function(req,res){

    Ebook.find({year:"first"},function(err,foundList){
        console.log(foundList);
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
// app.get("/third",function(req,res){
//     res.render("year",
//         {year:"third",
//     mySubs:cards}
//     );
// })
// app.get("/fourth",function(req,res){
//     res.render("year",
//         {year:"fourth",
//     mySubs:cards}
//     );
// })

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
    res.render("adminLogin");
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
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("Server started at port 3000");
});




const cards=[
    {
        subject: "CPP",
        year: "third",
        link: "https://www.youtube.com/"

    },

    {
        subject:"Chemistry",
        year: "fourth",
        link: "sdhfsdkjslkdjf.com"
    }
]