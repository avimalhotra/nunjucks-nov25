import cluster from "cluster";
import os from "os";
import express from "express";

const app=express();

if(cluster.isPrimary){

     const threads=os.cpus().length;

     for(let i=0; i<threads; i++){
          cluster.fork();
     }    
     
     cluster.on("exit",(worker)=>{
          console.log(`Worker ${worker.process.pid} crashed. Restarting...`);
          cluster.fork();
     })
}
else{

  app.get("/", (req, res) => {
    res.send(`Response from Worker ${process.pid}`);
  });

  app.listen(3000, () => {
    console.log(`Worker ${process.pid} is running`);
  });
}
