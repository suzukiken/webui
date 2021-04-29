React web example using Amplify.
This code authorize users with Google that integrated to AWS Cognito UserPool.

* `npm install`
* `npm run start`
* `npm run build`

delopy following enviroment variables with your values.
This is supposed to be used with CD with AWS CodePipeline.

```
export COGNITO_IDPOOL_ID=ap-northeast-1:0a0a0a0a-0a-0a0a-0a0a0
export COGNITO_USERPOOL_ID=ap-northeast-1_aaAAAA
export COGNITO_USERPOOL_WEBCLIENT_ID=0a0aa0aa0aa
export COGNITO_USERPOOL_DOMAINPREFIX=aaa
export COGNITO_USERPOOL_SIGNIN_URL=https://aa.aaaa.aa/
export COGNITO_USERPOOL_SIGNOUT_URL=https://aa.aaaa.aa/
```

These variables will be used to generate src/aws-exports.js
with following command in buildspec.

> envsubst < aws-exports.template.js > src/aws-exports.js