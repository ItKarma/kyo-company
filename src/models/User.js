import { model, Schema } from "mongoose";


const UserModel = Schema({
    first_name: {
        type:String,
    },
    idUser: {
        type:Number,
    },
    username : {
        type: String,
    },
    balance:{
        type: Number,
    },
    isAdmin : {
        type:Boolean,
        default: false
    },
    isVip: {
        type: Boolean,
        default: false
    }
});

const userModel = model('users', UserModel)
export default userModel