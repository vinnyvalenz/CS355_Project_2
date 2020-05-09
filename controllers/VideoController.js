const chpConnection = require('../database/CHPConnection');

// Controller that interacts with database to retrieve data.
class VideoController {
    constructor() {
        console.log('Video Controller Initialized!');
    }
    
    // Fetches all Videos
    async videos(ctx) {
        console.log('Controller HIT: VideoController::videos');
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Video';
            
            chpConnection.query(query, (err, res) => {
                if(err) {
                    reject(`Error querying CHP.Video: ${err}`);
                }
                
                ctx.body = res;
                ctx.status = 200;
                
                resolve();
            });
        })
         .catch(err => {
            ctx.status = 500;
            ctx.body = err;
        });
    }

    // Fetches a single Video
    async video(ctx) {
        console.log('Controller HIT: VideoController::video');
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Video WHERE title = ?;';
            const title = ctx.params.video;

            chpConnection.query({
                sql: query,
                values: [title]
            }, (err, res) => {
                if(err) {
                    reject(err);
                } 

                ctx.body = res;
                ctx.status = 200;
                resolve();
            });
        })
         .catch(err => {
            ctx.status = 500;
            ctx.body = {
                error: `Internal Server Error: ${err}`,
                status: 500
            };
        });
    }

    // Fetches Videos in Genre
    async videosInGenre(ctx) {
        console.log('Controller HIT: VideoController::video');
        return new Promise((resolve, reject) => {
            const query = `SELECT v.title, v.price, v.rated, v.length, v.season, v.episode, G1.genre FROM 
                                Video v,
                                (SELECT * FROM Genre
                                    WHERE genre = ?
                                ) as G1
                            WHERE v.id = G1.video_id;`;

            chpConnection.query({
                sql: query,
                values: [ctx.params.genre]
            }, (err, res) => {
                if(err) {
                    reject(err);
                } 

                ctx.body = res;
                ctx.status = 200;
                resolve();
            });
        })
         .catch(err => {
            ctx.status = 500;
            ctx.body = {
                error: `Internal Server Error: ${err}`,
                status: 500
            };
        });
    }

    // Add a new Video
    async addVideo(ctx, next) {
        console.log('Controller HIT: VideoController::addVideo');
       return new Promise((resolve, reject) => {
           const vd = ctx.request.body;
           chpConnection.query({
               sql: `INSERT INTO Video(
                                        title, 
                                        released, 
                                        rated, 
                                        price, 
                                        length, 
                                        season, 
                                        episode
                                        ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
               values: [vd.title, 
                        vd.released, 
                        vd.rated, 
                        vd.price, 
                        vd.length,
                        vd.season,
                        vd.episode
                    ]
           }, (err, res) => {
               if(err) {
                   reject(err);
               }

               resolve();
           });
           
       })
        .then(await next)
        .catch(err => {
           ctx.status = 500;
           ctx.body = {
               error: `Internal Server Error: ${err}`,
               status: 500
           };
       });
    }

    // Update price of a Video
    async updateVideoPrice(ctx, next) {
        console.log('Controller HIT: VideoController::updateVideoPrice');
        return new Promise((resolve, reject) => {
            const vd = ctx.request.body;
            chpConnection.query({
                sql: `
                    UPDATE Video 
                    SET 
                        price = ?
                    WHERE title = ?
                    `,
                values: [vd.price, ctx.params.video]
            }, (err, res) => {
                if(err) {
                    reject(err);
                }

                resolve();
            });
        })
         .then(await next)
         .catch(err => {
            ctx.status = 500;
            ctx.body = {
                error: `Internal Server Error: ${err}`,
                status: 500
            };
        });
    }

    // Update a Videos 'isFree' boolean 
    async updateVideoStatus(ctx, next) {
        console.log('Controller HIT: VideoController::updateVideoStatus');
        return new Promise((resolve, reject) => {
            const vd = ctx.request.body
            ctx.params = {"video":vd.title};
            chpConnection.query({
                sql:`UPDATE Video 
                        SET isFree = NOT isFree
                    WHERE title = ?;`,
                values: [vd.title]
            }, (err, res) => {
                if(err) {
                    reject(err);
                }
                resolve();
            });
        })
        .then(await next)
        .catch(err => {
            ctx.status = 500;
            ctx.body = {
                error: `Internal Server Error: ${err}`,
                status: 500
            };
        });
    }
}

module.exports = VideoController;