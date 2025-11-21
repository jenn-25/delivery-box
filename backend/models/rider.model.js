import mongoose from 'mongoose';

const RiderSchema = new mongoose.Schema({
    emailAddress:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    middleName:{
        type: String,
        required: true
    },
    contactNumber:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    resetOTP:{
        type: String,
        default: ""
    },
    resetOTPExpire:{
        type: Number,
        default: 0
    }
});

const Rider=mongoose.model('Rider', RiderSchema);

export default Rider;