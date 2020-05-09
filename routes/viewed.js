const ViewedController = new (require('../controllers/ViewedController'))();
const viewedRouter = require('koa-router')({
    prefix: '/viewed'
});

viewedRouter.get('/', ViewedController.views);
viewedRouter.get('/user', ViewedController.viewed);
viewedRouter.get('/top-today', ViewedController.topViewedToday);
viewedRouter.post('/:video', ViewedController.getUserVideoID, ViewedController.addView, ViewedController.viewed);
viewedRouter.delete('/:video', ViewedController.getUserVideoID, ViewedController.deleteView, ViewedController.viewed);

module.exports = viewedRouter;