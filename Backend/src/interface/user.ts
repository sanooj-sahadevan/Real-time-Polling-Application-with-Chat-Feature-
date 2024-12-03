
import { Types } from "mongoose";

export interface User extends Document {
    username: string;
    phone?: number;
    email: string;
    password?: string;
    
  }

