const aws = require('aws-sdk');
const moment = require('moment');
const uuid = require('uuid');

module.exports.load = (thing, context, callback) => {
    const id = uuid.v1();
    const now = moment().utc();

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `stream1/${now.format('YYYY')}/${now.format('MM')}/${now.format('DD')}/${now.format('HH')}/${id}.json`,
        ContentType: 'application/json',
        Body: JSON.stringify({
            id,
            type: 't1',
            timestamp: now.valueOf(),
            tags: {
                region: process.env.AWS_REGION,
            },
        }),
    };

    console.log('params: %j', params);

    const s3 = new aws.S3();
    s3.putObject(params, callback);
};
