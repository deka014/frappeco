const express = require('express')
const router = express.Router()
const multer = require('multer')

//importing middleware
const middleware = require('../middleware/index')

//multer storage confguration
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname)
  },
})

//importing controllers
const foodController = require('../controllers/foodController')

//Specific images backend handle
const imageFilter = function (req, file, cb) {
  // accept image files only withe these extension
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false)
  }
  cb(null, true)
}

const upload = multer({ storage: storage, fileFilter: imageFilter })

//Router Api setup using controllers

router.get('/', foodController.getFood)

router.get('/new', middleware.isLoggedIn, foodController.getAddFood)

//ajax upload
router.post('/save', upload.single('file'), foodController.postImageUpload)

router.post(
  '/',
  middleware.isLoggedIn,
  upload.any(),
  foodController.postBlogUpload
)

router.get('/recipes', foodController.getRecipesCategory)

router.get('/food-blogs', foodController.getFoodBlogsCategory)

router.get('/food-facts', foodController.getFoodFactsCategory)

router.get('/blogging-tips', foodController.getBlogTipsCategory)

router.get('/food-affairs', foodController.getFoodAffairsCategory)

router.get('/food-stories', foodController.getFoodStoriesCategory)

router.get('/:id/:id1', foodController.getShowBlog)

// edit food
router.get(
  '/:id/:id1/edit',
  middleware.checkFoodOwnership,
  foodController.getEditBlog
)

//update food
router.put(
  '/:id/:id1',
  middleware.checkFoodOwnership,
  upload.any(),
  foodController.updateBlog
)

//destroy food

router.delete(
  '/:id/:id1',
  middleware.checkFoodOwnership,
  foodController.deleteBlog
)

//middleware

module.exports = router
