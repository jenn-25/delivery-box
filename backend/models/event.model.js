import mongoose from 'mongoose';

const types = ['Data Submission', 'Seedling Sow', 'Seedling Ready'];


const EventSchema = new mongoose.Schema({
    device:{
        type: mongoose.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    eventDate:{
        type: Number,
        required: true,
        default: Date.now()
    },
    eventType:{
        type: String,
        enum: types,
        required: true,
        default: 'Data Submission'
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

const Event=mongoose.model('Event', EventSchema);

export default Event;