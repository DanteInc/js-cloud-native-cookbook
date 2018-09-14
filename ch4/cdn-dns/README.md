# Associating a custom domain name with a cdn

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch4/cdn-dns --path cncb-cdn-dns
2. cd cncb-cdn-dns
3. npm install
4. update serverless.yml with hosted zone id and domain name
5. npm test
6. npm run build
7. npm run dp:lcl -- -s $MY_STAGE
8. browse <WebsiteURL> see stack output
9. npm run rm:lcl -- -s $MY_STAGE
