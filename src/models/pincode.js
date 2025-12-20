import {mongoose} from "mongoose";

const Schema=mongoose.Schema;

const pinSchema=new Schema({
          _id:mongoose.ObjectId,
          officeName:String,
          pincode:Number,
          taluk:String,
          districtName:String,
          stateName:String
},{collection:"pincode"});

const Pin=mongoose.model("Pin",pinSchema);

export default Pin;