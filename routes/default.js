const userRouter = require('./user');
const videoRouter = require('./video');
const viewedRouter = require('./viewed');
const purchaseRouter = require('./purchase');
const ratingRouter = require('./rating');

const defaultRouter = require('koa-router')({
    prefix: '/api'
});

defaultRouter.get('/', ctx => {
    ctx.status = 200;
    ctx.body = "Default Route Found!\n";
});

defaultRouter.use(
    videoRouter.routes(),
    userRouter.routes(),
    purchaseRouter.routes(),
    viewedRouter.routes(),
    ratingRouter.routes()
);

module.exports = api => {
    api.use(defaultRouter.routes());
};