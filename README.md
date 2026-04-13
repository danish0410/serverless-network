Architecture Flow

User (Browser)
    ↓
CloudFront (Custom Domain + SSL)
    ↓
API Gateway HTTP API
    ↓
Cognito (Auth)
    ↓
Lambda Functions

⚙️ Prerequisites
Node.js (>= 18)
Serverless Framework
AWS CLI configured
Jenkins configured (Windows agent supported)

📁 Project Structure
project/
│── serverless.yml
│── config.yml
│── handler.js / handler.ts
│── package.json
│── Jenkinsfile
│── README.md

🔧 Deployment via Jenkins
Parameters
Parameter	Description
ACTION	deploy / remove
STAGE	dev / staging / prod
REGIONS	Multi-region deployment
CIDR_IP	Allowed IP

🔁 Jenkins Flow
Install dependencies
Build TypeScript
Deploy to multiple regions
Pass CIDR dynamically

🧠 Key Features Implemented
1 HTTP API (Cost Optimization)
	Uses HTTP API instead of REST API
	~70% cheaper

2 CloudFront (Custom Domain Alternative)
Instead of API Gateway domain:
	CloudFront handles:
		SSL
		Custom domain
		Caching
		Global routing

3 Cognito Authentication (SaaS Login)
	User Pool created
	JWT-based authentication
	Secures API endpoints

▶️ How to Deploy Manually
npm install
npx tsc

npx serverless deploy \
  --region ap-south-2 \
  --stage dev \
  --param="cidrIp=YOUR_IP/32"