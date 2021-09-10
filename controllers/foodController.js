const moment = require('moment'),
  cloudinary = require('cloudinary'),
  //importing Middleware
  Food = require('../models/food'),
  Comment = require('../models/comment')

const findFileByFieldname = (files, fieldname) => {
  return files.find((file) => file.fieldname === fieldname) || {}
}

//cloudinary Configuration

cloudinary.config({
  cloud_name: 'frappeco',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

//GET CONTROLLERS

module.exports.getFood = async (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi')
    let food = await Food.paginate(
      { tagOutput: regex },
      {
        page: req.query.page || 1,
        limit: 12,
        sort: '-_id',
      }
    )
    food.page = Number(food.page)
    if (!food.docs.length) {
      req.flash('error', 'No Food matched your search. Please try again.')
      res.redirect('back')
    } else {
      // const delimiter = req.query.search ? '&' : '?';      not used because there are no multiple query
      var paginatedUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + '&'
      res.locals.title = 'You searched for ' + req.query.search + ' - Frappeco'
      res.locals.meta = {
        robot: 'noindex, follow',
        description: 'Search Result on Frappeco',
      }
      res.render('food/showcase', {
        topic: 'search result for : ' + req.query.search,
        paginatedUrl,
        food,
      })
    }
  } else {
    try {
      let feature = await Food.find({ 'approach.feature': true })
      let popular = await Food.find({ 'approach.popular': true })
      let food = await Food.find().sort({ _id: -1 }).limit(4)

      // let random = Math.floor(Math.random() * 25);
      // console.log(random)
      // res.locals.navclass = "home-nav-color";
      res.locals.meta.description =
        'Starting from food affairs to exotic and hilarious food experiences and stories along with scrumptious recipes, frappeco is brimming with all of such food related blogs providing a platform to everyone.'
      res.render('food/index', { food, feature, popular }) //allCampground is accesing the database
    } catch (err) {
      req.flash('error', err.message)
      return res.redirect('back')
    }
  }
}

module.exports.getAddFood = (req, res) => {
  res.locals.title = 'Add New Content - Frappeco'
  res.locals.meta = {
    robot: 'noindex, follow',
    description: 'Add New Frappeco Content Page',
  }
  res.render('food/new')
}

module.exports.getRecipesCategory = function (req, res) {
  Food.paginate(
    { category: 'recipes' },
    {
      page: req.query.page || 1,
      limit: 12,
      sort: '-_id',
    },
    function (err, allFood) {
      if (err) {
        console.log(err)
      } else {
        res.locals.title = 'Recipes - Frappeco'
        res.locals.meta.description =
          'Explore all our unique and appetizing recipes on frappeco '
        res.render('food/showcase', { food: allFood, topic: 'Recipes' }) //allCampground is accesing the database
      }
    }
  )
}

module.exports.getFoodBlogsCategory = function (req, res) {
  Food.paginate(
    { category: 'food-blogs' },
    {
      page: req.query.page || 1,
      limit: 12,
      sort: '-_id',
    },
    function (err, allFood) {
      if (err) {
        console.log(err)
      } else {
        res.locals.title = 'Food Blogs - Frappeco'
        res.locals.meta.description =
          "Find all frappeco's food related thoughts via blogs."
        res.render('food/showcase', { food: allFood, topic: 'Food Blogs' }) //allCampground is accesing the database
      }
    }
  )
}

module.exports.getFoodFactsCategory = function (req, res) {
  Food.paginate(
    { category: 'food-facts' },
    {
      page: req.query.page || 1,
      limit: 12,
      sort: '-_id',
    },
    function (err, allFood) {
      if (err) {
        console.log(err)
      } else {
        res.locals.title = 'Food Facts - Frappeco'
        res.locals.meta.description =
          'Discover the unknown facts to the known world on frapppeco facts'
        res.render('food/showcase', { food: allFood, topic: 'Food Facts' }) //allCampground is accesing the database
      }
    }
  )
}

module.exports.getBlogTipsCategory = function (req, res) {
  Food.paginate(
    { category: 'blogging-tips' },
    {
      page: req.query.page || 1,
      limit: 12,
      sort: '-_id',
    },
    function (err, allFood) {
      if (err) {
        console.log(err)
      } else {
        res.locals.title = 'Blogging Tips - Frappeco'
        res.locals.meta.description =
          'Frappeco provides the best blogging tips from the renowned bloggers'
        res.render('food/showcase', { food: allFood, topic: 'Blogging Tips' }) //allCampground is accesing the database
      }
    }
  )
}

module.exports.getFoodAffairsCategory = function (req, res) {
  Food.paginate(
    { category: 'food-affairs' },
    {
      page: req.query.page || 1,
      limit: 12,
      sort: '-_id',
    },
    function (err, allFood) {
      if (err) {
        console.log(err)
      } else {
        res.locals.title = 'Food Affairs - Frappeco'
        res.locals.meta.description =
          'Stay updated with current scenario of the food world on frappeco food-affairs'
        res.render('food/showcase', { food: allFood, topic: 'Food Affairs' }) //allCampground is accesing the database
      }
    }
  )
}

module.exports.getFoodStoriesCategory = function (req, res) {
  Food.paginate(
    { category: 'food-stories' },
    {
      page: req.query.page || 1,
      limit: 12,
      sort: '-_id',
    },
    function (err, allFood) {
      if (err) {
        console.log(err)
      } else {
        res.locals.title = 'Food Stories - Frappeco'
        res.locals.meta.description =
          'Devour some of the best food stories for frappeco family '
        res.render('food/showcase', { food: allFood, topic: 'Food Stories' }) //allCampground is accesing the database
      }
    }
  )
}

module.exports.getShowBlog = function (req, res) {
  Food.findOne({ category: req.params.id, slug1: req.params.id1 })
    .populate('comments')
    .exec(async function (err, foundfood) {
      if (err || !foundfood) {
        // req.flash("error","Food Not Found");
        // res.redirect("/")
        res.render('error')
      } else {
        let recommend = await Food.aggregate([
          {
            $match: {
              $and: [
                { 'approach.recommend': true },
                { title: { $ne: foundfood.title } },
              ],
            },
          },
          { $sample: { size: 3 } },
        ])
        // console.log(recommend)
        console.log(foundfood.slug1)
        res.locals.title = foundfood.title + ' - Frappeco'
        res.locals.meta.description = foundfood.summary
        res.render('food/show', { food: foundfood, recommend })
      }
    })
}

module.exports.getEditBlog = function (req, res) {
  //is user logged in
  Food.findOne(
    { category: req.params.id, slug1: req.params.id1 },
    function (err, foundfood) {
      res.locals.title = 'Edit ' + foundfood.title + ' - Frappeco'
      res.locals.meta = {
        robot: 'noindex, follow',
        description: 'Edit Frappeco Content Page',
      }
      res.render('food/edit', { food: foundfood })
    }
  )
}

//POST CONTROLLERS

module.exports.postImageUpload = (req, res) => {
  console.log(req.file)
  cloudinary.v2.uploader.upload(
    req.file.path,
    { folder: req.user.username },
    function (error, result) {
      res.send(
        cloudinary.url(result.public_id, {
          quality: 'auto',
          fetch_format: 'auto',
          secure: 'true',
        })
      )
    }
  )
}

module.exports.postBlogUpload = (req, res) => {
  //here the campgrounds is accesed from form ACTION  with post method
  // console.log(req.files)
  const thumbnail = findFileByFieldname(req.files, 'image')
  console.log(thumbnail)
  cloudinary.v2.uploader.upload(
    thumbnail.path,
    { folder: req.user.username + '_thumbnail' },
    function (err, result) {
      if (err) {
        req.flash('error', err.messsage)
      }
      // add cloudinary url for the image to the campground object under image property
      req.body.food.date = moment().format('LL')
      req.body.food.image = cloudinary.url(result.public_id, {
        quality: 'auto',
        fetch_format: 'auto',
        width: 1084,
        height: 723,
        crop: 'fill',
        secure: 'true',
      }) //3:2 ratio
      //add images public id to campground db
      req.body.food.imageId = result.public_id
      // console.log(result)
      // add author to campground
      req.body.food.author = {
        id: req.user._id,
        username: req.user.username,
      }
      Food.create(req.body.food, function (err, newlyCreated) {
        if (err) {
          console.log(err)
        } else {
          res.redirect('/' + newlyCreated.category + '/' + newlyCreated.slug1)
        }
      })
    }
  )
}

module.exports.updateBlog = function (req, res) {
  Food.findOne(
    { category: req.params.id, slug1: req.params.id1 },
    async function (err, updatingPost) {
      if (err) {
        req.flash('error', err.message)
        res.redirect('back')
      } else {
        const thumbnail = await findFileByFieldname(req.files, 'image')
        if (thumbnail.path) {
          try {
            await cloudinary.v2.uploader.destroy(updatingPost.imageId)
            var result = await cloudinary.v2.uploader.upload(thumbnail.path)
            updatingPost.imageId = result.public_id
            updatingPost.image = cloudinary.url(result.public_id, {
              quality: 'auto',
              fetch_format: 'auto',
              width: 1084,
              height: 723,
              crop: 'fill',
              secure: 'true',
            })
          } catch (err) {
            req.flash('error', err.message)
            return res.redirect('back')
          }
        }
      }
      updatingPost.title = req.body.food.title
      updatingPost.summary = req.body.food.summary
      updatingPost.category = req.body.food.category
      updatingPost.description = req.body.food.description
      updatingPost.tagOutput = req.body.food.tagOutput
      await updatingPost.save()
      req.flash('success', 'Updated Your Post')
      res.redirect('/' + updatingPost.category + '/' + updatingPost.slug1) //or updatedCamp._id = req.params.id  both gives the id
    }
  )
}

module.exports.deleteBlog = function (req, res) {
  Food.findOne(
    { category: req.params.id, slug1: req.params.id1 },
    async function (err, deletingPost) {
      if (err) {
        req.flash('error', err.message)
        res.redirect('/')
      } else {
        try {
          await cloudinary.v2.uploader.destroy(deletingPost.imageId)
          await Comment.remove({
            _id: { $in: deletingPost.comments },
          })
          deletingPost.remove()
          req.flash('success', 'Post deleted ')
          res.redirect('/')
        } catch (err) {
          req.flash('error', err.message)
          return res.redirect('back')
        }
      }
    }
  )
}
