const mongoose = require('mongoose')

//define db schema
const  runsSchema = new mongoose.Schema(
	{ 
		content: {
			type: String,
			required: true
		},
		author : {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
	},
	{
		timestamps: true //assigns createdAt and updateAt fields with a date type,
	}
);

//define 'run' model with the runschema
const Run = mongoose.model('Run', runsSchema)
module.exports = Run
