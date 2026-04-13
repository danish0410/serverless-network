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

        stage('Checkout Code') {
            steps {
                echo "📥 Cloning latest repo..."
                checkout scm
            }
        }

        stage('Clean Workspace') {
            steps {
                cleanWs()

                script {
                    if (isUnix()) {
                        sh 'rm -rf node_modules dist .serverless package-lock.json'
                    } else {
                        bat '''
                        rmdir /s /q node_modules 2>nul
                        rmdir /s /q dist 2>nul
                        rmdir /s /q .serverless 2>nul
                        del package-lock.json 2>nul
                        '''
                    }
                }
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

        stage('Build') {
            when { expression { params.ACTION == 'deploy' } }
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

        stage('Debug Config') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                        echo "Printing serverless config..."
                        npx serverless print
                        '''
                    } else {
                        bat '''
                        echo Printing serverless config...
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
        success {
            echo "✅ ${params.ACTION} SUCCESS"
        }
        failure {
            echo "❌ PIPELINE FAILED"
        }
    }
}