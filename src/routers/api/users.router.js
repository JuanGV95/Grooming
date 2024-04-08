import { Router } from 'express';
import userController from '../../controllers/users.controller.js';
import passport from 'passport';
import upload from '../../utils/uploader.js';

const router = Router();

router.get('/users', passport.authenticate('jwt-auth', { session: false }), userController.getAllUsers);
router.post('/user/:uid/documents', upload.array('documents'), userController.uploadUserDocuments);
router.get('/users/me', passport.authenticate('jwt', { session: false }), userController.getCurrentUser);
router.get('/users/:uid', userController.getUserById);
router.post('/users/', userController.createUser);
router.put('/users/:uid', userController.updateUser);
router.put('/users/premium/:uid', userController.updateToPremium);
router.delete('/users/:uid', passport.authenticate('jwt-auth', { session: false }), userController.deleteUserById);
router.delete('/users', passport.authenticate('jwt-auth', { session: false }), userController.deleteInactiveUsers);

export default router;
