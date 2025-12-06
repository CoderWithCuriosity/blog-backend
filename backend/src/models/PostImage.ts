import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";
import Post from "./Post";

interface PostImageAttr {
    id: number;
    image: string;
    postId: string;
}

interface PostImageCreate extends Optional<PostImageAttr, "id"> { }


class PostImage extends Model<PostImageAttr, PostImageCreate> implements PostImageAttr {
    public id!: number;
    public image!: string;
    public postId!: string;
}

PostImage.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image: DataTypes.STRING,
        postId: {
            type: DataTypes.INTEGER,
            references: {
                model: "Posts",
                key: "id"
            }
        }
    },
    {
        sequelize,
        modelName: "PostImage"
    }
)

Post.hasMany(PostImage, { foreignKey: "postId" });
PostImage.belongsTo(Post, { foreignKey: "postId" });