const UserController = new (require('../controllers/UserController'))();
const userRouter = require('koa-router')({
    prefix: '/user'
});


userRouter.get('/', UserController.users);
userRouter.get('/info', UserController.user);
userRouter.post('/', UserController.addUser, UserController.users);
userRouter.put('/user-update', UserController.updateUser, UserController.user);
userRouter.put('/payment-update', UserController.updateUserPayment, UserController.user);

// FUNCTION: fn_get_mo_inv_amt()
userRouter.get('/invoice', UserController.userInvoice);
// PROCEDURE: proc_update_sub()
userRouter.put('/sub-update', UserController.updateUserSubscription, UserController.user);


module.exports = userRouter;