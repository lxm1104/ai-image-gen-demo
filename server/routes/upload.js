/**
 * 上传API路由
 * 处理用户上传的图片
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');

// 确保上传目录存在
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 配置Multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 只接受图片文件
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('只允许上传图片文件!'), false);
  }
  cb(null, true);
};

// 创建multer实例
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制5MB
  },
  fileFilter: fileFilter
});

/**
 * POST /api/upload
 * 处理图片上传
 * 返回上传图片的URL
 */
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '请上传图片文件' });
    }

    logger.info(`图片上传成功: ${req.file.filename}`);
    
    // 构建图片URL
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: '图片上传成功',
      imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    logger.error(`图片上传失败: ${error.message}`);
    res.status(500).json({ success: false, message: '图片上传失败', error: error.message });
  }
});

module.exports = router;
