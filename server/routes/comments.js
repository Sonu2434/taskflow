const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', addComment);
router.get('/:taskId', getComments);
router.delete('/:id', deleteComment);

module.exports = router;
