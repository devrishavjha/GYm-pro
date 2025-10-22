const mongoose=require("mongoose");
require("dotenv").config();
const connectDb= async()=> {
    try{
            await mongoose.connect(process.env.MONGO_URI);
            console.log("connected");
    }
    catch(err ){
          console.error("not connected",err.message);
          process.exit(1);
    }
};
module.exports=connectDb;
