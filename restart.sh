#!/bin/bash

# Simple server restart script
echo "🔄 Restarting server..."

# Kill any process on port 3000
PID=$(sudo netstat -tulnp | grep :3000 | awk '{print $7}' | cut -d'/' -f1)
if [ ! -z "$PID" ]; then
    echo "🔪 Killing process $PID..."
    sudo kill -9 $PID
    sleep 2
fi

# Start server in background
echo "🚀 Starting server..."
npm run start &

echo "✅ Done!"
