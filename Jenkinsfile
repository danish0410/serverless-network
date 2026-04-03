pipeline {
    agent any

    parameters {
        choice(name: 'STAGE', choices: ['dev', 'staging', 'prod'], description: 'Deployment stage')
        string(name: 'REGIONS', defaultValue: 'ap-south-2,us-east-2', description: 'Comma-separated regions')
    }

    stages {

        stage('Install Dependencies') {
            steps {
                bat '''
                npm install
                '''
            }
        }

        stage('Build') {
            steps {
                bat '''
                npx tsc
                '''
            }
        }

        stage('Deploy Multi-Region') {
            steps {
                script {
                    def regions = params.REGIONS.split(',')

                    for (region in regions) {
                        region = region.trim()

                        bat """
                        npx serverless deploy --region ${region} --stage ${params.STAGE}
                        """
                    }
                }
            }
        }
    }
}