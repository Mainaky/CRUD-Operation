#!/bin/bash

# Discord Webhook Notifier for Jenkins Builds
# Usage: ./notify-discord.sh "Build Status" "Message"

DISCORD_WEBHOOK_URL="${DISCORD_WEBHOOK:-https://discordapp.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN}"
BUILD_STATUS=$1
BUILD_MESSAGE=$2
BUILD_URL="${BUILD_URL:-http://jenkins:8080}"
JOB_NAME="${JOB_NAME:-Unknown Job}"

# Color codes for Discord embeds
case $BUILD_STATUS in
    "SUCCESS")
        COLOR=3066993
        EMOJI="✅"
        ;;
    "FAILURE")
        COLOR=15158332
        EMOJI="❌"
        ;;
    "UNSTABLE")
        COLOR=16776960
        EMOJI="⚠️"
        ;;
    *)
        COLOR=9807270
        EMOJI="ℹ️"
        ;;
esac

# Create Discord embed JSON
PAYLOAD=$(cat <<EOF
{
  "embeds": [
    {
      "title": "$EMOJI $JOB_NAME - $BUILD_STATUS",
      "description": "$BUILD_MESSAGE",
      "url": "$BUILD_URL",
      "color": $COLOR,
      "fields": [
        {
          "name": "Build URL",
          "value": "[$BUILD_URL]($BUILD_URL)",
          "inline": false
        },
        {
          "name": "Status",
          "value": "$BUILD_STATUS",
          "inline": true
        },
        {
          "name": "Timestamp",
          "value": "$(date -u +'%Y-%m-%d %H:%M:%S UTC')",
          "inline": true
        }
      ],
      "footer": {
        "text": "Jenkins CI/CD Pipeline"
      }
    }
  ]
}
EOF
)

# Send to Discord
curl -X POST "$DISCORD_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d "$PAYLOAD"

echo "Discord notification sent!"
