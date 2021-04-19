const express = require('express');
const router = express.Router();

const users=require('./users');
const auth=require('./auth');
const department=require('./department');
const subDepartment=require('./subDepartment');
const brand=require('./brand');
const product=require('./product');
const bulkProductImg=require('./productImgBulk');
const type=require('./type');
const departmentReport=require('./departmentReport');
const subdepartmentReport=require('./subDepartmentReport');
const brandReport=require('./brandReport');

router.use('/users',users);
router.use('/auth',auth);
router.use('/department',department);
router.use('/subDepartment',subDepartment);
router.use('/brand',brand);
router.use('/product',product);
router.use('/productImg',bulkProductImg);
router.use('/type',type);
router.use('/departmentReport',departmentReport);
router.use('/subdepartmentReport',subdepartmentReport);
router.use('/brandReport',brandReport);

module.exports = router;