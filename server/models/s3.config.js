const AWS = require('aws-sdk'),
  fs = require('fs')
const s3Config = require('../config/').s3

const {
  accessKeyId,
  secretAccessKey,
  region,
  apiVersion,
  bucket,
  originalBucket
} = s3Config
AWS.config.update({ region })

const s3 = new AWS.S3({
  apiVersion,
  accessKeyId,
  secretAccessKey
})

const deleteFromS3 = keys => {
  const buckets = [bucket, originalBucket]
  const params = {
    Bucket: null,
    Delete: {
      Objects: keys,
      Quiet: false
    }
  }
  for (const s3Bucket of buckets) {
    params.Bucket = s3Bucket
    s3.deleteObjects(params, function(err, data) {
      if (err) throw err
    })
  }
}

const uploadOriginal = async ({ key, path }, cb) => {
  const fileContent = fs.readFileSync(path),
    params = {
      Bucket: originalBucket,
      Key: `${key}`,
      Body: fileContent
    }

  const upload = s3.upload(params),
    promise = upload.promise()

  promise.then(
    function(data) {
      cb(data.Location)
    },
    function(err) {
      throw err
    }
  )
}

const uploadConvertedFile = async ({ key, path }, cb) => {
  const fileContent = fs.readFileSync(path),
    params = {
      Bucket: bucket,
      Key: `${key}`,
      Body: fileContent
    }

  const upload = s3.upload(params),
    promise = upload.promise()

  promise.then(
    function(data) {
      cb(data.Location)
    },
    function(err) {
      throw err
    }
  )
}

const uploadToS3 = async (request, response, next) => {
  const { key, resizedPath, path } = request.s3UploadData

  try {
    //pls fix. Stop descend to callback hell.
    uploadConvertedFile({ key, path: resizedPath }, function(convertedS3Url) {
      request.convertedS3Url = convertedS3Url
      uploadOriginal({ key, path }, function(originalS3Url) {
        request.originalS3Url = originalS3Url
        request.keyToDelete = key
        next()
      })
    })
  } catch (error) {
    console.error(error)
  }
}

module.exports = { deleteFromS3, uploadToS3 }
