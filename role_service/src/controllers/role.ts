import Role from '../models/Role';
import UserRole from '../models/UserRole'; // Make sure '../models/UserRole' exports the Mongoose model, not a Router
 import { publishToQueue } from '../utils/rabbit';

export const createRole = async (req, res) => {
  const { email } = req.body;
  const role = new Role({ email });
  await role.save();
  res.status(201).json(role);
};

export const getRoles = async (_req, res) => {
  const roles = await Role.find();
  res.json(roles);
};


export const assignRoleToUser = async (req, res) => {
  const { userId, roleId } = req.body;

  const existing = await UserRole.findOne({ userId });
  if (existing) {
    existing.roleId = roleId;
    await existing.save();
  } else {
    await UserRole.create({ userId, roleId });
  }

  // ✅ Send event
  await publishToQueue('role.assigned', { userId, roleId });

  res.json({ message: 'Role assigned successfully' });
};


export const updatePermissions = async (req, res) => {
  const { roleId, permissions } = req.body;
  const role = await Role.findByIdAndUpdate(roleId, { permissions }, { new: true });

  // await publishToQueue('permission.updated', { roleId, permissions });

  res.json(role);
};
