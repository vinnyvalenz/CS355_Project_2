const chpConnection = require('../database/CHPConnection');

// Controller that interacts with database to retrieve data.
class RatingController {
    constructor() {
        console.log('Rating Controller Initialized!');
    }
    
    // Fetches all ratings
    async ratings(ctx) {
        console.log('Controller HIT: RatingController::ratings');
        return new Promise((resolve, reject) => {
            
            chpConnection.query({
                sql: `SELECT * FROM Rating;`
            }, (err, res) => {
                if(err) {
                    reject(`Error querying CHp.purchase: ${err}`);
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

    // Fetches a single Rating
    async rating(ctx) {
        console.log('Controller HIT: RatingController::rating');
        return new Promise((resolve, reject) => {
            console.log(ctx.body);
            const usr = { 
                "user_id":ctx.body[0].user_id, 
                "video_id":ctx.body[0].video_id
            };
            
            chpConnection.query({
                sql: `SELECT * FROM Rating 
                        WHERE user_id = ? and video_id = ?;`,
                values: [usr.user_id, usr.video_id]
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

    // Gets all Ratings of a Video
    async titleRatings(ctx) {
        console.log('Controller HIT: RatingController::titleRatings');
        return new Promise((resolve, reject) => {
            
            chpConnection.query({
                sql:`SELECT * FROM Rating 
                        WHERE video_id IN (
                            SELECT id FROM Video 
                            WHERE title = ?
                        );`,
                values: [ctx.params.title]
            }, (err, res) => {
                if(err) {
                    reject(`Error querying CHp.Rating: ${err}`);
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

    // Gets all ratings by a User
    async userRatings(ctx) {
        console.log('Controller HIT: RatingController::userRatings');
        return new Promise((resolve, reject) => {
            const usr = ctx.request.body;

            chpConnection.query({
                sql: `SELECT * FROM Rating 
                        WHERE user_id IN (
                            SELECT id FROM User
                            WHERE email = ?
                        );`,
                values: [usr.email]
            }, (err, res) => {
                if(err) {
                    reject(`Error querying CHp.Rating: ${err}`);
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

    // Add a new Rating
    async addRating(ctx, next) {
        console.log('Controller HIT: RatingController::addRating');
       return new Promise((resolve, reject) => {
            const r = ctx.request.body;
            const usr = { 
                "user_id":ctx.body[0].user_id, 
                "video_id":ctx.body[0].video_id
            };

            chpConnection.query({
               sql: `INSERT INTO Rating
                        (
                        user_id,
                        video_id,
                        postedOn,
                        rating,
                        r_comment
                        ) VALUES (?, ?, current_timestamp(), ?, ?);`,
               values:[
                        usr.user_id, 
                        usr.video_id,
                        r.rating,
                        r.r_comment
                    ]
            }, (err, res) => {
               if(err) {
                   reject(err);
               }
               ctx.body = [usr];
               ctx.status = 200;
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

    // Update a Rating
    async updateRating(ctx, next) {
        console.log('Controller HIT: RatingController::updateRating');
        return new Promise((resolve, reject) => {
            const r = ctx.request.body;
            const usr = { 
                "user_id":ctx.body[0].user_id, 
                "video_id":ctx.body[0].video_id
            };
            
            chpConnection.query({
                sql: `UPDATE Rating 
                        SET 
                            postedOn = current_timestamp(),
                            rating = ?,
                            r_comment = ?
                        WHERE user_id = ? AND video_id = ?;`,
                values: [
                        r.rating, 
                        r.r_comment, 
                        usr.user_id, 
                        usr.video_id
                    ]
            }, (err, res) => {
                if(err) {
                    reject(err);
                }
                ctx.body = [usr];
                ctx.status = 200;
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

    // Get User and Video ID
    async getUserVideoID(ctx, next) {
        console.log('Controller HIT: ViewedController::getUserVideoId');
        return new Promise((resolve, reject) => {
            const p = ctx.request.body;

           chpConnection.query({
                sql:`SELECT u.id as user_id, v.id as video_id 
                        FROM User u, Video v
                        WHERE u.email = ? AND v.title = ?;`,
                values: [p.email, p.title]
            }, (err, res) => {
                if(err) {
                    reject(err);
                }
                ctx.body = res;
                ctx.status = 200;
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

     // Delete a Rating 
     async deleteRating(ctx, next) {
        console.log('Controller HIT: ViewedController::deleteRating');
        return new Promise((resolve, reject) => {
            const vw = { 
                "user_id":ctx.body[0].user_id, 
                "video_id":ctx.body[0].video_id
            };
            chpConnection.query({
                sql:`DELETE FROM Viewed WHERE user_id = ? AND video_id = ?;`,
                values: [vw.user_id, vw.video_id]
            }, (err, res) => {
                if(err) {
                    reject(err);
                }
                ctx.body = res;
                ctx.status = 200;
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

module.exports = RatingController;