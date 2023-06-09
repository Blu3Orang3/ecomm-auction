import Shop from '../models/shop.model';
import Product from '../models/product.model';
import extend from 'lodash/extend';
import errorHandler from './../helpers/dbErrorHandler';
import formidable from 'formidable';
import fs from 'fs';
import defaultImage from './../../client/assets/images/defaultShop.png';

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({
        message: 'Image could not be uploaded',
      });
    }
    let shop = new Shop(fields);
    shop.owner = req.profile;
    if (files.image) {
      try {
        shop.image.data = fs.readFileSync(files.image.filepath);
        shop.image.contentType = files.image.type;
      } catch (err) {
        return res.status(400).json({
          error: 'Failed to read uploaded file',
        });
      }
    }
    try {
      let result = await shop.save();
      res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const list = async (req, res) => {
  try {
    let shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const shopByID = async (req, res, next, id) => {
  try {
    let shop = await Shop.findById(id).populate('owner', '_id name').exec();
    if (!shop)
      return res.status(400).json({
        error: 'Shop not found',
      });
    req.shop = shop;
    next();
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve shop',
    });
  }
};

const listByOwner = async (req, res) => {
  try {
    let shops = await Shop.find({ owner: req.profile._id }).populate(
      'owner',
      '_id name'
    );
    res.json(shops);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isOwner = (req, res, next) => {
  const isOwner = req.shop && req.auth && req.shop.owner._id == req.auth._id;

  if (!isOwner) {
    return res.status('403').json({
      error: 'User is not authorized',
    });
  }
  next();
};

const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({
        message: 'Photo could not be uploaded',
      });
    }
    let shop = req.shop;
    shop = extend(shop, fields);
    shop.updated = Date.now();
    if (files.image) {
      try {
        shop.image.data = fs.readFileSync(files.image.filepath);
        shop.image.contentType = files.image.type;
      } catch (err) {
        return res.status(400).json({
          error: 'Failed to read uploaded file',
        });
      }
    }
    try {
      let result = await shop.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const remove = async (req, res) => {
  try {
    let shop = req.shop;
    console.log('--------------------------loading',shop._id);
    let deletedShop = await Shop.deleteOne(shop._id)
    // let deletedProducts = await Shop.deleteOne(shop._id)
    console.log('--------------------------works',shop._id);
    // let deletedShop = await shop.remove();
   
    res.json(deletedShop);
    
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const read = (req, res) => {
  req.shop.image = undefined;
  return res.json(req.shop);
};

const photo = (req, res, next) => {
  if (req.shop.image.data) {
    res.set('Content-Type', req.shop.image.contentType);
    return res.send(req.shop.image.data);
  }
  next();
};
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + defaultImage);
};

export default {
  create,
  shopByID,
  photo,
  defaultPhoto,
  list,
  listByOwner,
  read,
  isOwner,
  update,
  remove,
};
