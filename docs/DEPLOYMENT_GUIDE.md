# Deployment Guide

This document provides instructions on how to deploy the FinShield-AI platform to a production environment.

## Prerequisites

Before deployment, ensure you have the following:
- A Linux-based server (e.g., AWS EC2, DigitalOcean Droplet, Ubuntu 22.04+)
- Node.js (v18+) and npm installed
- Python (v3.10+) and pip installed
- MongoDB Atlas cluster URL (or local MongoDB instance)
- PM2 installed globally (`npm install -g pm2`) for process management
- Nginx installed for reverse proxying

## 1. Environment Configuration

### Backend (Node.js) Environment Variables
Create a `.env` file in the `server/` directory:
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/finshield?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1d
ML_SERVICE_URL=http://localhost:5001
```

## 2. Deploying the Machine Learning Service (Python)

The ML service runs on a Flask server on port 5001.

1. Navigate to the AI service directory:
   ```bash
   cd ai-service
   ```
2. Create and activate a virtual environment (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the service using Gunicorn in the background:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5001 app:app --daemon
   ```
   *(Note: `-w 4` specifies 4 worker processes. Adjust based on your server's CPU cores).*

## 3. Deploying the Backend Service (Node.js)

The Node.js backend runs on port 5000.

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install production dependencies:
   ```bash
   npm install --production
   ```
3. Start the application using PM2:
   ```bash
   pm2 start server.js --name "finshield-backend"
   ```
4. Save the PM2 process list to restart on reboot:
   ```bash
   pm2 save
   pm2 startup
   ```

## 4. Setting up Nginx Reverse Proxy (Optional but Recommended)

To expose the application securely over port 80/443, configure Nginx.

1. Create a new Nginx configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/finshield
   ```
2. Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name api.finshield.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
3. Enable the site and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/finshield /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```
4. Secure with SSL using Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.finshield.yourdomain.com
   ```

## 5. First-Time Setup

Once the servers are running, initialize the system:

1. **Create an Admin Account**:
   ```bash
   cd server
   npm run create:admin
   ```
2. **Seed Initial Data (Optional)**:
   ```bash
   npm run seed
   ```

## 6. Monitoring and Logs

- **Backend Logs**: `pm2 logs finshield-backend`
- **Backend Monitor**: `pm2 monit`
- **ML Service Logs**: Look for gunicorn logs or configure logging output in the gunicorn command.
