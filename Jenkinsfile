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
                        sh '''
                        rm -rf node_modules dist .serverless package-lock.json
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

        stage('Install Dependencies') {
            when { expression { params.ACTION == 'deploy' } }
            steps {
                sh 'npm install'
                sh 'npm install -g serverless'
            }
        }

        stage('Build') {
            when { expression { params.ACTION == 'deploy' } }
            steps {
                sh 'npx tsc'
            }
        }

        stage('Debug Config') {
            steps {
                sh 'cat serverless.yml || type serverless.yml'
            }
        }

        stage('Deploy / Remove') {
            steps {
                script {
                    def regions = params.REGIONS.split(',')

                    for (region in regions) {
                        region = region.trim()

                        if (params.ACTION == 'deploy') {
                            sh """
                            npx serverless deploy \
                              --region ${region} \
                              --stage ${params.STAGE} \
                              --param="cidrIp=${params.CIDR_IP}"
                            """
                        } else {
                            sh """
                            npx serverless remove \
                              --region ${region} \
                              --stage ${params.STAGE}
                            """
                        }
                    }
                }
            }
        }
    }
}