# Commands Reference - Assignment 27 Docker + Jenkins CI/CD

## 📋 Table of Contents
1. [Startup Commands](#startup-commands)
2. [Checking Status](#checking-status)
3. [Viewing Logs](#viewing-logs)
4. [Stopping & Cleanup](#stopping--cleanup)
5. [Testing Commands](#testing-commands)
6. [Jenkins Setup](#jenkins-setup)
7. [Database Commands](#database-commands)
8. [Troubleshooting](#troubleshooting)
9. [Docker Image Management](#docker-image-management)

---

## ⚙️ Startup Commands

### Start All Containers (Fresh Start)
```powershell
cd c:\Users\maina\Downloads\31\assignment27\assignment27
docker-compose up -d
```

### Start with Fresh Build
```powershell
docker-compose up -d --build
```

### Start with Rebuild and No Cache
```powershell
docker-compose up -d --build --no-cache
```

### Start Specific Container Only
```powershell
# Start just backend
docker-compose up -d backend

# Start just frontend
docker-compose up -d frontend

# Start just mongo
docker-compose up -d mongo

# Start just jenkins
docker-compose up -d jenkins
```

### Start and View Logs in Real-Time
```powershell
docker-compose up
```
(Press Ctrl+C to stop viewing logs but containers keep running)

---

## 🔍 Checking Status

### Check All Running Containers
```powershell
docker-compose ps
```

### Check All Containers (including stopped)
```powershell
docker-compose ps -a
```

### Check Docker Images
```powershell
docker images | findstr assignment27
```

### Check Networks
```powershell
docker network ls
docker network inspect assignment27_app-network
```

### Check Volumes
```powershell
docker volume ls
docker volume inspect assignment27_mongo_data
docker volume inspect assignment27_jenkins_data
```

### Get Container IDs
```powershell
docker ps -q
```

### Check Disk Usage
```powershell
docker system df
```

---

## 📊 Viewing Logs

### View All Container Logs
```powershell
docker-compose logs
```

### View Logs for Specific Service
```powershell
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# MongoDB logs
docker-compose logs mongo

# Jenkins logs
docker-compose logs jenkins
```

### View Last N Lines of Logs
```powershell
# Last 50 lines
docker-compose logs --tail=50

# Last 20 lines of backend
docker-compose logs --tail=20 backend
```

### Follow Logs in Real-Time
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f jenkins

# Stop following: Press Ctrl+C
```

### View Logs with Timestamps
```powershell
docker-compose logs -t
docker-compose logs -t backend
```

### Export Logs to File
```powershell
docker-compose logs > logs.txt
docker-compose logs backend > backend_logs.txt
```

---

## 🛑 Stopping & Cleanup

### Stop All Containers (Keep Data)
```powershell
docker-compose stop
```

### Stop Specific Container
```powershell
docker-compose stop backend
docker-compose stop jenkins
```

### Stop and Remove All Containers
```powershell
docker-compose down
```

### Stop, Remove Containers AND Delete Volumes
⚠️ **WARNING: This deletes all data in MongoDB and Jenkins!**
```powershell
docker-compose down -v
```

### Stop, Remove, and Delete Images
⚠️ **WARNING: This deletes everything!**
```powershell
docker-compose down -v --rmi all
```

### Remove Only Stopped Containers
```powershell
docker container prune -f
```

### Remove Unused Images
```powershell
docker image prune -f
```

### Remove All Unused Data (Images, Containers, Networks, Volumes)
⚠️ **WARNING: Removes ALL unused Docker data!**
```powershell
docker system prune -a -v
```

---

## ✅ Testing Commands

### Test Backend API - Get All Users
```powershell
curl http://localhost:5000/users
```

### Test Backend API - Create a User
```powershell
$body = @{
    name = "John Doe"
    age = 30
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/users" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Test Backend API - Update a User
```powershell
# Replace USER_ID with actual ID from create response
$body = @{
    name = "Jane Doe"
    age = 25
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/users/USER_ID" `
  -Method PUT `
  -ContentType "application/json" `
  -Body $body
```

### Test Backend API - Delete a User
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/users/USER_ID" `
  -Method DELETE
```

### Test Frontend
```powershell
curl http://localhost:3000
```

### Test MongoDB Connection
```powershell
docker exec mongo mongosh --eval "db.version()"
```

### Health Check - All Services
```powershell
# Backend
curl -f http://localhost:5000/users -ErrorAction SilentlyContinue; Write-Host "✅ Backend running"

# Frontend
curl -f http://localhost:3000 -ErrorAction SilentlyContinue; Write-Host "✅ Frontend running"

# MongoDB
docker exec mongo mongosh --eval "print('✅ MongoDB running')"
```

---

## 🚀 Jenkins Setup

### Get Jenkins Admin Password
```powershell
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Access Jenkins
```
http://localhost:8081
```

### View Jenkins Logs
```powershell
docker logs jenkins --tail=50
docker logs -f jenkins
```

### Restart Jenkins
```powershell
docker restart jenkins
```

### Give Jenkins Docker Access (if needed)
```powershell
docker exec -u root jenkins usermod -aG docker jenkins
docker restart jenkins
```

### Execute Groovy Script in Jenkins
```powershell
docker exec jenkins cat /var/jenkins_home/secrets/master.key
```

### Backup Jenkins Configuration
```powershell
docker exec jenkins tar czf - /var/jenkins_home | Out-File jenkins-backup.tar.gz
```

---

## 💾 Database Commands

### Access MongoDB Shell
```powershell
docker exec -it mongo mongosh
```

### Inside MongoDB Shell:
```javascript
// Switch to database
use simplecrud

// View all users
db.users.find()

// View user count
db.users.countDocuments()

// Insert test user
db.users.insertOne({ name: "Test User", age: 25 })

// Update user
db.users.updateOne({ _id: ObjectId("...") }, { $set: { age: 30 } })

// Delete user
db.users.deleteOne({ _id: ObjectId("...") })

// Drop collection
db.users.drop()

// Exit
exit
```

### View MongoDB Data from PowerShell
```powershell
docker exec mongo mongosh --eval "use simplecrud; db.users.find()"
```

### Backup MongoDB Data
```powershell
docker exec mongo mongodump --out /backup
docker cp mongo:/backup ./backup
```

### Clear All Data in MongoDB
```powershell
docker exec mongo mongosh --eval "use simplecrud; db.users.deleteMany({})"
```

---

## 🔧 Troubleshooting

### Check Container Health
```powershell
docker-compose ps
# All should show "Up" status
```

### View Error Logs
```powershell
docker-compose logs backend | findstr error
docker-compose logs frontend | findstr error
docker-compose logs jenkins | findstr error
```

### Restart All Containers
```powershell
docker-compose restart
```

### Restart Specific Container
```powershell
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mongo
docker-compose restart jenkins
```

### Check Port Availability
```powershell
# Check if port is in use
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :8081
netstat -ano | findstr :27017

# Kill process using port (if needed)
taskkill /PID <PID_NUMBER> /F
```

### Check Network Connectivity Between Containers
```powershell
# Can backend reach mongo?
docker exec backend ping -c 3 mongo

# Can frontend reach backend?
docker exec frontend ping -c 3 backend

# Can jenkins reach backend?
docker exec jenkins ping -c 3 backend
```

### View Container Inspect Details
```powershell
docker inspect backend
docker inspect mongo
docker inspect jenkins
```

### Test DNS Resolution in Container
```powershell
docker exec backend nslookup mongo
docker exec frontend nslookup backend
```

### Enter Container Shell
```powershell
# Backend shell
docker exec -it backend sh

# Frontend shell
docker exec -it frontend sh

# MongoDB shell
docker exec -it mongo mongosh

# Jenkins shell
docker exec -it jenkins bash
```

### Clean Up Dangling Images
```powershell
docker image prune -f
```

### Rebuild Specific Image
```powershell
docker-compose build --no-cache backend
docker-compose build --no-cache frontend
```

### View Docker Compose Config
```powershell
docker-compose config
```

---

## 🐳 Docker Image Management

### List All Images
```powershell
docker images
```

### Remove Specific Image
```powershell
docker rmi assignment27-backend
docker rmi assignment27-frontend
docker rmi jenkins/jenkins:lts
docker rmi mongo:latest
```

### Tag Image for Registry
```powershell
docker tag assignment27-backend myregistry/assignment27-backend:latest
```

### Push Image to Registry
```powershell
docker push myregistry/assignment27-backend:latest
```

### View Image Layers
```powershell
docker history assignment27-backend
```

### Build Image Manually
```powershell
cd backend
docker build -t assignment27-backend .
cd ..

cd frontend
docker build -t assignment27-frontend .
cd ..
```

---

## 🎯 Common Workflows

### Complete Fresh Start
```powershell
# 1. Stop everything and delete all data
docker-compose down -v

# 2. Start fresh
docker-compose up -d

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f
```

### Deploy and Verify
```powershell
# 1. Build and start
docker-compose up -d --build

# 2. Wait 10 seconds
Start-Sleep -Seconds 10

# 3. Run health check
curl http://localhost:5000/users
curl http://localhost:3000
docker exec mongo mongosh --eval "db.version()"

# 4. Check logs
docker-compose logs --tail=20
```

### Safe Restart (Keep Data)
```powershell
# 1. Stop containers
docker-compose stop

# 2. Start containers
docker-compose up -d

# 3. Verify
docker-compose ps
```

### Full Reset (Delete Everything)
```powershell
# 1. Stop and remove with volumes
docker-compose down -v

# 2. Remove images
docker-compose down -v --rmi all

# 3. Rebuild and start
docker-compose up -d --build

# 4. Verify
docker-compose ps
```

### Debug Specific Service
```powershell
# 1. View recent logs
docker-compose logs backend

# 2. Follow logs
docker-compose logs -f backend

# 3. Enter container
docker exec -it backend sh

# 4. Check files
docker exec backend ls -la /app
```

---

## 📌 Important Notes

- **Data Persistence**: MongoDB data is saved in `assignment27_mongo_data` volume
- **Jenkins Data**: Jenkins configuration is saved in `assignment27_jenkins_data` volume
- **Network**: All containers communicate via `assignment27_app-network`
- **Ports**:
  - Frontend: 3000
  - Backend: 5000
  - Jenkins: 8081
  - MongoDB: 27017

## ⚠️ Safety Rules

1. ✅ **Always use `docker-compose down`** (not `docker stop`) to stop containers properly
2. ✅ **Use `docker-compose down -v` only when you want to DELETE all data**
3. ✅ **Backup MongoDB before running destructive commands**
4. ✅ **Test in development before running in production**
5. ✅ **Keep Jenkins configuration backed up**

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start all | `docker-compose up -d` |
| Stop all | `docker-compose stop` |
| Remove all | `docker-compose down` |
| Delete data | `docker-compose down -v` |
| View status | `docker-compose ps` |
| View logs | `docker-compose logs -f` |
| Restart | `docker-compose restart` |
| Build fresh | `docker-compose up -d --build` |
| Test backend | `curl http://localhost:5000/users` |
| Access MongoDB | `docker exec -it mongo mongosh` |
| Jenkins password | `docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword` |
| Health check | `docker-compose ps && curl http://localhost:5000/users` |

---

**Last Updated**: May 6, 2026
**Project**: Assignment 27 - Docker + Jenkins CI/CD Pipeline
