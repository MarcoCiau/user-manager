import { Router } from 'express';
import * as authController from '../controllers/auth';
import * as authValidator from '../middlewares/auth.validator';
const router = Router();

router.post('/signup', authValidator.rules(), authValidator.result, authController.signup);
router.post('/signin', authController.signin);
router.post('/forgot', authController.forgotPassword);
router.post('/reset', authController.resetPassword);

export default router;