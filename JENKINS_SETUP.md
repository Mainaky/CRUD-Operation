# Jenkins Setup Guide for Assignment 27

## Prerequisites
- Jenkins installed and running
- Docker installed on Jenkins agent/node
- Git configured on Jenkins

## Jenkins Configuration Steps

### 1. Create New Pipeline Job
1. Click **New Item** → **Pipeline**
2. Enter Job Name: `assignment27-docker-deploy`
3. Click **OK**

### 2. Pipeline Configuration
- **Definition**: Pipeline script from SCM
- **SCM**: Git
- **Repository URL**: Your GitHub/Git repo URL
- **Branch**: `*/main` or `*/master`
- **Script Path**: `Jenkinsfile`

### 3. Build Triggers (Optional)
- **GitHub hook trigger**: Poll SCM with `H/15 * * * *` (every 15 min)
- **Poll SCM**: `H/15 * * * *`

### 4. Configure Credentials
Add Docker Hub credentials:
1. Go to **Manage Jenkins** → **Manage Credentials**
2. Add **Username with password**
3. ID: `docker-hub-credentials`
4. Username: Your Docker Hub username
5. Password: Your Docker Hub token

### 5. Configure Jenkins Node
Ensure the Jenkins node has:
```bash
docker --version
docker-compose --version
```

### 6. Run the Pipeline
1. Click **Build Now**
2. Check **Console Output** for logs
3. Monitor the 6 stages:
   - Checkout
   - Build
   - Test Backend
   - Test Frontend
   - Deploy
   - Health Check

## Expected Output
```
[Pipeline] stage('Deploy')
✅ All 3 containers running:
  - mongo
  - backend (port 5000)
  - frontend (port 3000)

[Pipeline] stage('Health Check')
✅ Backend is running
✅ Frontend is running
```

## Troubleshooting

### Docker socket permission denied
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Jenkinsfile not found
- Push `Jenkinsfile` to root of repository
- Verify **Script Path** is set to `Jenkinsfile`

### Containers won't start
- Check disk space: `df -h`
- Remove old images: `docker image prune -a`
- Check logs: `docker-compose logs`

## Next Steps
- Add email notifications on failure
- Push images to Docker registry
- Add rollback strategy
- Integrate with Discord webhooks
