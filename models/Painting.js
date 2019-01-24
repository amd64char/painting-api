const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
/*
 * Notice there is no ID. That's beacuse Mongoose will assign
 * an ID by default to all schemas
 * 
 * Using a built-in schema validator for painting name
 * https://mongoosejs.com/docs/validation.html#built-in-validators
 * 
 */
 const PaintingSchema = new Schema({
   name: {
      type: String,
      required: [true, 'Painting name is required.'],
      index: {
         unique: true,
         dropDups: true,
      }
   },
   artist: String,
   url: String,
   techniques: [String],
   dateCreated: { 
      type: Date, 
      default: Date.now 
   },
   dateModified: { 
      type: Date 
   }
 });
/*
 * Exporting our schema as a Mongoose model
 */
 module.exports = Mongoose.model('Painting', PaintingSchema);
 