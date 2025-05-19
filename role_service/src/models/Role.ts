import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  permissions: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Role', RoleSchema);
