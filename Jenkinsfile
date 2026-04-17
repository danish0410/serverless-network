 pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-south-2'
    }

    parameters {
        choice(name: 'ACTION', choices: ['deploy', 'remove'], description: 'Deploy or Remove stack')
        choice(name: 'STAGE', choices: ['dev', 'staging', 'prod'], description: 'Environment')

        string(name: 'REGIONS', defaultValue: 'ap-south-2', description: 'Comma separated regions')
        string(name: 'CIDR_IP', defaultValue: '49.204.141.47/32', description: 'Your IP for Bastion access')
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning workspace..."
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                echo "📥 Cloning latest repo..."
                checkout scm
            }
        }

        // ✅ OPTION 2: Install Serverless ALWAYS (separate stage)
        stage('Install Serverless (Required)') {
            steps {
                script {
                    echo "⚙️ Installing Serverless..."

                    if (isUnix()) {
                        sh 'npm install serverless@3 --save-dev'
                    } else {
                        bat 'npm install serverless@3 --save-dev'
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
                        npm install serverless@3 --save-dev
                        '''
                    } else {
                        bat '''
                        npm install
                        npm install serverless@3 --save-dev
                        '''
                    }
                }
            }
        }

        stage('Verify Serverless') {
            steps {
                script {
                    echo "🔎 Checking Serverless version..."

                    if (isUnix()) {
                        sh 'npx serverless --version'
                    } else {
                        bat 'npx serverless --version'
                    }
                }
            }
        }

        stage('Build TypeScript') {
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
                        sh """
                        npx serverless print \
                          --stage ${params.STAGE} \
                          --param="cidrIp=${params.CIDR_IP}"
                        """
                    } else {
                        bat """
                        npx serverless print ^
                          --stage ${params.STAGE} ^
                          --param="cidrIp=${params.CIDR_IP}"
                        """
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

                        echo "🌍 Processing region: ${region}"

                        if (params.ACTION == 'deploy') {

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
        always {
            echo "🧾 Pipeline execution completed"
        }
        success {
            echo "✅ ${params.ACTION.toUpperCase()} SUCCESS"
        }
        failure {
            echo "❌ Pipeline FAILED"
        }
    }
}