import mongoose from "mongoose";

const connectFun = (url) => {
    return mongoose.connect(url)
}

export default connectFun