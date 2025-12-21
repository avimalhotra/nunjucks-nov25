import express from 'express';
import path from 'node:path';
import nunjucks from 'nunjucks';
import mongoose from './config/dao.js';
import Car from './models/car.js';
import Pin from './models/pincode.js';
import cc from "./controllers/allcars.js";

const db=mongoose.connection;

const app=express();
const port=process.env.PORT || 8080;

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.resolve('src/public')));
app.use(express.static(path.resolve('node_modules/bootstrap/dist')));


// const env = new nunjucks.Environment();
// env.addFilter('reverse', (str) => str.split("").reverse().join() );

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

app.get("/contact",(req,res)=>{
     res.status(200).render("contact.html",{title:"contact us"});
});

app.get("/cars/",(req,res)=>{

     Car.find({},{_id:0,__v:0}).then(i=>{
          res.status(200).render("cars.html",{title:"Cars Page",data:i});
     }).catch(e=>{
          res.status(200).render("cars.html",{title:"Cars Page",data:e});
     });
    
});

app.post("/search",(req,res)=>{
     
     const query=JSON.parse(req.body).q;

     Car.find({name:new RegExp(query)},{_id:0,__v:0,type:0,price:0}).then(i=>{
             console.log(i);
          
          if(i.length!=0){ 
               return res.status(200).json(i);
          }
          else{
              return res.status(200).json([{status:"error",reason:"no car found"}]);
          }
     
     });

     
});

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