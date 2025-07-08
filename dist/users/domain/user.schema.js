"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    emailConfirmation: {
        type: {
            confirmationCode: { type: String, required: true },
            isConfirmed: { type: Boolean, required: true, default: false }
        },
        required: false, // This makes the entire emailConfirmation object optional
        _id: false // Prevents MongoDB from creating an _id for this subdocument
    }
}, {
    // Schema options
    timestamps: false, // We're using our own createdAt
    versionKey: false // Disable __v field if you don't need it
});
// Add indexes for better query performance
userSchema.index({ login: 1, email: 1 });
userSchema.index({ 'emailConfirmation.confirmationCode': 1 });
// Helper methods on the document
userSchema.methods.isEmailConfirmed = function () {
    var _a;
    return ((_a = this.emailConfirmation) === null || _a === void 0 ? void 0 : _a.isConfirmed) || false;
};
userSchema.methods.needsEmailConfirmation = function () {
    return !this.emailConfirmation || !this.emailConfirmation.isConfirmed;
};
// Static methods for common queries
userSchema.statics.findByLoginOrEmail = function (loginOrEmail) {
    return this.findOne({
        $or: [
            { email: loginOrEmail.toLowerCase() },
            { login: loginOrEmail }
        ]
    });
};
userSchema.statics.findByConfirmationCode = function (code) {
    return this.findOne({
        'emailConfirmation.confirmationCode': code
    });
};
// Virtual for backward compatibility if needed
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
// Ensure virtual fields are serialized
userSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.passwordHash; // Never expose password hash
        return ret;
    }
});
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
