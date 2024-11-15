import mongoose from "mongoose";

export default async function ConnectToDb(){
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("Connected to database successfully")
    } catch (error) {
        console.log("Error while connecting to database")
    }   
}