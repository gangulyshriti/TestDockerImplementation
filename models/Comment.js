const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId },
        name: { type: String }
    }
);
const CommentSchema = new Schema(
    {
        comment: { type: String, required: true },
        parent: {type: Boolean},
        postId: { type: Schema.Types.ObjectId, required: true },
        commentId: { type: Schema.Types.ObjectId },
        parent: { type: Boolean },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        user: userSchema,
        createdAt: { type: Date, default: Date.now },
        deleted: { type: Boolean, default: false }
    },
    {
        collection: 'comments'
    }
);
CommentSchema.pre('find', function(next) {
    this.populate({path: 'comments', match: { deleted: false }, options: { sort: { 'createdAt': -1 } } });
    next();
  });
module.exports = mongoose.model('Comment', CommentSchema);