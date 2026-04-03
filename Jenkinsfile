pipeline {
    agent any

    parameters {
        choice(
            name: 'ACTION',
            choices: ['deploy', 'remove'],
            description: 'Choose action: deploy or remove stack'
        )

        choice(
            name: 'STAGE',
            choices: ['dev', 'staging', 'prod'],
            description: 'Deployment stage'
        )

        string(
            name: 'REGIONS',
            defaultValue: 'ap-south-2,us-east-2',
            description: 'Comma-separated regions'
        )
    }

    stages {

        stage('Install Dependencies') {
            when {
                expression { params.ACTION == 'deploy' }
            }
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            when {
                expression { params.ACTION == 'deploy' }
            }
            steps {
                bat 'npx tsc'
            }
        }

        stage('Execute Multi-Region Action') {
            steps {
                script {
                    def regions = params.REGIONS.split(',')

                    for (region in regions) {
                        region = region.trim()

                        if (params.ACTION == 'deploy') {
                            echo "🚀 Deploying to ${region} (${params.STAGE})"

                            bat """
                            npx serverless deploy ^
                              --region ${region} ^
                              --stage ${params.STAGE}
                            """
                        } else if (params.ACTION == 'remove') {
                            echo "🗑 Removing stack from ${region} (${params.STAGE})"

                            bat """
                            npx serverless remove ^
                              --region ${region} ^
                              --stage ${params.STAGE}
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ ${params.ACTION.toUpperCase()} completed successfully"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}