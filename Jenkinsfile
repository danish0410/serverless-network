pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-south-2'
    }

    parameters {
        choice(name: 'ACTION', choices: ['deploy', 'remove'])
        choice(name: 'STAGE', choices: ['dev', 'staging', 'prod'])

        string(name: 'REGIONS', defaultValue: 'ap-south-2')
        string(name: 'CIDR_IP', defaultValue: '49.204.141.47/32')
    }

    stages {

        // ✅ FIXED ORDER
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

        stage('Install Dependencies') {
            when { expression { params.ACTION == 'deploy' } }
            steps {
                script {
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

        // ✅ FIXED HERE
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
            echo "✅ ${params.ACTION} SUCCESS"
        }
        failure {
            echo "❌ Pipeline FAILED"
        }
    }
}