# Canvas Integration Setup Guide

## 🎯 What's the Issue?

Canvas API has **CORS (Cross-Origin Resource Sharing)** security policies that block direct browser requests from web apps. This is why you're seeing "invalid credentials" even though your credentials are correct.

## ✅ The Solution

We've created a **Flask proxy server** that routes Canvas API requests through your backend, avoiding CORS issues entirely.

```
Browser → Flask Backend (localhost:5001) → Canvas API → Back to Browser
```

## 📋 Setup Instructions

### Step 1: Open a Terminal

Open Terminal app on your Mac.

### Step 2: Navigate to the Python Backend Directory

```bash
cd "/Users/shett/Documents/Congressional/Disjoint Notes/python-ml"
```

### Step 3: Start the Flask Backend Server

**Option A: Using the start script (Easiest)**

```bash
./start_server.sh
```

**Option B: Using Python directly**

```bash
python app.py
```

You should see:

```
============================================================
🚀 Flask Backend Server Starting...
   Canvas Proxy endpoint: http://localhost:5001/canvas/proxy
============================================================
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5001
 * Running on http://[YOUR_IP]:5001
```

### Step 4: Keep the Server Running

**IMPORTANT:** Keep this terminal window open while using the Canvas integration. The server needs to stay running.

### Step 5: Setup Canvas in Your App

1. Go to your app's **Dashboard** (http://localhost:5173/dashboard or wherever your app runs)
2. Click the **"Setup Canvas"** button in the profile section (top of the page)
3. Enter your Canvas information:
   - **Canvas URL**: Your school's Canvas domain (e.g., `dublinusd.instructure.com`)
   - **Access Token**: Your Personal Access Token from Canvas

### Step 6: Get Your Canvas Access Token

If you don't have a Canvas access token yet:

1. Log into your Canvas account
2. Click **"Account"** → **"Settings"**
3. Scroll down to **"Approved Integrations"**
4. Click **"+ New Access Token"**
5. Give it a purpose name (e.g., "Disjoint Notes App")
6. Click **"Generate Token"**
7. **Copy the token immediately** (you won't be able to see it again!)
8. Paste it into the setup modal in your app

## 🐛 Troubleshooting

### "Failed to connect" or "Server not responding"

**Check if the Flask server is running:**

```bash
lsof -i :5001
```

You should see Python using port 5001. If not, restart the server.

### "Port already in use" error

If you see an error about port 5001 being in use:

1. Find what's using it: `lsof -i :5001`
2. Kill that process: `kill -9 [PID]`
3. Or change the port in `app.py` to something else (like 5002)

### Still not working?

Check the browser console (F12 → Console tab) for detailed error messages. You should see logs starting with `[Canvas]` that explain what's happening.

## 🎉 Once It's Working

After successful setup, you'll see:

✅ **On Dashboard:**

- "My Classes" section with all your Canvas courses
- "Due Soon" widget showing upcoming assignments
- Canvas quick action button

✅ **On Canvas Page (`/canvas`):**

- All your course grades with progress bars
- Complete list of assignments with filtering
- Color-coded due dates and status badges
- Links to view assignments directly in Canvas

## 📝 Notes

- The Flask server uses port **5001** (not 5000) because macOS Control Center uses port 5000
- You only need to run the Flask server when using Canvas features
- The server runs locally and doesn't send your data anywhere except to Canvas
- Your Canvas credentials are never stored on our servers
