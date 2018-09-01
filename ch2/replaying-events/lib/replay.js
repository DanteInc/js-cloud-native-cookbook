exports.command = 'replay [bucket] [prefix]'
exports.desc = 'Replay the events in [bucket] for [prefix]'

const _ = require('highland');
const lodash = require('lodash');
const aws = require('aws-sdk');
aws.config.setPromisesDependency(require('bluebird'));

// const now = require('moment')().utc();

exports.builder = {
    bucket: {
        alias: 'b',
        default: 'cncb-data-lake-s3-john-bucket-396po814rlai'
    },
    prefix: {
        alias: 'p',
        default: `john-cncb-event-stream-s1`
        // default: `${now.format('YYYY')}/${now.format('MM')}/${now.format('DD')}/`
    },
    function: {
        alias: 'f',
        default: 'john-cncb-replaying-events-listener'
    },
    dry: {
        alias: 'd',
        default: true,
        type: 'boolean'
    },
    region: {
        alias: 'r',
        default: 'us-east-1'
    },
}

exports.handler = (argv) => {
    console.log('args: %j', argv);

    aws.config.logger = process.stdout;
    aws.config.region = argv.region;

    const s3 = new aws.S3();
    const lambda = new aws.Lambda();

    paginate(s3, argv)
        .flatMap(obj => get(s3, argv, obj))
        .flatMap(event => invoke(lambda, argv, event))
        .collect()
        .each(list => console.log('count:', list.length))
        ;
}

const paginate = (s3, options) => {
    let marker = undefined;

    return _((push, next) => {
        const params = {
            Bucket: options.bucket,
            Prefix: options.prefix,
            Marker: marker
        };

        s3.listObjects(params).promise()
            // .tap(print)
            .then(data => {
                if (data.IsTruncated) {
                    marker = lodash.last(data.Contents)['Key'];
                } else {
                    marker = undefined;
                }

                data.Contents.forEach(obj => {
                    push(null, obj);
                })
            })
            .catch(err => {
                push(err, null);
            })
            .finally(() => {
                if (marker) {
                    next();
                } else {
                    push(null, _.nil);
                }
            })
    });
}

const get = (s3, options, obj) => {
    const params = {
        Bucket: options.b,
        Key: obj.Key
    };

    return _(
        s3.getObject(params).promise()
            .then(data => Buffer.from(data.Body).toString())
    )
        .split()
        // .tap(console.log)
        .filter(line => line.length != 0)
        .map(JSON.parse)
        ;
}

const invoke = (lambda, options, event) => {
    print(event.event);

    let payload = {
        Records: [
            {
                kinesis: {
                    partitionKey: event.kinesisRecordMetadata.partitionKey,
                    sequenceNumber: event.kinesisRecordMetadata.sequenceNumber,
                    data: Buffer.from(JSON.stringify(event.event)).toString('base64'),
                    kinesisSchemaVersion: '1.0',
                },
                // invokeIdentityArn: identityarn,
                eventID: `${event.kinesisRecordMetadata.shardId}:${event.kinesisRecordMetadata.sequenceNumber}`,
                eventName: 'aws:kinesis:record',
                eventSourceARN: event.firehoseRecordMetadata.deliveryStreamArn,
                eventSource: 'aws:kinesis',
                eventVersion: '1.0',
                awsRegion: event.firehoseRecordMetadata.region,
            }
        ]
    };

    print(payload);

    payload = Buffer.from(JSON.stringify(payload));

    const params = {
        FunctionName: options.function,
        InvocationType: options.dry ? 'DryRun' : payload.length <= 100000 ? 'Event' : 'RequestResponse',
        Payload: payload,
    };

    return _(
        lambda.invoke(params).promise()
        // .tap(print)
    );
}

const print = data => console.log(JSON.stringify(data, null, 2));
