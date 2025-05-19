import express from 'express';
import {
  createRole, getRoles, assignRoleToUser, updatePermissions
} from '../controllers/role';
import { isAdmin } from '../middlewares/auth';

const router = express.Router();

router.post('/', isAdmin, createRole);
router.get('/', isAdmin, getRoles);
router.post('/assign', isAdmin, assignRoleToUser);
router.put('/permissions', isAdmin, updatePermissions);

export default router;
