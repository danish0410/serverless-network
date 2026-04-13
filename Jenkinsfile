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

        stage('Clean Workspace') {
            steps {
                script {
                    echo "🧹 Cleaning workspace..."

                    // Jenkins built-in cleanup
                    cleanWs()

                    // Extra safety cleanup (important for Serverless)
                    if (isUnix()) {
                        sh '''
                        rm -rf node_modules
                        rm -rf dist
                        rm -rf .serverless
                        rm -rf package-lock.json
                        '''
                    } else {
                        bat '''
                        rmdir /s /q node_modules
                        rmdir /s /q dist
                        rmdir /s /q .serverless
                        del package-lock.json
                        '''
                    }
                }
            }
        }

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
                    echo "📦 Installing dependencies..."

                    if (isUnix()) {
                        sh '''
                        npm install
                        npm install -g serverless
                        '''
                    } else {
                        bat '''
                        npm install
                        npm install -g serverless
                        '''
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
                    echo "🔨 Building TypeScript..."

                    if (isUnix()) {
                        sh '''
                        npx tsc
                        echo "📂 Checking dist folder..."
                        ls -l dist
                        '''
                    } else {
                        bat '''
                        npx tsc
                        echo Checking dist folder...
                        dir dist
                        '''
                    }
                }
            }
        }

        stage('Verify Build Output') {
            when {
                expression { params.ACTION == 'deploy' }
            }
            steps {
                script {
                    echo "🔍 Verifying handler.js exists..."

                    if (isUnix()) {
                        sh '''
                        if [ ! -f dist/handler.js ]; then
                          echo "❌ handler.js not found in dist"
                          exit 1
                        fi
                        '''
                    } else {
                        bat '''
                        if not exist dist\\handler.js (
                          echo ❌ handler.js not found in dist
                          exit /b 1
                        )
                        '''
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
        always {
            echo "🧾 Pipeline execution completed"
        }
    }
}