import {mongoose} from "mongoose";

const Schema=mongoose.Schema;
const db=mongoose.connection;

main().catch(err => console.log(err));
    
async function main() {
     await mongoose.connect('mongodb://127.0.0.1:27017/node');
     console.log("db connected");
}

const carSchema=new Schema({
          _id:mongoose.ObjectId,
          name:{type:String, required:true, unique:true, trim:true, minlength:3, maxlength:20, dropdups:true},
          type:{type:String, required:true, unique:true, trim:true, minlength:3, maxlength:20},
          price:{type:Number, required: true, min:1, max:50000000}
     },{collection:"suzuki"});

const Car=mongoose.model("Car",carSchema);
     
     // const newcar=new Car({
     //      _id:new mongoose.Types.ObjectId(),
     //      name:"e vitara",
     //      type:"suv",
     //      price:1900000
     // });


     db.on("error",err=>console.warn(err));

     db.once("open",function(){

          // newcar.save().then((i)=>{
          //      console.log("data saved",i);
          // }).catch(err=>{
          //      console.warn(err);
          // });

          // Car.find({}).sort({price:1}).then(i=>{
          //      console.log(i);
          // }).catch(err=>{
          //      console.warn(err);
          // });

         /* Car.find({name:new RegExp('vitara')}).then(i=>{
               console.log(i);
          }).catch(err=>{
               console.warn(err);
          }); */

     });    

export default mongoose;