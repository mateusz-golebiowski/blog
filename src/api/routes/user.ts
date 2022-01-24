import { Router } from 'express';
import {
    signIn,
    inviteUser,
    getUserData,
    updateUserData,
    getAllUserData,
    getRoles,
    deleteUser, updateUserDataByAdmin
} from '../controllers/user';
import {auth} from '../controllers/auth';

const userRouter = Router();
userRouter.post('/signIn', signIn);
userRouter.post('/invite', auth, inviteUser);
userRouter.put('/:id', auth, updateUserDataByAdmin);
userRouter.get('/getData/:id', auth, getUserData);
userRouter.delete('/:id', auth, deleteUser);
userRouter.put('/updateMyProfile/', auth, updateUserData);
userRouter.get('/getAllData', auth, getAllUserData);
userRouter.get('/getRoles', auth, getRoles);
export default userRouter;