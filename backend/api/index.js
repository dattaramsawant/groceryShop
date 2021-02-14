const express = require('express');
const router = express.Router();

const users=require('./users');
const auth=require('./auth');
const department=require('./department');
const subDepartment=require('./subDepartment');
const brand=require('./brand');
const product=require('./product');
const bulkProductImg=require('./productImgBulk');

router.use('/users',users);
router.use('/auth',auth);
router.use('/department',department);
router.use('/subDepartment',subDepartment);
router.use('/brand',brand);
router.use('/product',product);
router.use('/productImg',bulkProductImg);

module.exports = router;