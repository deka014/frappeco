const express = require('express'),
  router = express.Router({ mergeParams: true }),
  middleware = require('../middleware')

const commentController = require('../controllers/commentController')

//comment routes
router.get('/new', middleware.isLoggedIn, commentController.getAddComment)

//post comments
router.post('/', middleware.isLoggedIn, commentController.postAddComment)

// //Need to fix bugs
// //comment edit
// router.get('/:comment_id/edit', commentController.getEditComments)

// //coment update
// router.put('/:comment_id', commentController.updateComment)

//comment destroy

router.delete(
  '/:comment_id',
  middleware.checkCommentOwnership,
  commentController.deleteAddComment
)

module.exports = router
