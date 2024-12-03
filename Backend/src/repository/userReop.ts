import { User } from "../interface/user";
import { UserModel } from "../models/userModels";

export class UserRepository {
    create: any;
    // async findUserByEmail(email: string) {
    //     try {
    //         const user = await UserModel.findOne({ email: email });
    //         return user;
    //     } catch (error) {
    //         console.error('Error finding user by email:', error);
    //         throw new Error('Database Error');
    //     }
    // }

    
    async findUserByEmail(email: string): Promise<any> {
        try {
            console.log('login repo');
            
            return await UserModel.findOne({ email }); 
        } catch (error: any) {
            console.error("Error finding user by email:", error);
            throw new Error("Database error while fetching user.");
        }
    }

    async createUser(user: any): Promise<any> {
        try {
            console.log('sighup repo',user);
            
            const newUser = new UserModel(user); 
            return await newUser.save();
        } catch (error: any) {
            console.error("Error creating user:", error);
            throw new Error("Database error while saving user.");
        }
    }
}
