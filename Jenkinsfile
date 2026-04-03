pipeline {
    agent any

    parameters {
        string(name: 'REGION', defaultValue: 'us-east-2')
        string(name: 'STAGE', defaultValue: 'prod')
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Code already checked out"
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                // npm install -g serverless
                // npm install -g aws-cdk
                npm install
                '''
            }
        }

        stage('Build CDK') {
            steps {
                bat '''
                // npm run build
                npx tsc
                '''
            }
        }

        stage('Deploy') {
            steps {
                bat '''
                serverless deploy --region %REGION% --stage %STAGE%
                '''
            }
        }
    }
}