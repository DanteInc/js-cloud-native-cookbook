# Implementing latency based routing

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch10/regional-health-check --path cncb-regional-health-check
2. cd cncb-regional-health-check
3. npm install
4. npm test
5. npm run dp:lcl:w -- -s your-name
6. curl -v https://<your-name>-cncb-latency-based-routing.example.com/<your-name>/hello
7. npm run dp:lcl:e -- -s your-name
8. curl -v https://cncb-latency-based-routing.example.com/hello
9. npm run rm:lcl:w -- -s your-name
10. npm run rm:lcl:e -- -s your-name
