module.exports.hello = (event, context, callback) => {
  console.log('event: %j', event);  
  callback(null, 'success');
};
