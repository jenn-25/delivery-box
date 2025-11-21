import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
    deviceID:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isUnlocked:{
        type: Boolean,
        required: true,
        default: false
    },
    isOnline:{
        type: Boolean,
        required: true,
        default: false
    },
    lastUnlockCheck:{
        type: Number,
        default: 0
    },
    password:{
        type: String,
        required: true
    }
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;