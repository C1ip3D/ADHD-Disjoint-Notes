#!/bin/bash

echo "======================================"
echo "🚀 Starting Flask Backend Server"
echo "======================================"
echo ""
echo "📍 Server will run on: http://localhost:5001"
echo "🔗 Canvas Proxy endpoint: http://localhost:5001/canvas/proxy"
echo ""
echo "Press Ctrl+C to stop the server"
echo "======================================"
echo ""

cd "$(dirname "$0")"
python app.py

