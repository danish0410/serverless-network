pipeline {
    agent any

    parameters {
        string(name: 'REGION', defaultValue: 'us-east-2')
        string(name: 'STAGE', defaultValue: 'prod')
    }

    environment {
        NODE_ENV = "production"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'feature_30-03-2026',
                    credentialsId: 'private-key-jenkins',
                    url: 'https://github.com/danish0410/serverless-network.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                npm install -g aws-cdk
                npm install -g serverless
                npm install
                '''
            }
        }

        stage('Build CDK') {
            steps {
                sh '''
                npm run build || true
                '''
            }
        }

        stage('Configure AWS') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials'
                ]]) {
                    sh '''
                    aws configure set region ${REGION}
                    '''
                }
            }
        }

        stage('Deploy Infrastructure') {
            steps {
                sh '''
                echo "Deploying to region: ${REGION}"

                # Serverless deployment (uses config.yml)
                serverless deploy \
                  --region ${REGION} \
                  --stage ${STAGE}
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful"
        }
        failure {
            echo "❌ Deployment failed"
        }
    }
}