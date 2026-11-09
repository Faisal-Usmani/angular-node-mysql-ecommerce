const express=require('express');
const orderController=require('../controllers/orderController')
const checktoken=require('../shared/checkToken')
const router=express.Router() 


router.post('/addOrder',checktoken,orderController.addOrder);
router.get('/allOrder',checktoken,orderController.allOrder);
router.get('/orderProducts',checktoken,orderController.orderProducts);


module.exports=router;