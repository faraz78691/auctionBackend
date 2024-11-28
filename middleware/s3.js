const fs = require('fs');
const S3 = require('aws-sdk/clients/s3')
const hash = require('random-hash'); 
const bucketName = 'glistener';
const region = 'us-east-1';
const path=require('path')

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path)
  let temp = file.originalname.replace(/\s+/g, '').split('.');
  const filename = temp[0] + '-' + hash.generateHash({length: 5}) + path.extname(file.originalname);
  console.log(filename, 'filename');
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: filename
  }

  return s3.upload(uploadParams).promise()
}

exports.uploadFile = uploadFile


// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream = getFileStream