import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    username: String,
    fullname: String,
    organization: String,
    email: String,
    password: String,
    roles: [String],
    created: { type: Date, default: Date.now }
},{
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
        }
    }
});
