import { NextFunction, Request, Response } from "express";
import { HttpStatus } from '../utils/httpStatus.ts'; // Assuming httpStatus is a utility for HTTP status codes

export class UserController {
    private userService: any;
    create: any;

    constructor(userService: any) {
        this.userService = userService;
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const { user, token } = await this.userService.loginUser(email, password);
            console.log('login controller');

            res.cookie("token", token, {
                sameSite: 'strict',
                maxAge: 3600000, 
            });
            res.status(HttpStatus.OK).json({ user, token });
        } catch (error: any) {
            next(error); 
        }
    }



    async register(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Signup controller called");

            const user = {
                username: req.body.username,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password,
            };

            const result = await this.userService.registerUser(user);
            res.status(HttpStatus.OK).json({
                message: "User registered successfully. OTP sent to email.",
                data: result,
            });
        } catch (error: unknown) {
            next(error);
        }
    }
    


    async savechat(req: Request, res: Response, next: NextFunction) {
        try {
          console.log('controller');
          console.log('Request Body:', req.body); // Log the incoming payload

          const { user,text,  createdAt} = req.body;
      
          console.log('Received data:', { user,text,  createdAt });
      
          const result = await this.userService.savechatService(
            user,text,  createdAt
          );
      
          res.status(HttpStatus.OK).json(result);
        } catch (error: any) {
          next(error);
        }
      }



      
      async getMessage(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
          const updatedMessages = await this.userService.getMessageService(); 
          if (!updatedMessages.length) {
            return res
              .status(HttpStatus.NOT_FOUND)
              .json({ message: "No messages found for this chat" });
          }
          res.status(HttpStatus.OK).json(updatedMessages);
        } catch (error: any) {
          next(error); // Pass the error to the next middleware (error handler)
        }
      }












}

