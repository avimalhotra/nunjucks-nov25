"use strict";


 // document.querySelector(".api").addEventListener("click",async function(){
     //      const res=await fetch("/api/cars");
     //      const data=await res.json();
     //      data.forEach(elem=>{
     //           document.querySelector("main ol").innerHTML+=`<li>${elem.name}</li>`;
     //      })
     // });

     async function fetchData(){
          const res=await fetch("/api/cars");
          const data=await res.json();
          data.forEach(elem=>{
               document.querySelector("main .fetchcars").innerHTML+=`<li>${elem.name}</li>`;
          });
     }

     // fetchData();
     if(document.querySelector("main .fetchcars")){fetchData()}


     document.querySelector("header form input").addEventListener("input",function(){
          const car=this.value;
          document.querySelector("#carsdata").innerHTML="";
          
          if(car.length>2){
               fetch(`/search`,{method:"POST",body:JSON.stringify({q:car})}).then(i=>i.json()).then(i=>{
                    i.forEach(elem=>{
                         document.querySelector("#carsdata").innerHTML+=`<li><a href=''>${elem.name}</a></li>`;
                         
                         document.querySelectorAll("#carsdata a").forEach(elem=>{
                              elem.addEventListener("click",function(e){
                              e.preventDefault();
                              document.querySelector("header input").value=this.textContent;
                         });
                         });
                    })
               }).catch(e=>console.warn(e))
          }
     });

     document.querySelector("header form").addEventListener("submit",function(e){
          e.preventDefault();
     });

     
     


