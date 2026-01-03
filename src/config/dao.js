import {mongoose} from "mongoose";

const db=mongoose.connection;

main().catch(err => console.warn(err));
    
async function main() {
     await mongoose.connect('mongodb://127.0.0.1:27017/node');
     console.log("db connected");
}

db.on("error",err=>console.warn(err));

db.once("open",function(){console.log("db open");})


export default mongoose;