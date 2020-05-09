const chpConnection = require('../database/CHPConnection');

// Controller that interacts with database to retrieve data.
class PurchasController {
    constructor() {
        console.log('Purchase Controller Initialized!');
    }
    
    // Fetches all purchases
    async purchases(ctx) {
        console.log('Controller HIT: PurchasController::purchases');
        return new Promise((resolve, reject) => {
            
            chpConnection.query({
                sql: `SELECT * FROM Purchase;`
            }, (err, res) => {
                if(err) {
                    reject(`Error querying CHP.Purchase: ${err}`);
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

    // Fetches a single Purchase
    async purchase(ctx) {
        console.log('Controller HIT: PurchasController::purchase');
        return new Promise((resolve, reject) => {
            console.log(ctx.body);
            const p = { 
                "user_id":ctx.body[0].user_id, 
                "video_id":ctx.body[0].video_id
            };
            
            chpConnection.query({
                sql: `SELECT * FROM Purchase 
                        WHERE user_id = ? and video_id = ?;`,
                values: [p.user_id, p.video_id]
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

    // Gets all Purchases of a given Video
    async titlePurchases(ctx) {
        console.log('Controller HIT: PurchasController::titlePurchases');
        return new Promise((resolve, reject) => {
            
            chpConnection.query({
                sql:`SELECT * FROM Purchase 
                        WHERE video_id IN (
                            SELECT id FROM Video 
                            WHERE title = ?
                        );`,
                values: [ctx.params.title]
            }, (err, res) => {
                if(err) {
                    reject(`Error querying CHP.Purchase: ${err}`);
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

    // Gets all Purchases made by User
    async userPurchases(ctx) {
        console.log('Controller HIT: PurchasController::userPurchases');
        return new Promise((resolve, reject) => {
            const p = ctx.request.body;

            chpConnection.query({
                sql: `SELECT * FROM Purchase 
                        WHERE user_id IN (
                            SELECT id FROM User
                            WHERE email = ?
                        );`,
                values: [p.email]
            }, (err, res) => {
                if(err) {
                    reject(`Error querying CHP.Purchase: ${err}`);
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

    // Add a new Purchase
    async addPurchase(ctx, next) {
        console.log('Controller HIT: PurchasController::addPurchase');
       return new Promise((resolve, reject) => {
            const p = { 
            "user_id":ctx.body[0].user_id, 
            "video_id":ctx.body[0].video_id
            };
            console.log(p);
            chpConnection.query({
               sql: `INSERT INTO Purchase
                        (
                        user_id,
                        video_id
                        ) VALUES (?, ?);`,
               values: [p.user_id, p.video_id]
            }, (err, res) => {
               if(err) {
                   reject(err);
               }
               ctx.body = [p];
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

    // Update a Purchase date
    async updatePurchaseDate(ctx, next) {
        console.log('Controller HIT: PurchasController::updatePurchaseDate');
        return new Promise((resolve, reject) => {
            const p = { 
                "user_id":ctx.body[0].user_id, 
                "video_id":ctx.body[0].video_id
            };
            chpConnection.query({
                sql: `UPDATE Purchase 
                        SET 
                            purchasedOn = current_timestamp()
                        WHERE user_id = ? AND video_id = ?;`,
                values: [p.user_id, p.video_id]
            }, (err, res) => {
                if(err) {
                    reject(err);
                }
                ctx.body = [p];
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
}

module.exports = PurchasController;