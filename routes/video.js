const VideoController = new (require('../controllers/VideoController'))();
const videoRouter = require('koa-router')({
    prefix: '/video'
});

videoRouter.get('/', VideoController.videos);
videoRouter.get('/:video', VideoController.video);
videoRouter.get('/Genre/:genre', VideoController.videosInGenre);
videoRouter.post('/', VideoController.addVideo, VideoController.videos);
videoRouter.put('/:video', VideoController.updateVideoPrice, VideoController.video);
videoRouter.put('/', VideoController.updateVideoStatus, VideoController.video);

module.exports = videoRouter;