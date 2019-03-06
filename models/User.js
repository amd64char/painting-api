
const Mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Schema = Mongoose.Schema;
/*
 * Notice there is no ID. That's beacuse Mongoose will assign
 * an ID by default to all schemas
 * 
 * Using a built-in schema validator for painting name
 * https://mongoosejs.com/docs/validation.html#built-in-validators
 * 
 */
 const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        index: {
            unique: true,
            dropDups: true,
        }
    },
    hash: String,
    salt: String,
    dateCreated: { 
        type: Date, 
        default: Date.now 
    },
    dateModified: { 
        type: Date 
    }
 });

UserSchema.methods.setPassword = (password) => {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = (password) => {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};
  
UserSchema.methods.generateJWT = () => {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    this.dateModified = today;
    
    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}
  
UserSchema.methods.toAuthJSON = () => {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
        dateCreated: this.dateCreated,
        dateModified: this.dateModified
    };
};

/*
 * Exporting our schema as a Mongoose model
 */
 module.exports = Mongoose.model('User', UserSchema);