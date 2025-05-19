import mongoose from 'mongoose';

const UserRoleSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
}, { timestamps: true });

export default mongoose.model('UserRole', UserRoleSchema);
