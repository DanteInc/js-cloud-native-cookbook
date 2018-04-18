module.exports.listener = (event, context, callback) => {
  console.log('event: %j', event);
  
  callback(null, 'success');
};
