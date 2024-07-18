const Note = require('../models/Note');

const createNote = async (req, res) => {
  const { title, content, tags, color, reminder } = req.body;

  const note = await Note.create({
    title,
    content,
    tags,
    color,
    reminder,
    userId: req.user._id,
  });

  res.status(201).json(note);
};

const getNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.user._id, archived: false, trash: false });
  res.json(notes);
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);

  if (note) {
    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.tags = req.body.tags || note.tags;
    note.color = req.body.color || note.color;
    note.reminder = req.body.reminder || note.reminder;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404).json({ message: 'Note not found' });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);

  if (note) {
    note.trash = true;
    await note.save();
    res.json({ message: 'Note moved to trash' });
  } else {
    res.status(404).json({ message: 'Note not found' });
  }
};

const getArchivedNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.user._id, archived: true });
  res.json(notes);
};

const getTrashedNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.user._id, trash: true });
  res.json(notes);
};

const getLabelNotes = async (req, res) => {
  const { label } = req.params;
  const notes = await Note.find({ userId: req.user._id, tags: label });
  res.json(notes);
};

const getReminderNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.user._id, reminder: { $gte: new Date() } });
  res.json(notes);
};

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getArchivedNotes,
  getTrashedNotes,
  getLabelNotes,
  getReminderNotes,
};
