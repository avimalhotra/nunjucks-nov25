import express from 'express';
import path from 'node:path';
import nunjucks from 'nunjucks';

const app=express();
const port=process.env.PORT || 8080;

app.use(express.static(path.resolve('src/public')));
app.use(express.static(path.resolve('node_modules/bootstrap/dist')));


const env = new nunjucks.Environment();
env.addFilter('reverse', (str) => str.split("").reverse().join() );

// configure
nunjucks.configure(path.resolve("src/public/views"),{
     express:app,
     autoscape:true,
     noCache:false,
     watch:true
});

app.get("/",(req,res)=>{
     res.status(200).render("index.html",{title:"nunjucks", id:21, user:{name:"lorem", id:212}, cars:["swift","baleno","polo","brezza"] });
});

app.get("/about",(req,res)=>{
     res.status(200).render("about.html",{title:"about us"});
});

app.get("/contact",(req,res)=>{
     res.status(200).render("contact.html",{title:"contact us"});
});


/* wild card handler */
app.get("/*splat",(req,res)=>{
     res.setHeader('Content-Type','text/html');
     // res.status(404).send(`<h1>Page Not Found</h1>`);
     res.status(404).render(`error.html`,{title:"404"});
});

app.listen(port,()=>{
     console.log(`App server running at http://127.0.0.1:${port}`);
});