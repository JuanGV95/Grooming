import { Router } from 'express';
import userController from '../../controllers/users.controller.js';
import passport from 'passport';
import upload from '../../utils/uploader.js';
import { authMiddleware } from '../../utils/utils.js';
const router = Router();

router.get('/users', passport.authenticate('jwt-auth', { session: false }), authMiddleware(['admin']),userController.getAllUsers);
router.post('/user/:uid/documents', upload.array('documents'), authMiddleware(['user']),userController.uploadUserDocuments);
router.get('/users/me', passport.authenticate('jwt', { session: false }), authMiddleware(['admin', 'premium', 'user']),userController.getCurrentUser);
router.get('/users/:uid',passport.authenticate('jwt', { session: false }), authMiddleware(['admin']), userController.getUserById);
router.post('/users/',passport.authenticate('jwt', { session: false }), authMiddleware(['admin']), userController.createUser);
router.put('/users/:uid',passport.authenticate('jwt', { session: false }), authMiddleware(['admin']), userController.updateUser);
router.put('/users/premium/:uid',passport.authenticate('jwt', { session: false }), authMiddleware(['user']), userController.updateToPremium);
router.delete('/users/:uid', passport.authenticate('jwt-auth', { session: false }), authMiddleware(['admin']),userController.deleteUserById);
router.delete('/users', passport.authenticate('jwt-auth', { session: false }), authMiddleware(['admin']),userController.deleteInactiveUsers);

export default router;
