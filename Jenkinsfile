pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-south-2'
    }

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

        string(
            name: 'CIDR_IP',
            defaultValue: '49.204.141.47/32',
            description: 'Enter your IP in CIDR format'
        )
    }

    stages {

        stage('Validate Input') {
            steps {
                script {
                    if (!params.REGIONS?.trim()) {
                        error "❌ REGIONS parameter is empty"
                    }

                    if (!params.CIDR_IP?.trim()) {
                        error "❌ CIDR_IP is required"
                    }

                    echo "✅ Inputs validated"
                }
            }
        }

        stage('Install Dependencies') {
            when {
                expression { params.ACTION == 'deploy' }
            }
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm install'
                        sh 'npm install -g serverless'
                    } else {
                        bat 'npm install'
                        bat 'npm install -g serverless'
                    }
                }
            }
        }

        stage('Build') {
            when {
                expression { params.ACTION == 'deploy' }
            }
            steps {
                script {
                    if (isUnix()) {
                        sh 'npx tsc'
                    } else {
                        bat 'npx tsc'
                    }
                }
            }
        }

        stage('Execute Multi-Region Action') {
            steps {
                script {
                    def regions = params.REGIONS.split(',')

                    for (region in regions) {
                        region = region.trim()

                        if (!region) {
                            echo "⚠️ Skipping empty region"
                            continue
                        }

                        echo "🌍 Processing region: ${region}"

                        if (params.ACTION == 'deploy') {

                            echo "🚀 Deploying to ${region} (${params.STAGE})"

                            if (isUnix()) {
                                sh """
                                npx serverless deploy \
                                  --region ${region} \
                                  --stage ${params.STAGE} \
                                  --param="cidrIp=${params.CIDR_IP}" \
                                  --verbose
                                """
                            } else {
                                bat """
                                npx serverless deploy ^
                                  --region ${region} ^
                                  --stage ${params.STAGE} ^
                                  --param="cidrIp=${params.CIDR_IP}" ^
                                  --verbose
                                """
                            }

                        } else if (params.ACTION == 'remove') {

                            echo "🗑 Removing stack from ${region} (${params.STAGE})"

                            if (isUnix()) {
                                sh """
                                npx serverless remove \
                                  --region ${region} \
                                  --stage ${params.STAGE} \
                                  --param="cidrIp=${params.CIDR_IP}" \
                                  --verbose
                                """
                            } else {
                                bat """
                                npx serverless remove ^
                                  --region ${region} ^
                                  --stage ${params.STAGE} ^
                                  --param="cidrIp=${params.CIDR_IP}" ^
                                  --verbose
                                """
                            }
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