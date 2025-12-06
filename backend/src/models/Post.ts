import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";
import User from './User';

interface PostAttributes {
    id: number,
    title: string,
    slug: string,
    content: string,
    images: string[],
    userId: number
}

interface PostCreation extends Optional<PostAttributes, "id"> { };

class Post extends Model<PostAttributes, PostCreation> implements PostAttributes {
    public id!: number;
    public title!: string;
    public slug!: string;
    public content!: string;
    public images!: string[];
    public userId!: number;
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: DataTypes.STRING,
        slug: DataTypes.STRING,
        content: DataTypes.STRING,
        images: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                key: 'id',
                model: 'Users'
            },
            onDelete: 'CASCADE'
        }
    },
    {
        sequelize,
        modelName: 'Post'
    }
);

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

export default Post;