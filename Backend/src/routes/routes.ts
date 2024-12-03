import { Router } from "express";
import { UserController } from "../controller/userController";
import { UserService } from "../service/userService";
import { UserRepository } from "../repository/userReop";

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post("/login", userController.login.bind(userController));
router.post("/signup", userController.register.bind(userController));

export default router;
