import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class UserService {
    private userRepository: any;

    constructor(userRepository: any) {
        this.userRepository = userRepository;
    }

    async loginUser(email: string, password: string) {
        try {
            console.log('login service');

            const user = await this.userRepository.findUserByEmail(email);
            if (!user) {
                throw new Error("Invalid Email/Password");
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid Email/Password");
            }
            const token = jwt.sign({ userId: user._id }, 'sanoojsanooj', {
                expiresIn: "1h",
            });
            return { user, token };
        } catch (error: any) {
            console.error('Error during login:', error);
            throw new Error(error); 
        }
    }


    async registerUser(user: any) {
        try {
            console.log('user service signup');
            
            // const existingUser = await this.userRepository.findUserByEmail(user.email);
            // console.log(existingUser);
            //             if (existingUser) {
            //     throw new Error("User already exists and is verified.");
            // }

            // Hash the user's password
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;

            // Save the user in the repository
            return await this.userRepository.createUser(user);
        } catch (error: any) {
            console.error("Error during user registration:", error);
            throw new Error(error.message || "Failed to register user.");
        }
    }
}
