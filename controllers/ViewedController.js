const chpConnection = require('../database/CHPConnection');

// Controller that interacts with database to retrieve data.
class ViewedController {
    constructor() {
        console.log('Viewed Controller Initialized!');
    }

    // Fetches all Views
    async views(ctx) {
        console.log('Controller HIT: ViewedController::views');
        return new Promise((resolve, reject) => {
            
            chpConnection.query({
                sql: `SELECT * FROM Viewed;`
            }, (err, res) => {
                if(err) {
                    reject(`Error querying CHp.Viewed: ${err}`);
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
    
    // Fetches all Viewed by User
    async viewed(ctx) {
        console.log('Controller HIT: ViewedController::viewed');
        return new Promise((resolve, reject) => {
            const usr = ctx.request.body;
            const query = `SELECT u.fname, u.lname, vi.title, v.viewedOn
                            FROM Viewed v 
                                JOIN  Video vi ON v.video_id = vi.id 
                                JOIN User u ON v.user_id = u.id 
                            WHERE u.email = ?
                            ORDER BY v.viewedOn DESC;`
            
            chpConnection.query({
                sql: query,
                values: [usr.email]
            }, (err, res) => {
                if(err) {
                    reject(`Error querying CHP.Viewed: ${err}`);
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

    // Fetches Top Videos watched in the past day
    async topViewedToday(ctx) {
        console.log('Controller HIT: ViewedController::topViewedToday');
        return new Promise((resolve, reject) => {
            const email = ctx.params.viewed;

            chpConnection.query({
                sql: 'SELECT * FROM top_viewed_today;',
                values: [email]
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

    // Add a View by a User
    async addView(ctx, next) {
        console.log('Controller HIT: ViewedController::addView');
       return new Promise((resolve, reject) => {
            const vw = { 
                "uID":ctx.body[0].user_id, 
                "vID":ctx.body[0].video_id
            };
            chpConnection.query({
                sql: `INSERT INTO Viewed(
                                         user_id,
                                         video_id
                                         ) VALUES (?, ?);`,
                values: [vw.uID, vw.vID]
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

    // Get User and Video ID
    async getUserVideoID(ctx, next) {
        console.log('Controller HIT: ViewedController::getUserVideoId');
        return new Promise((resolve, reject) => {
            const usr = ctx.request.body;
           chpConnection.query({
                sql:`SELECT u.id as user_id, v.id as video_id 
                        FROM User u, Video v
                        WHERE u.email = ? AND v.title = ?;`,
                values: [usr.email, ctx.params.video]
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

    // Delete a View
    async deleteView(ctx, next) {
        console.log('Controller HIT: ViewedController::deleteView');
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

module.exports = ViewedController;