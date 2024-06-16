import { Schema, model } from "mongoose"

export interface User{
    authId: string,
    username: string
}

export const userSchema = new Schema<User>({
    authId: {
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