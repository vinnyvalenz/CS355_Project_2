const RatingController = new (require('../controllers/RatingController'))();
const ratingRouter = require('koa-router')({
    prefix: '/rating'
});

ratingRouter.get('/', RatingController.getUserVideoID, RatingController.rating);
ratingRouter.get('/all', RatingController.ratings);
ratingRouter.get('/user', RatingController.userRatings);
ratingRouter.get('/:title', RatingController.titleRatings);
ratingRouter.post('/', RatingController.getUserVideoID, RatingController.addRating, RatingController.rating);
ratingRouter.put('/', RatingController.getUserVideoID, RatingController.updateRating, RatingController.rating);
ratingRouter.delete('/', RatingController.deleteRating);

module.exports = ratingRouter;