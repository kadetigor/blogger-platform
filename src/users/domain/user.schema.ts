import { Schema, model, Document, Types, Model } from 'mongoose';

// Define the document interface that combines both types
export interface UserDocument extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  // Optional confirmation fields
  emailConfirmation?: {
    confirmationCode: string;
    isConfirmed: boolean;
  };
  // Instance methods
  isEmailConfirmed(): boolean;
  needsEmailConfirmation(): boolean;
}

// Define the model interface with static methods
export interface UserModel extends Model<UserDocument> {
  findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null>;
  findByConfirmationCode(code: string): Promise<UserDocument | null>;
}

const userSchema = new Schema<UserDocument>({
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
userSchema.methods.isEmailConfirmed = function(): boolean {
  return this.emailConfirmation?.isConfirmed || false;
};

userSchema.methods.needsEmailConfirmation = function(): boolean {
  return !this.emailConfirmation || !this.emailConfirmation.isConfirmed;
};

// Static methods for common queries
userSchema.statics.findByLoginOrEmail = function(loginOrEmail: string) {
  return this.findOne({
    $or: [
      { email: loginOrEmail.toLowerCase() }, 
      { login: loginOrEmail }
    ]
  });
};

userSchema.statics.findByConfirmationCode = function(code: string) {
  return this.findOne({
    'emailConfirmation.confirmationCode': code
  });
};

// Virtual for backward compatibility if needed
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.passwordHash; // Never expose password hash
    return ret;
  }
});

export const UserModel = model<UserDocument, UserModel>('User', userSchema);