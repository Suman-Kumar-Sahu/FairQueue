import express from 'express';
import { getCoordinates } from '../controllers/geocodingController.js';

const router = express.Router();

router.get('/', getCoordinates);

export default router;