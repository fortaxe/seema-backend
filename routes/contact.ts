import { Router } from 'express';
import { submitContactForm } from '../controllers/contact';

const router = Router();

router.post('/contact', submitContactForm);

export default router;
