var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InterestSchema = new Schema({
	name: { type: String, required: true, index: { unique: true } },
	count: {type: Number, required: true,  default: 0}
});

module.exports = mongoose.model('Interest', InterestSchema);
