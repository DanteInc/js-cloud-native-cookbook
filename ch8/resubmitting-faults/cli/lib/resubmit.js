exports.command = 'resubmit [bucket] [prefix]'
exports.desc = 'Resubmit the faults in [bucket] for [prefix]'

const _ = require('highland');
const lodash = require('lodash');
const aws = require('aws-sdk');
aws.config.setPromisesDependency(require('bluebird'));

const now = require('moment')().utc();

exports.builder = {
    bucket: {
        alias: 'b',
        default: 'cncb-fault-monitor-john-bucket-396po814rlai'
    },
    prefix: {
        alias: 'p',
        default: `${now.format('YYYY')}/${now.format('MM')}/${now.format('DD')}/`
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
        .map(JSON.parse);
}

const invoke = (lambda, options, event) => {
    print(event);

    const Payload = JSON.stringify({
        Records: [event.uow.record],
    });

    const params = {
        FunctionName: event.tags.functionName,
        InvocationType: options.dry ? 'DryRun' : Payload.length <= 100000 ? 'Event' : 'RequestResponse',
        Payload: Buffer.from(Payload),
    };

    return _(
        lambda.invoke(params).promise()
        // .tap(print)
    );
}

const print = data => console.log(JSON.stringify(data, null, 2));
