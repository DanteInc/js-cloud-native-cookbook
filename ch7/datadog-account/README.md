# Monitoring a cloud-native system

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch7/datadog-account --path cncb-datadog-account
2. cd cncb-datadog-account
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE

## References
* [Datadog AWS Integration](https://docs.datadoghq.com/integrations/amazon_web_services/#setup)
  