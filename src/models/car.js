import {mongoose} from "mongoose";

const Schema=mongoose.Schema;

const carSchema=new Schema({
          _id:mongoose.ObjectId,
          name:{type:String, required:true, unique:true, trim:true, minlength:3, maxlength:20, dropdups:true},
          type:{type:String, required:true, unique:true, trim:true, minlength:3, maxlength:20},
          price:{type:Number, required: true, min:1, max:50000000}
},{collection:"suzuki"});

const Car=mongoose.model("Car",carSchema);

export default Car;