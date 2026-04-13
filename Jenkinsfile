pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-south-2'
    }

    parameters {
        choice(name: 'ACTION', choices: ['deploy', 'remove'], description: 'Deploy or remove stack')
        choice(name: 'STAGE', choices: ['dev', 'staging', 'prod'], description: 'Environment stage')

        string(name: 'REGIONS', defaultValue: 'ap-south-2', description: 'Comma-separated regions')
        string(name: 'CIDR_IP', defaultValue: '49.204.141.47/32', description: 'Your IP in CIDR format')
    }

    stages {

        // ✅ FIX 1: CLEAN FIRST
        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning workspace..."
                cleanWs()
            }
        }

        // ✅ THEN CHECKOUT
        stage('Checkout Code') {
            steps {
                echo "📥 Cloning latest repo..."
                checkout scm
            }
        }

        // ✅ DEBUG (VERY USEFUL)
        stage('Verify Files') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'ls -l'
                    } else {
                        bat 'dir'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            when { expression { params.ACTION == 'deploy' } }
            steps {
                script {
                    echo "📦 Installing dependencies..."

                    if (isUnix()) {
                        sh '''
                        npm install
                        '''
                    } else {
                        bat '''
                        npm install
                        '''
                    }
                }
            }
        }

        stage('Build') {
            when { expression { params.ACTION == 'deploy' } }
            steps {
                script {
                    echo "🔨 Building TypeScript..."

                    if (isUnix()) {
                        sh 'npx tsc'
                    } else {
                        bat 'npx tsc'
                    }
                }
            }
        }

        stage('Debug Serverless Config') {
            steps {
                script {
                    echo "🔍 Validating serverless.yml..."

                    if (isUnix()) {
                        sh '''
                        npx serverless print
                        '''
                    } else {
                        bat '''
                        npx serverless print
                        '''
                    }
                }
            }
        }

        stage('Deploy / Remove') {
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

                            echo "🚀 Deploying to ${region}"

                            if (isUnix()) {
                                sh """
                                npx serverless deploy \
                                  --region ${region} \
                                  --stage ${params.STAGE} \
                                  --param="cidrIp=${params.CIDR_IP}"
                                """
                            } else {
                                bat """
                                npx serverless deploy ^
                                  --region ${region} ^
                                  --stage ${params.STAGE} ^
                                  --param="cidrIp=${params.CIDR_IP}"
                                """
                            }

                        } else {

                            echo "🗑 Removing from ${region}"

                            if (isUnix()) {
                                sh """
                                npx serverless remove \
                                  --region ${region} \
                                  --stage ${params.STAGE}
                                """
                            } else {
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