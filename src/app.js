import express from 'express';
import path from 'node:path';
import nunjucks from 'nunjucks';
import mongoose from './config/dao.js';
import Car from './models/car.js';
import Pin from './models/pincode.js';
import Admin from './models/admin.js';
import cc from "./controllers/allcars.js";
import session from 'express-session';
import bodyParser from 'body-parser';

import passport from 'passport';
import local from 'passport-local';
import { title } from 'node:process';
const LocalStrategy=local.Strategy;


const db=mongoose.connection;

const app=express();
const port=process.env.PORT || 8080;

app.set('trust proxy', 1); 
  
app.use(session({
      secret:"session",
      resave:false,
      saveUninitialized:true,
      cookie:{secure:false}
}))


app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: false })); 

// app.use(express.text());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));


app.use(express.static(path.resolve('src/public')));
app.use(express.static(path.resolve('node_modules/bootstrap/dist')));


/* passport configuration */

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function (user, done) {
    done(null, user[0]._id);
});
passport.deserializeUser(function (user, next) {
    next(null, user);
});

passport.use('local', new LocalStrategy((username, password, done) => {
    
    Admin.find({ username: username }).then(user=>{
      if( user.length==0 ){
          return done(null, null, { message: 'No user found!' });
      }
      else  if (user[0].password !== password) {
          return done(null, null, { message: 'Password is incorrect!' });
      }
      else{
          return done(null, user, null);
      }
      })

  }
));

 function isAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
      } else {
        res.status(403).render('login.html',{title:"Forbidden",msg:"Forbidden"});
      }
  }
  



// configure
nunjucks.configure(path.resolve("src/public/views"),{
     express:app,
     autoscape:true,
     noCache:false,
     watch:true
});

app.get("/",(req,res)=>{
     res.status(200).render("index.html",{title:"nunjucks"});
});

app.get("/about",(req,res)=>{
     res.status(200).render("about.html",{title:"about us"});
});

app.get("/login",(req,res)=>{
     res.status(200).render("login.html",{title:"Login admin"});
});
app.post("/login",(req,res)=>{
     passport.authenticate('local',  (err, user, info) =>{
          if (err) {
            res.render('login.html', { error: err, });
          } 
          else if (!user) {
            res.render('login.html', { errorMessage: info.message, title:"Invalid Credentials" });
          } 
          else {
            //setting users in session
            req.logIn(user, function (err) {
              if (err) {
                res.render('login.html', { error: err, title:"unable to login"   });
              } else {
               // res.render('admin.html',{ name:user[0].username, title:"Admin",time:new Date().toLocaleString()});
               res.redirect("/admin");
               }
            })
          }
        })(req, res);

});

app.get("/admin", isAuthenticated ,(req,res)=>{
     res.status(200).render("admin.html",{title:"Admin",time:new Date().toLocaleString()});
});

//  app.get('/logout', (req, res) => { 
//       if (req.session) {
//           req.session.destroy((err)=> {
//             if(err) {
//               return next(err);
//             } else {
//                 res.clearCookie('connect.sid');
//                 req.logout(()=>{});
//                 if (!req.user) { 
//                     res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
//                     // res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//                 }
//                 res.render('login.html',{ msg:"Logout Successfully"});
//             }
//           });
//         }
//   });


app.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
     else{
          res.status(200).render("logout.html",{title:"Logout"});
     }
  });
});

app.get("/contact",(req,res)=>{
     res.status(200).render("contact.html",{title:"contact us"});
});

// function authMiddleware(req,res,next){
//      if(req.query.admin==="avi" && req.query.password==="avi2012"){
//           next();
//      }
//      else{
//           res.status(403).send("Access denied");
//      }
// }

// app.get("/add",authMiddleware,(req,res)=>{
//      res.status(200).render("add.html",{title:"Add Cars"});
// });

app.post("/addcar/",(req,res)=>{
     const{name,type,price}=req.body;

     res.status(200).render("add.html",{title:"Add Cars",msg:"Car added successfully"});
     
})



app.get("/cars/",(req,res)=>{
     Car.find({},{_id:0,__v:0}).then(i=>{
          res.status(200).render("cars.html",{title:"Cars Page",data:i});
     }).catch(e=>{
          res.status(200).render("cars.html",{title:"Cars Page",data:e});
     });
});

app.get("/cars/:car",(req,res)=>{
     const p=req.params.car;
     const q=p.replace("-"," ");
     // res.status(200).render("car.html",{title:p});
      Car.find({name:q},{_id:0,__v:0}).then(i=>{
     if(i.length){
          res.status(200).render("car.html",{title:i[0].name, data:i});
     }
     else{
          res.status(200).render("car.html",{title:"Car Not Found"});
     }

     }).catch(e=>{
          res.status(200).render("car.html",{title:e});
     });

})


app.post("/search",(req,res)=>{
     
     const query=JSON.parse(req.body).q;
  
     Car.find({name:new RegExp(query)},{_id:0,__v:0,type:0,price:0}).then(i=>{   
          if(i.length!=0){ 
               return res.status(200).send(i);
          }
          else{
               return res.status(200).send([{status:"error",name:"no car found"}]);
          }     
     });

});

/* api */
app.get("/api/cars",cc);


/* wild card handler */
app.get("/*splat",(req,res)=>{
     res.setHeader('Content-Type','text/html');
     // res.status(404).send(`<h1>Page Not Found</h1>`);
     res.status(404).render(`error.html`,{title:"404"});
});

app.listen(port,()=>{
     console.log(`App server running at http://127.0.0.1:${port}`);
});