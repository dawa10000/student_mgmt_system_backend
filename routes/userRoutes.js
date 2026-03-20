import express from 'express';
import { notAllowed } from '../utlis/notAllowed.js';
import { getUserProfile, loginUser, registerUser, updateUserProfile } from '../controllers/userController.js';
import { userFileCheck, userFileUpdateCheck } from '../middleware/userFileCheck.js';
import { loginSchema, registerSchema, validators } from '../utlis/validator.js';
import { checkUser } from '../middleware/checkUser.js';

const router = express.Router();

router.route('/login').post(validators.body(loginSchema), loginUser).all(notAllowed);
router.route('/register').post(validators.body(registerSchema), userFileCheck, registerUser).all(notAllowed);
router.route('/profile').get(checkUser, getUserProfile).patch(checkUser, userFileUpdateCheck, updateUserProfile).all(notAllowed);

export default router;