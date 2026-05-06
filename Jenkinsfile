pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "docker.io"
        IMAGE_NAME = "assignment27"
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out code..."
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "Building Docker images..."
                bat '''
                    docker-compose build
                '''
            }
        }

        stage('Test Backend') {
            steps {
                echo "Testing backend..."
                bat '''
                    docker-compose run --rm backend npm test
                '''
            }
        }

        stage('Test Frontend') {
            steps {
                echo "Testing frontend..."
                bat '''
                    docker-compose run --rm frontend npm test -- --watchAll=false
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying containers..."
                bat '''
                    docker-compose down
                    docker-compose up -d
                    docker-compose ps
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo "Performing health checks..."
                bat '''
                    timeout /t 5
                    curl http://localhost:5000/users
                    curl http://localhost:3000
                '''
            }
        }
    }

    post {

        always {
            echo "Pipeline execution completed"

            bat '''
                docker-compose logs > build-logs.txt
                docker-compose ps
            '''
        }

        success {
            echo "Deployment successful!"
        }

        failure {
            echo "Pipeline failed. Rolling back..."

            bat '''
                docker-compose down
            '''
        }

        unstable {
            echo "Pipeline unstable"
        }
    }
}