import { Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';
// import { compare, genSalt, hash } from 'bcrypt';

export const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    roles: [Schema.Types.Mixed]

}, { timestamps: true });

export const TokenVerifyEmailSchema = new Schema({
    userId: {
        type: String,
    },
    tokenVerifyEmail: {
        type: String,
    }
}, { timestamps: true });

// NOTE: Arrow functions are not used here as we do not want to use lexical scope for 'this'
UserSchema.pre('save', function (next) {
    let user = this as any;
    // Make sure not to rehash the password if it is already hashed
    if (!user.isModified('password')) return next();
    // Generate a salt and use it to hash the user's password
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.checkPassword = function (attempt, callback) {
    let user = this;
    bcrypt.compare(attempt, user.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};
