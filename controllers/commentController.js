const Food = require('../models/food'),
  Comment = require('../models/comment')

//GET COMMENT CONTROLLERS

module.exports.getAddComment = function (req, res) {
  Food.findOne(
    { category: req.params.id, slug1: req.params.id1 },
    function (err, item) {
      if (err || !item) {
        req.flash('error', 'Not Found')
        res.redirect('back')
      } else {
        res.locals.title = item.title + ' Comment - Frappeco'
        res.locals.meta.description = {
          description: 'Add new comment to frappeco page',
          robot: 'noindex, follow',
        }
        res.render('comments/new', { item: item })
      }
    }
  )
}

module.exports.getEditComments = function (req, res) {
  Food.findById(req.params.id, function (err, foundfood) {
    if (err || !foundFood) {
      req.flash('error', 'No Food Found')
      res.redirect('back')
    } else {
      Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
          res.send(err)
        } else {
          res.render('comments/edit', {
            food_id: req.params.id,
            comment: foundComment,
          })
        }
      })
    }
  })
}

//post COMMENT CONTROLLERS

module.exports.postAddComment = function (req, res) {
  //middle ware in post secures it more
  Food.findOne(
    { category: req.params.id, slug1: req.params.id1 },
    function (err, item) {
      if (err) {
        res.redirect('/')
      } else {
        Comment.create(req.body.comment, function (err, comment) {
          if (err) {
            req.flash('error', 'Something Went Wrong')
            console.log(err)
          } else {
            //add username and id to comment
            comment.author.id = req.user._id
            comment.author.username = req.user.username
            //save comment
            comment.save()
            item.comments.push(comment)
            item.save()
            req.flash('success', 'Successfully Added Comment')
            res.redirect('/' + item.category + '/' + item.slug1) //._id is a mongo command
          }
        })
      }
    }
  )
}

module.exports.updateComment = function (req, res) {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    function (err, updatedComments) {
      if (err) {
        res.redirect('back')
      } else {
        res.redirect('/foods/' + req.params.id)
      }
    }
  )
}

module.exports.deleteAddComment = function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect('back')
    } else {
      req.flash('success', 'Comment Deleted')
      res.redirect('/' + req.params.id + '/' + req.params.id1)
    }
  })
}
