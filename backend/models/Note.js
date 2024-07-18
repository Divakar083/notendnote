const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  archived: { type: Boolean, default: false },
  trash: { type: Boolean, default: false },
  color: { type: String, default: '#ffffff' },
  reminder: { type: Date },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
