# AWS Deployment Guide

This project is configured for deployment on AWS using Elastic Beanstalk (Docker).

## 1. Prerequisites (AWS Console)

### Database Setup
1. **PostgreSQL**: Create an RDS instance (Free Tier `db.t3.micro`).
   - Create a database named `schemaflow`.
   - Ensure Security Group allows inbound traffic on port 5432.
2. **MongoDB**: Use MongoDB Atlas Free Tier.
   - Network Access: Allow access from anywhere `0.0.0.0/0` (or configure AWS VPC peering).

### Elastic Beanstalk Applications
Create two applications in the region `ap-south-1` (or your preferred region):
1. **Backend App**: `schemaflow-backend`
   - Platform: `Docker`
   - Environment Name: `schemaflow-backend-env`
2. **Frontend App**: `schemaflow-frontend`
   - Platform: `Docker`
   - Environment Name: `schemaflow-frontend-env`

### Environment Variables
Configure these in the Elastic Beanstalk Console -> Configuration -> Software -> Environment properties:

**Backend Env:**
- `DATABASE_URL`: `postgresql://user:pass@host:5432/schemaflow`
- `MONGO_URI`: `mongodb+srv://...`
- `JWT_SECRET`: `your-secret`
- `NODE_ENV`: `production`
- `PORT`: `3002`

**Frontend Env:**
- `NEXT_PUBLIC_API_URL`: URL of your backend environment (e.g., `http://schemaflow-backend-env...elasticbeanstalk.com/api/v1`)

## 2. GitHub Configuration

Go to Repository Settings -> Secrets and variables -> Actions.
Add the following secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
