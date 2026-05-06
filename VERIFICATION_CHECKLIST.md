# Verification Checklist - Jenkins + Docker + Discord Integration

## Step 1: Verify Docker Containers Are Running

After running `docker-compose up -d`, check:

```powershell
# List all running containers
docker ps

# You should see:
# - mongo
# - backend
# - frontend
```

**Expected output:**
```
CONTAINER ID   IMAGE              STATUS          PORTS
abc123...      mongo:latest       Up 2 minutes    27017->27017/tcp
def456...      backend            Up 1 minute     5000->5000/tcp
ghi789...      frontend           Up 1 minute     3000->3000/tcp
```

## Step 2: Verify Container Logs

```powershell
# Check backend logs (should show MongoDB connection)
docker logs backend

# You should see:
# ✅ Server running on http://localhost:5000
# ✅ Connected to mongodb://mongo:27017/simplecrud

# Check frontend logs
docker logs frontend

# You should see:
# ✅ webpack compiled successfully
# ✅ Compiled successfully!

# Check MongoDB logs
docker logs mongo

# You should see:
# ✅ Waiting for connections on port 27017
```

## Step 3: Verify Services Are Responding

```powershell
# Test Backend API
curl http://localhost:5000/users

# Expected: [] (empty array or list of users as JSON)

# Test Frontend
curl http://localhost:3000

# Expected: HTML content with React app

# Test MongoDB is connected
# From backend container:
docker exec backend curl http://mongo:27017

# Expected: Connection works (no error)
```

## Step 4: Check Network Communication

```powershell
# Verify all services can ping each other
docker exec backend ping -c 3 mongo
docker exec frontend ping -c 3 backend

# Both should show successful pings ✅
```

## Step 5: Verify Jenkins Pipeline

### In Jenkins UI:
1. Go to your job: `assignment27-docker-deploy`
2. Click **Build Now**
3. Check **Console Output** for each stage:

```
[Pipeline] stage('Checkout')
✅ Checked out code

[Pipeline] stage('Build')
✅ Building docker images...
  - Building backend... Done
  - Building frontend... Done
  - Building mongo... Done

[Pipeline] stage('Test Backend')
✅ Testing backend...

[Pipeline] stage('Test Frontend')
✅ Testing frontend...

[Pipeline] stage('Deploy')
✅ Deploying containers...
  - mongo running ✅
  - backend running ✅
  - frontend running ✅

[Pipeline] stage('Health Check')
✅ curl -f http://localhost:5000/users
✅ Backend is running
✅ curl -f http://localhost:3000
✅ Frontend is running

[Pipeline] post
✅ Pipeline execution completed
```

## Step 6: Verify Discord Notifications

### After Jenkins Build Completes:

1. Check your Discord channel (`#jenkins-builds` or similar)
2. You should see an **embedded message** like:

```
✅ assignment27-docker-deploy - SUCCESS
Docker containers deployed successfully! ✅
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Build URL: http://jenkins:8080/job/assignment27-docker-deploy/1
Status: SUCCESS
Timestamp: 2026-05-06 10:30:45 UTC
```

### On Failure, you'll see:

```
❌ assignment27-docker-deploy - FAILURE
Build pipeline failed ❌
Check Jenkins logs for details.
```

## Step 7: Check Build Logs and Artifacts

```powershell
# Jenkins saves logs to:
docker exec backend cat /path/to/build-logs.txt

# Or in Jenkins workspace:
# $JENKINS_HOME/workspace/assignment27-docker-deploy/build-logs.txt
```

## Step 8: End-to-End Test

### 1. Create a User via API
```powershell
$body = @{
    name = "John Doe"
    age = 30
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/users" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

$response.StatusCode  # Should be 200
$response.Content     # Should show user data with _id
```

### 2. Retrieve Users via Frontend
```
1. Open http://localhost:3000
2. You should see the user list
3. Try adding a new user
4. Try editing/deleting
5. All operations should work ✅
```

### 3. Check Database
```powershell
# Connect to MongoDB
docker exec -it mongo mongosh

# In mongo shell:
use simplecrud
db.users.find()

# Should show your created users ✅
```

## Step 9: Verify All Connections Work Together

Create a checklist:

```
✅ Docker containers running (3/3)
   ☐ mongo
   ☐ backend
   ☐ frontend

✅ Services responding
   ☐ Backend API (port 5000)
   ☐ Frontend (port 3000)
   ☐ MongoDB (port 27017)

✅ Jenkins pipeline successful
   ☐ All 6 stages completed
   ☐ Health checks passed
   ☐ No errors in console output

✅ Discord notification received
   ☐ Message appears in Discord channel
   ☐ Shows SUCCESS status
   ☐ Contains build URL

✅ End-to-end functionality
   ☐ Can create users via API
   ☐ Can view users in frontend
   ☐ Can edit/delete users
   ☐ Data persists in MongoDB
```

## Quick Diagnostic Commands

```powershell
# If something fails, run these:

# 1. Show all container status
docker-compose ps

# 2. Show recent logs
docker-compose logs --tail=50

# 3. Check network connectivity
docker network ls
docker network inspect assignment27_app-network

# 4. Restart services
docker-compose restart

# 5. Full reset
docker-compose down -v
docker-compose up -d

# 6. View Jenkins job log
# In Jenkins UI: Job → Build #1 → Console Output
```

## How to Know It's Fully Connected

When all these are TRUE, your integration is working:

1. ✅ **Docker shows 3 running containers** (`docker ps`)
2. ✅ **APIs respond** (`curl` returns data)
3. ✅ **Jenkins builds successfully** (All 6 stages pass)
4. ✅ **Discord receives message** (Appears in channel)
5. ✅ **Frontend shows backend data** (Users display in browser)
6. ✅ **No errors in any logs** (`docker-compose logs`)

## Troubleshooting If Not Connected

### Containers won't start
```powershell
docker-compose logs
# Check error messages and fix accordingly
```

### Backend can't connect to MongoDB
```powershell
# Check if mongo is running
docker ps | findstr mongo

# Check backend logs
docker logs backend | findstr "error\|connection"
```

### Jenkins pipeline fails
- Check **Console Output** in Jenkins
- Verify Docker is installed on Jenkins agent: `docker --version`
- Check Jenkins has permission: `sudo usermod -aG docker jenkins`

### Discord notifications not appearing
- Verify webhook URL is correct
- Check Jenkins has internet access
- Run manual test: `bash notify-discord.sh "TEST" "message"`

---

**Once all checks pass**, you have successfully connected:
- ✅ Docker (containers)
- ✅ Jenkins (CI/CD pipeline)
- ✅ Discord (notifications)
