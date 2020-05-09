const chpConnection = require('../database/CHPConnection');

// Controller that interacts with database to retrieve data.
class UserController {
    constructor() {
        console.log('User Controller Initialized!');
    }
    
    // Fetches all Users
    async users(ctx) {
        console.log('Controller HIT: UserController::users');
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM User;';
            
            chpConnection.query(query, (err, res) => {
                if(err) {
                    reject(`Error querying CHP.User: ${err}`);
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

    // Fetches a single User
    async user(ctx) {
        console.log('Controller HIT: UserController::user');
        return new Promise((resolve, reject) => {
            const usr = ctx.request.body;
            
            chpConnection.query({
                sql: 'SELECT * FROM User WHERE email = ?;',
                values: [usr.email]
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

    // Add a new User
    async addUser(ctx, next) {
        console.log('Controller HIT: UserController::addUser');
       return new Promise((resolve, reject) => {
           const usr = ctx.request.body;
           chpConnection.query({
               sql: `INSERT INTO User
                            (
                            fname,
                            lname,
                            email,
                            payment
                            ) VALUES (?, ?, ?, ?);`,
               values: [usr.fname,
                        usr.lname,
                        usr.email,
                        usr.payment
                        ]
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

    // Update a User
    async updateUser(ctx, next) {
        console.log('Controller HIT: UserController::updateUserPayment');
        return new Promise((resolve, reject) => {
            const usr = ctx.request.body;
            chpConnection.query({
                sql:`UPDATE User 
                    SET 
                        fname = ?,
                        lname = ?,
                        email = ?
                    WHERE email = ?;`,
                values: [usr.fname, usr.lname, usr.email, usr.curr_email]
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

    // Update payment method of a User
    async updateUserPayment(ctx, next) {
        console.log('Controller HIT: UserController::updateUserPayment');
        return new Promise((resolve, reject) => {
            const usr = ctx.request.body;
            ctx.params = {"email":usr.email};
            chpConnection.query({
                sql:`UPDATE User 
                        SET 
                            payment = ?
                        WHERE email = ?;`,
                values: [usr.payment, usr.email]
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

    // Update a Users Subscription Status 
    async updateUserSubscription(ctx, next) {
        console.log('Controller HIT: UserController::updateUserSubscription');
        return new Promise((resolve, reject) => {
            const usr = ctx.request.body
            ctx.params = { "email": usr.email }

            chpConnection.query({
                sql:`call proc_update_sub(?);`,
                values: [usr.email]
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

    // Fetch Users Monthly Invoice by Function 
    async userInvoice(ctx, next) {
        console.log('Controller HIT: UserController::userInvoice');
        return new Promise((resolve, reject) => {
            const usr = ctx.request.body

            chpConnection.query({
                sql:`SELECT 
                        addDate(curdate(), interval - 1 month) as start_date,
                        current_date() as end_date,
                        fn_get_mo_inv_amt(?) as invoice;`,
                values: [usr.email]
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
}

module.exports = UserController;