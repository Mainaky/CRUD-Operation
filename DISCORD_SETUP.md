# Discord Integration Setup

## Step 1: Create a Discord Server & Channel

1. Go to [Discord](https://discord.com)
2. Create a new server or use existing one
3. Create a channel like `#jenkins-builds` or `#deployments`

## Step 2: Create Webhook

1. Right-click the channel → **Edit Channel**
2. Go to **Integrations** → **Webhooks**
3. Click **New Webhook**
4. Name it `Jenkins Pipeline`
5. Click **Copy Webhook URL**

Example URL looks like:
```
https://discordapp.com/api/webhooks/1234567890/abcdefg...
```

## Step 3: Configure Jenkins

### Option A: Environment Variable (Recommended)
```bash
# Add to Jenkins job or system-wide environment
export DISCORD_WEBHOOK="https://discordapp.com/api/webhooks/YOUR_ID/YOUR_TOKEN"
```

### Option B: Jenkins Credentials
1. Go to **Manage Jenkins** → **Manage Credentials**
2. Add **Secret text**
3. ID: `discord-webhook`
4. Secret: Your webhook URL

### Option C: Edit notify-discord.sh
Replace line 6 with your webhook:
```bash
DISCORD_WEBHOOK_URL="https://discordapp.com/api/webhooks/YOUR_ID/YOUR_TOKEN"
```

## Step 4: Update Jenkinsfile

The `Jenkinsfile` already has Discord notifications configured in the `post` section.

## Step 5: Test the Webhook

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "Test message from Jenkins! 🚀"
  }'
```

## Expected Discord Messages

### ✅ Success
```
✅ assignment27-docker-deploy - SUCCESS
Docker containers deployed successfully! ✅
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
```

### ❌ Failure
```
❌ assignment27-docker-deploy - FAILURE
Build pipeline failed ❌
Check Jenkins logs for details.
```

## Webhook Permissions

Your webhook needs:
- ✅ Send Messages
- ✅ Embed Links
- ✅ Attach Files

(These are usually enabled by default)

## Troubleshooting

### Webhook returns 404
- Webhook URL is invalid or deleted
- Re-create the webhook and copy the URL again

### Webhook returns 401
- Token is expired
- Recreate the webhook

### No message appears
- Check channel permissions
- Verify webhook URL in environment variable
- Run `bash notify-discord.sh "TEST" "message"` manually

## Advanced: Custom Embed Colors

In `notify-discord.sh`, modify the color codes:
- SUCCESS: `3066993` (Green)
- FAILURE: `15158332` (Red)
- UNSTABLE: `16776960` (Yellow)
- Custom: Use decimal color code (0-16777215)

## Reference
[Discord Webhook Documentation](https://discord.com/developers/docs/resources/webhook)
