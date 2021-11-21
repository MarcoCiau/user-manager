import { Router } from 'express';
import * as authController from '../controllers/auth';
const router = Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/forgot', authController.forgotPassword);
router.post('/reset', authController.resetPassword);

export default router;