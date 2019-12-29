import { Router } from 'express';
import { signIn, signUp, getUserData, updateUserData } from '../controllers/user';
import {auth} from '../controllers/auth';

const userRouter = Router();
userRouter.post('/signIn', signIn);
userRouter.post('/signUp', auth, signUp);
userRouter.get('/getData/:id', auth, getUserData);
userRouter.put('/updateMyProfile/', auth, updateUserData);
export default userRouter;