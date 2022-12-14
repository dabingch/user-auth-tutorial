const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "Please add a name"],
		},
		email: {
			type: String,
			required: [true, "Please add a email"],
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Please add a password"],
		},
		photo: {
			type: String,
			default:
				"https://robohash.org/bac6fa37fec6161545c9d68fbe875cb0?set=set4&bgset=&size=400x400",
		},
		phone: {
			type: String,
			default: "+61",
		},
		bio: {
			type: String,
			default: "bio",
			maxLength: [250, "bio too long"],
		},
	},
	{
		timestamps: true,
	}
);

// Static sign up method
userSchema.statics.signup = async function (username, email, password) {
	// Check whether user exist
	const existUser = await this.findOne({ email });

	if (existUser) {
		throw Error("User already exists!");
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = await this.create({
		username,
		email,
		password: hashedPassword,
	});

	return user;
};

module.exports = mongoose.model("User", userSchema);
