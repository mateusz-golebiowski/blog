import { Router } from 'express';
import { signIn, signUp } from '../controllers/user';

const userRouter = Router();
userRouter.post('/signIn', signIn);
userRouter.post('/signUp', signUp);
export default userRouter;