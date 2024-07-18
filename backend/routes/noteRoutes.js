const express = require('express');
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getArchivedNotes,
  getTrashedNotes,
  getLabelNotes,
  getReminderNotes,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getNotes).post(protect, createNote);
router.route('/:id').put(protect, updateNote).delete(protect, deleteNote);
router.route('/archived').get(protect, getArchivedNotes);
router.route('/trash').get(protect, getTrashedNotes);
router.route('/label/:label').get(protect, getLabelNotes);
router.route('/reminder').get(protect, getReminderNotes);

module.exports = router;
