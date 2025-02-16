// snippet-start:[ses.JavaScript.createclientv3]
const { SESClient } = require("@aws-sdk/client-ses")
// Set the AWS Region.

console.log(process.env.AWS_ACCESS_KEY)
console.log(process.env.AWS_SECRET_KEY)

const REGION = "ap-south-1";
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});
module.exports = { sesClient };
