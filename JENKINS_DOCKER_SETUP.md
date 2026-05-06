# Jenkins Docker Setup (Complete Guide)

## Step 1: Start All Containers (including Jenkins)

```powershell
cd c:\Users\maina\Downloads\31\assignment27\assignment27
docker-compose up -d
```

Wait 30-60 seconds for Jenkins to fully start...

## Step 2: Get Jenkins Admin Password

```powershell
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

You'll see something like:
```
a1b2c3d4e5f6g7h8i9j0k1l2
```

**Copy this password!**

## Step 3: Access Jenkins

1. Open browser → **http://localhost:8080**
2. Paste the password from Step 2
3. Click **Continue**

## Step 4: Install Suggested Plugins

On "Customize Jenkins" screen:
- Click **Install suggested plugins**
- Wait for installation (~5-10 minutes)

## Step 5: Create Admin User

After plugins install:
- Username: `admin` (or your choice)
- Password: Create a strong password
- Full name: Your name
- Email: Your email
- Click **Save and Continue**

## Step 6: Jenkins URL

- Keep it as: `http://localhost:8080/`
- Click **Save and Finish**

## Step 7: You're In!

You should see the Jenkins dashboard. Congratulations! 🎉

## Step 8: Install Additional Plugins (Optional but Recommended)

1. Go to **Manage Jenkins** → **Manage Plugins**
2. Go to **Available** tab
3. Search and install:
   - ✅ Docker
   - ✅ Docker Pipeline
   - ✅ Git
   - ✅ Pipeline

4. Click **Install without restart**

## Step 9: Add Docker Socket Permission

So Jenkins can control Docker:

```powershell
# Check if jenkins user can access docker
docker exec jenkins docker ps

# If error: "Cannot connect to Docker daemon"
# Run this (for Windows/WSL):
docker exec -u root jenkins usermod -aG docker jenkins
```

## Step 10: Create a New Pipeline Job

1. Click **New Item**
2. Enter name: `assignment27-docker-deploy`
3. Select **Pipeline**
4. Click **OK**

## Step 11: Configure the Pipeline

On the job configuration page:

**Definition**: Select **Pipeline script from SCM**

**SCM**: 
- Select **Git**
- Repository URL: Your git repo (or local path)
- Branch: `*/main` or `*/master`

**Script Path**: `Jenkinsfile`

Click **Save**

## Step 12: Run the Pipeline

1. Click **Build Now**
2. Watch the build in real-time
3. Check **Console Output**

Expected output:
```
[Pipeline] stage('Checkout')
[Pipeline] stage('Build')
[Pipeline] stage('Test Backend')
[Pipeline] stage('Test Frontend')
[Pipeline] stage('Deploy')
[Pipeline] stage('Health Check')
✅ Backend is running
✅ Frontend is running
```

## Troubleshooting

### Jenkins won't start
```powershell
docker logs jenkins
# Check for errors

# Restart Jenkins
docker restart jenkins
```

### Can't access http://localhost:8080
```powershell
# Check if container is running
docker ps | findstr jenkins

# Check port mapping
docker port jenkins

# Should show: 8080/tcp -> 0.0.0.0:8080
```

### Pipeline fails - Docker not found
```powershell
# Give Jenkins access to Docker
docker exec -u root jenkins usermod -aG docker jenkins

# Restart Jenkins
docker restart jenkins
```

### Pipeline fails - Cannot connect to MongoDB
In your Jenkinsfile, use `mongo` as hostname (not `localhost`)
```
mongodb://mongo:27017/simplecrud
```

## Port Reference

```
Jenkins:   http://localhost:8080
Backend:   http://localhost:5000
Frontend:  http://localhost:3000
MongoDB:   localhost:27017
```

## Quick Commands

```powershell
# See Jenkins logs
docker logs -f jenkins

# Restart Jenkins
docker restart jenkins

# Stop everything
docker-compose down

# Start everything
docker-compose up -d
```

## Next: Set up Discord Webhook

Once Jenkins is running and your pipeline works, set the environment variable:

```powershell
# In Jenkins UI: Manage Jenkins → Configure System → Global properties
# Add environment variable:
# Name: DISCORD_WEBHOOK
# Value: YOUR_WEBHOOK_URL
```

Then the Jenkinsfile will automatically send Discord notifications! 🎉
