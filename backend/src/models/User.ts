import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface UserAttributes {
    id: number,
    name: string,
    email: string,
    password: string,
    role: string
}


interface UserCreation extends Optional<UserAttributes, "id" | "role"> { };

class User extends Model<UserAttributes, UserCreation> {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: string;
};

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: DataTypes.STRING,
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        }
    },
    {
        sequelize,
        modelName: "User"
    }
);

export default User;