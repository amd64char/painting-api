const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

/*
 * Notice there is no ID. That's beacuse Mongoose will assign
 * an ID by default to all schemas
 */

 const PaintingSchema = new Schema({
   name: {
      type: String,
      index: {
         unique: true,
         dropDups: true
      }
   },
   url: String,
   techniques: [String],
   dateCreated: [Date],
   dateModified: [Date]
 });

 module.exports = Mongoose.model('Painting', PaintingSchema);
 