import { User } from "../interface/user";
import { UserModel } from "../models/userModels";
import Message, { IMessage } from '../models/messageModels';
import Poll, { IPoll } from '../models/pollModels';
import { io } from '../index';


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


   

  
async savechatDB(
    user_id: string,
    text: string,
    createdAt: string
): Promise<IMessage> {
    try {
        console.log("Saving chat for user:", user_id);

        // If 'createdAt' is a string, convert it to Date
        const timestamp = new Date(createdAt);

        // Create new message object
        const newMessage = new Message({
            user_id,
            text,
            createdAt: timestamp,
        });

        const savedMessage = await newMessage.save(); 

        io.to(user_id).emit("message", {
            _id: savedMessage._id.toString(), 
            user_id: savedMessage.user_id,
            text: savedMessage.text,
            createdAt: savedMessage.createdAt.toISOString(),
        });
        console.log("Successfully emitted");

        return savedMessage; 
    } catch (error) {
        console.error("Error saving chat:", error);
        throw new Error("Could not save chat");
    }
}


    
   

    async getMessagesByChatId() {
        try {
          console.log('Fetching messages with full details...');
          
          const result = await Message.find()
            .populate('user_id')  
            .exec(); 
      
          console.log(result,'result'); 
      
          return result;  
        } catch (error) {
          console.error('Error fetching messages from the database:', error);
          throw new Error('Error fetching messages from the database');
        }
      }


}
