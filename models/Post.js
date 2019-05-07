const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId },
        name: { type: String }
    }
);
const PostSchema = new Schema(
    {

        description: { type: String, required: true },
        img_path: { type: String, required: true },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        user: userSchema,
        createdAt: { type: Date, default: Date.now },
        deleted: { type: Boolean, default: false }
    },
    {
        collection: 'posts'
    }
);

module.exports = mongoose.model('Post', PostSchema);