# 🚀 Deploy Python ML Server to Render

## ✅ Prerequisites (Already Done!)

- ✅ `Procfile` created
- ✅ `gunicorn` added to requirements.txt
- ✅ Flask app configured for external access

## 📝 Step-by-Step Render Deployment

### 1. Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub (recommended) or email
3. Verify your email

### 2. Push Code to GitHub (if not already)

```bash
cd "/Users/shett/Documents/Congressional/Disjoint Notes"

# Check git status
git status

# Add changes
git add python-ml/

# Commit
git commit -m "Add Render deployment config for ML server"

# Push to GitHub
git push origin master
```

### 3. Create New Web Service on Render

1. **Go to Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)

2. **Click "New +"** → **"Web Service"**

3. **Connect Repository**:

   - If using GitHub: Click "Connect account" and authorize Render
   - Select your repository: `Disjoint Notes` (or whatever it's called)

4. **Configure Service**:

   **Name**: `focusly-ml-api`

   **Region**: `Oregon (US West)` (or closest to you)

   **Branch**: `master` (or `main`)

   **Root Directory**: `python-ml` ⚠️ **IMPORTANT!**

   **Runtime**: `Python 3`

   **Build Command**: `pip install -r requirements.txt`

   **Start Command**: `gunicorn app:app`

   **Instance Type**: `Free`

5. **Add Environment Variables** (Optional but recommended):

   - Click "Advanced"
   - Add: `PYTHON_VERSION` = `3.11.0`

6. **Click "Create Web Service"**

### 4. Wait for Deployment (2-5 minutes)

You'll see:

```
Building...
==> Downloading buildpack
==> Installing Python 3.11
==> Installing dependencies
==> Build successful
==> Starting service
Your service is live 🎉
```

### 5. Get Your API URL

After deployment succeeds, you'll get a URL like:

```
https://focusly-ml-api.onrender.com
```

**Test it immediately:**

```bash
curl -X POST https://focusly-ml-api.onrender.com/predict/note-format \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","quizScores":[{"format":"text","score":85},{"format":"mindmap","score":92}]}'
```

You should see JSON response with predictions!

### 6. Update Your Vue App

Edit `src/services/mlEngine.ts`:

```typescript
// Change this line:
const ML_API = "http://localhost:5000";

// To your Render URL (replace with your actual URL):
const ML_API = "https://focusly-ml-api.onrender.com";
```

### 7. Create Environment Variable (Better Approach)

Create `.env` file in project root:

```env
VITE_ML_API_URL=https://focusly-ml-api.onrender.com
```

Then update `src/services/mlEngine.ts`:

```typescript
const ML_API = import.meta.env.VITE_ML_API_URL || "http://localhost:5000";
```

This way you can easily switch between local and production!

### 8. Rebuild & Deploy to iOS

```bash
# Rebuild frontend with new API URL
npm run build

# Sync with iOS
npx cap sync ios

# Open in Xcode
npx cap open ios

# Run on your iPhone!
```

---

## 🔧 Troubleshooting

### Issue: "Application failed to respond"

**Solution**: Check Render logs

- Go to your service dashboard
- Click "Logs" tab
- Look for errors

Common fixes:

```python
# Make sure app.py has:
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

### Issue: CORS errors on iPhone

**Solution**: Verify flask-cors is configured (already done in app.py):

```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # ✅ Should be near the top
```

### Issue: "Build failed"

**Check**:

1. ✅ Root Directory is set to `python-ml`
2. ✅ requirements.txt exists
3. ✅ All dependencies are listed

---

## 📊 Render Free Tier Limits

✅ **What you get for FREE:**

- 750 hours/month (enough for 24/7 uptime!)
- 512 MB RAM (plenty for our ML API)
- Automatic HTTPS
- Automatic deploys from GitHub
- Free custom domain support

⚠️ **Limitations:**

- Services spin down after 15 minutes of inactivity
- **First request after sleep takes 30-60 seconds to wake up**
- After that, fast responses!

---

## 🎯 Production Tips

### 1. Health Check Endpoint (Keeps Service Awake)

Add to `python-ml/app.py`:

```python
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': time.time()})
```

Then use a service like [UptimeRobot](https://uptimerobot.com) (free) to ping it every 5 minutes.

### 2. Environment-Based Configuration

```python
import os

# In app.py
DEBUG = os.getenv('DEBUG', 'False') == 'True'
app.run(debug=DEBUG, host='0.0.0.0', port=5000)
```

Set `DEBUG=False` in Render environment variables for production.

---

## 🎬 Quick Deploy Checklist

- [x] Procfile created ✅
- [x] gunicorn in requirements.txt ✅
- [x] app.py configured for external access ✅
- [ ] Push to GitHub
- [ ] Create Render account
- [ ] Create Web Service on Render
- [ ] Set Root Directory to `python-ml`
- [ ] Wait for deployment
- [ ] Get API URL
- [ ] Update `mlEngine.ts` with new URL
- [ ] Test API endpoint
- [ ] Rebuild and deploy to iOS

---

## 📱 Testing on iPhone

Once deployed and app is rebuilt:

1. **Connect iPhone to Mac**
2. **Open Xcode** via `npx cap open ios`
3. **Select your iPhone** as target device
4. **Click Run** (▶️ button)
5. **Trust developer** on iPhone if prompted
6. **Test the app!**

The ML predictions will now work on your iPhone! 🎉

---

## 💡 Alternative: Local Testing During Development

If you want to test on iPhone while still developing:

1. **Find your Mac's IP**: `ipconfig getifaddr en0`
2. **Update mlEngine.ts**: `const ML_API = "http://192.168.1.XXX:5000"`
3. **Keep Python server running** on your Mac
4. **iPhone must be on same WiFi**

This is good for rapid testing, but use Render for the actual demo!

---

## 🎓 For Your Demo

**Recommended Setup:**

- **Development**: Local Python server
- **Testing on iPhone**: Render deployment
- **Congressional App Demo**: Render deployment (looks professional!)

**Benefits:**

- No need for your laptop during demo
- Always available
- Shows production-ready architecture
- Free!

---

Need help with any step? Let me know! 🚀
