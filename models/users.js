const mongoose = require("mongoose"),
    bcrypt = require("bcrypt"),
    SALT_WORK_FACTOR = 10; // used to resist rainbow table and brute force attacks

// Declare schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now
    }
});

// Add hashing middleware to schema
userSchema.pre("save", function(next) {
    const user = this;

    // only hash password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using the new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next (err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// Add compare method to schema
userSchema.methods.comparePassword = function(candidatePassword, next) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        next(null, isMatch);
    });
}

// Export schema
mongoose.model("User", userSchema);
