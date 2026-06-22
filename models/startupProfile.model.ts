import mongoose,{Schema}

const startupProfileSchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    currentStage: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    teamSize: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export const StartupProfile = mongoose.model('StartupProfile', startupProfileSchema);