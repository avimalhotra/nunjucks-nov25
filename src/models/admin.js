import {mongoose} from "mongoose";

const Schema=mongoose.Schema;

const adminSchema=new Schema({
          _id:mongoose.ObjectId,
          username:{type:String, required:true, unique:true, trim:true, minlength:3, maxlength:20, dropdups:true},
          password:{type:String, required:true, trim:true, minlength:6, maxlength:20}
},{collection:"admin"});

const Admin=mongoose.model("Admin",adminSchema);

export default Admin;