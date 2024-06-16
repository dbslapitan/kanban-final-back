import { Schema, model } from "mongoose"

export interface User{
    email: string,
    username: string
}

export const userSchema = new Schema<User>({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        match: /^[\w-.]+$/
    }
});

export const User = model('User', userSchema);