# JavaScript Cloud Native Development Cookbook

Continuously deliver serverless cloud-native solutions on AWS, Azure and GCP

## Chapters
1. [Getting Started with Cloud-Native](./ch1/README.md)
2. [Applying the Event-Sourcing and CQRS Patterns](./ch2/README.md)
3. [Implementing Autonomous Services](./ch3/README.md)
4. [Leveraging the Edge of the Cloud](./ch4/README.md)
5. [Securing Cloud-Native Systems](./ch5/README.md)
6. [Building a Continuous Deployment Pipeline](./ch6/README.md)
7. [Optimizing Observability](./ch7/README.md)
8. [Designing for Failure](./ch8/README.md)
9. [Optimizing Performance](./ch9/README.md)
10. [Deploying to Multiple Regions](./ch10/README.md)
11. [Welcoming Polycloud](./ch11/README.md)

## Setup Development Environment:

1. Install Node Version Manager: https://github.com/creationix/nvm or https://github.com/coreybutler/nvm-windows
2. Install Node.js: `nvm install 8`
3. Install the Serverless Framework: `npm install serverless -g`
4. Create an AWS account: https://aws.amazon.com/free
5. Log into AWS and create an IAM user with admin privileges, a password, and an access key: https://serverless.com/framework/docs/providers/aws/guide/credentials#creating-aws-access-keys
6. Configure the default profile with your access key: `sls config credentials --provider aws --key 1234 --secret 5678`
7. Create an environment variable to hold your personal development stage: `export MY_STAGE=john <!-- use your name -->`
8. Install VS Code editor (optional): https://code.visualstudio.com
