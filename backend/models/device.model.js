import mongoose from 'mongoose';


const DeviceSchema = new mongoose.Schema({
    deviceID:{
        type: String,
        required: true
    },
    isOnline:{
        type: Boolean,
        default: false
    },
    lastUpdate:{
        type: Number,
        required: true,
        default: 0
    },
    owner:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    LockControl:{
        type:Boolean,
        default:false,
    }, 
    temperature1:{
        type: Number,
        required: true,
        default: 0
    },
    temperature2:{
        type: Number,
        required: true,
        default: 0
    },
    dryhascontents:{
        type: Boolean,
        default: false,
    },
    wethascontents:{
        type: Boolean,
        default: false,
    }
});

const Device = mongoose.model('Device', DeviceSchema);

export default Device;