const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {

        email:{ type: String, unique: true, required: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
        privateKey: String,
        loginToken: String,

    },
    {
        collection: 'users'
    }
);

module.exports = mongoose.model('User', UserSchema);