pipeline {
    agent any

    environment {
        IMAGE_NAME = "assignment27"
        DOCKER_CREDENTIALS_ID = "docker-hub-credentials"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning GitHub repository...'
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker containers...'
                bat 'docker-compose build'
            }
        }

        stage('Start Containers') {
            steps {
                echo 'Starting Docker containers...'
                bat 'docker-compose up -d'
            }
        }

        stage('Check Running Containers') {
            steps {
                bat 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }
}