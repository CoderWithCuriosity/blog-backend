import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import User from './User';
import Post from './Post';


interface CommentAttributes {
    id: number,
    text: string,
    userId: number,
    postId: number
}

interface CommentCreation extends Optional<CommentAttributes, "id"> { };

class Comment extends Model<CommentAttributes, CommentCreation> { };

Comment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: DataTypes.STRING,
    userId: {
        type: DataTypes.INTEGER,
        references: {
            key: 'id',
            model: 'Users'
        }
    },
    postId: {
        type: DataTypes.INTEGER,
        references: {
            key: 'id',
            model: 'Posts',
        },
        onDelete: 'CASCADE'
    }
},
    {
        sequelize,
        modelName: "comment"
    }
)

User.hasMany(Comment, {
    foreignKey: 'userId'
});
Comment.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Comment, {
    foreignKey: 'postId'
});
Comment.belongsTo(Post, {
    foreignKey: 'postId'
});

export default Comment;