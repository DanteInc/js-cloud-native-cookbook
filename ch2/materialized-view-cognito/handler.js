const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.listener = (event, context, cb) => {
  // console.log('event: %j', event);

  _(event.Records)
    .map(recordToEvent)
    .tap(print)
    .filter(forThingCreated)
    .map(toThing)
    .flatMap(put)
    .tap(print)
    .collect()
    .toCallback(cb);
};

const recordToEvent = r => JSON.parse(Buffer.from(r.kinesis.data, 'base64'));

// additional conditions account for other recipes exercised first
const forThingCreated = e => e.type === 'thing-created' && e.thing && e.thing.new && e.thing.new.identityId;

const toThing = event => ({
  id: event.thing.new.id,
  name: event.thing.new.name,
  description: event.thing.new.description,
  asOf: event.timestamp,
  identityId: event.thing.new.identityId
});

const put = thing => {
  const params = {
    IdentityPoolId: process.env.IDENTITY_POOL_ID,
    IdentityId: thing.identityId,
    DatasetName: 'things'
  };

  console.log('params: %j', params);

  const cognitosync = new aws.CognitoSync();

  return _(
    cognitosync.listRecords(params).promise()
      .then(data => {
        params.SyncSessionToken = data.SyncSessionToken;
        params.RecordPatches = [{
          Key: 'thing',
          Value: JSON.stringify(thing),
          Op: 'replace',
          SyncCount: data.DatasetSyncCount
        }];

        return cognitosync.updateRecords(params).promise()
      })
  );
  
};

const print = v => console.log('%j', v);

