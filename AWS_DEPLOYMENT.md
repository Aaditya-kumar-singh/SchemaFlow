
# ☁️ Deploying SchemaFlow to AWS Elastic Beanstalk (Existing Environment)

This guide is tailored for your existing AWS Elastic Beanstalk environment **`Schemaflow-env`** in region **`ap-southeast-2` (Sydney)**.

## 📋 Environment Details
- **Region**: `ap-southeast-2` (Sydney)
- **Application Name**: `schemaflow`
- **Environment Name**: `Schemaflow-env`
- **Platform**: Docker running on 64bit Amazon Linux 2023
- **Account ID**: `5672-0791-0627`

## 🚀 Deployment Workflow

**Since your environment is already created ("Green"), you do NOT need to run `eb init` or `eb create`.**

Your GitHub Actions workflow (`.github/workflows/deploy.yml`) is already configured to deploy to this environment automatically when you push to the `main` branch.

### 1. Configure Environment Variables (CRITICAL)
For your application to work (connect to DB, handle Auth), you **must** set these variables in the AWS Console.

1.  Go to [Elastic Beanstalk Console - Schemaflow-env](https://ap-southeast-2.console.aws.amazon.com/elasticbeanstalk/home?region=ap-southeast-2#/environment/dashboard?environmentId=e-xxxx).
2.  Click **Configuration** (left menu).
3.  Scroll down to **Updates, monitoring, and logging**. (Actually, for Env Vars, look for **Software** category or "Environment settings").
4.  Edit **Environment properties** (Environment variables).
5.  Add the following properties:

| Name | Value |
| :--- | :--- |
| `DATABASE_URL` | Your MongoDB connection string (e.g., from Atlas) |
| `NEXTAUTH_SECRET` | A random string for security |
| `NEXTAUTH_URL` | Your EB URL (e.g., `http://schemaflow-env.eba-dr8wkx3.ap-southeast-2.elasticbeanstalk.com`) |
| `NODE_ENV` | `production` |
| `PORT` | `3002` (Backend port) |

### 2. Manual Deployment (Optional)
If you want to deploy manually from your local machine instead of waiting for GitHub Actions:

```bash
# 1. Initialize EB CLI (only needed once per machine)
eb init schemaflow --region ap-southeast-2 --platform "Docker running on 64bit Amazon Linux 2023"

# 2. Deploy
eb deploy Schemaflow-env
```

### 3. Application Structure
The deployment upload includes:
- `docker-compose.yml`: Tells AWS to build and run `frontend`, `backend`, and `nginx`.
- `frontend/`: Source code for the Next.js UI.
- `backend/`: Source code for the Node.js API.
- `nginx/`: Configuration for routing traffic.

**Note:** The build happens **on the AWS instance**. This might take a few minutes. If deployment fails due to timeout, consider increasing the timeout in EB Configuration.
