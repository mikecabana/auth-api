const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authorize = require('./authorize').authorize;
const multer = require('multer');
const MulterAzureStorage = require('multer-azure-storage');
const upload = multer({
    storage: new MulterAzureStorage({
        azureStorageConnectionString: 'DefaultEndpointsProtocol=https;AccountName=honchostorage;AccountKey=8y8i1ExKV2Vj7rjkmByXRXMDSyFp2pxTudWrwScYvucr6lybD9/9zaFel9Mr58WP6ckkn0L7kmMgdsiBF84kIA==;EndpointSuffix=core.windows.net',
        containerName: 'documents',
        containerSecurity: 'blob'
    }),
    limits: 1024 * 1024 * 25 // 25Mb
}).single('file');
const DocumentModel = require('../models/documents');



router.get('/', authorize, (req, res) => {

    DocumentModel
    .find()
    .select('-__v')
    .exec()
    .then((docs) => {
        const response = {
            count: docs.length,
            items: docs
        }
        res.status(200).json(response);
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        });
    });
});


router.post('/upload', authorize, (req, res) => {

    upload(req, res, err => {
        if (err) {
            res.status(500).json({
                error: err
            });
        }
        const file = req.file;

        const newDocument = new DocumentModel({
            _id: new mongoose.Types.ObjectId(),
            label: file.blobName,
            name: req.body.name,
            description: req.body.description,
            url: file.url,
            size: file.size, // bytes
            container: file.container,
            mimeType: file.mimetype,
            uploadDate: new Date().toISOString(),
        });

        newDocument
            .save()
            .then((result) => {
                res.status(201).json({
                    message: 'file uploaded',
                    url: file.url
                });
            })
            .catch((err) => {
                res.status(500).json({
                    error: err
                })
            });
    });

});

module.exports = router;