import express from 'express';
import { adminLogin, createAdmin, editAdmin, getAdmin } from '../controllers/admin-auth';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/create', createAdmin);
router.put('/admin/edit', editAdmin);
router.get('/admin/get', getAdmin);
export default router;