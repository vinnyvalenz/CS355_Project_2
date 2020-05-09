const PurchaseController = new (require('../controllers/PurchaseController'))();
const purchaseRouter = require('koa-router')({
    prefix: '/purchase'
});

purchaseRouter.get('/', PurchaseController.getUserVideoID, PurchaseController.purchase);
purchaseRouter.get('/all', PurchaseController.purchases);
purchaseRouter.get('/user', PurchaseController.userPurchases);
purchaseRouter.get('/:title', PurchaseController.titlePurchases);
purchaseRouter.post('/', PurchaseController.getUserVideoID, PurchaseController.addPurchase, PurchaseController.purchase);
purchaseRouter.put('/', PurchaseController.getUserVideoID, PurchaseController.updatePurchaseDate, PurchaseController.purchase);

module.exports = purchaseRouter;