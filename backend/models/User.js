const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    bio: { type: String },
    offers: [String],
    seeks: [String],
    sessions: [{
        with: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: String },
        skill: { type: String },
        status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'] },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }],
    ratings: [{
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    messages: [{
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
        timestamp: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
        readAt: { type: Date }
    }],
    location: {
        city: { type: String },
        country: { type: String },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    preferences: {
        availability: { type: String, enum: ['Weekdays', 'Weekends', 'Evenings', 'Flexible'] },
        sessionLength: { type: String, enum: ['30 minutes', '1 hour', '1-2 hours', '2+ hours'] },
        communication: { type: String, enum: ['Video calls preferred', 'In-person preferred', 'Either works', 'Text chat only'] },
        location: { type: String, enum: ['Online only', 'Local meetups only', 'Online or local meetups'] }
    },
    googleCalendarToken: {
        access_token: { type: String },
        refresh_token: { type: String },
        expiry_date: { type: Number }
    },
    isOnline: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ 'location.city': 1 });
userSchema.index({ offers: 1 });
userSchema.index({ seeks: 1 });
userSchema.index({ isOnline: 1 });
userSchema.index({ lastActive: 1 });

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('User', userSchema);