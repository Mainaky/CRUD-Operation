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
                echo "📥 Checking out code from repository..."
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "🔨 Building Docker images..."
                sh '''
                    docker-compose build
                '''
            }
        }

        stage('Test Backend') {
            steps {
                echo "✅ Testing backend..."
                sh '''
                    docker-compose run --rm backend npm test || true
                '''
            }
        }

        stage('Test Frontend') {
            steps {
                echo "✅ Testing frontend..."
                sh '''
                    docker-compose run --rm frontend npm test -- --watchAll=false || true
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo "🚀 Deploying containers..."
                sh '''
                    docker-compose down || true
                    docker-compose up -d
                    docker-compose ps
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo "🔍 Performing health checks..."
                sh '''
                    sleep 5
                    curl -f http://localhost:5000/users || exit 1
                    echo "✅ Backend is running"
                    curl -f http://localhost:3000 || exit 1
                    echo "✅ Frontend is running"
                '''
            }
        }
    }

    post {
        always {
            echo "📊 Pipeline execution completed"
            sh '''
                docker-compose logs > build-logs.txt
                docker-compose ps
            '''
        }

        success {
            echo "✅ Deployment successful!"
            sh '''
                bash notify-discord.sh "SUCCESS" "Docker containers deployed successfully! ✅\n- Frontend: http://localhost:3000\n- Backend: http://localhost:5000"
            '''
        }

        failure {
            echo "❌ Pipeline failed. Rolling back..."
            sh '''
                docker-compose down
                bash notify-discord.sh "FAILURE" "Build pipeline failed ❌\nCheck Jenkins logs for details."
            '''
        }

        unstable {
            echo "⚠️ Pipeline unstable"
            sh '''
                bash notify-discord.sh "UNSTABLE" "Build completed with warnings ⚠️"
            '''
        }
    }
}
