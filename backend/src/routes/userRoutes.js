import express from 'express';
import {getUsers,getUser,createUser,updateUser,deleteUser,penalizeUser,removePenalty} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(authorize('admin'), getUsers).post(authorize('admin'), createUser);

router.route('/:id').get(authorize('admin'), getUser).put(authorize('admin'), updateUser).delete(authorize('admin'), deleteUser);

router.post('/:id/penalize', authorize('admin', 'staff'), penalizeUser);
router.post('/:id/remove-penalty', authorize('admin'), removePenalty);

export default router;
