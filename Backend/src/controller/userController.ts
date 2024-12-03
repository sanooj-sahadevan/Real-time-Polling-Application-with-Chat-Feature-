import { NextFunction, Request, Response } from "express";
import { HttpStatus } from '../utils/httpStatus.ts'; // Assuming httpStatus is a utility for HTTP status codes
import { User } from "../interface/user.js";

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
    

     
    











}

