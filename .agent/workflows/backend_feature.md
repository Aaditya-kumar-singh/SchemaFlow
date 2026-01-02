# Backend API Development Workflow

This workflow guides the AI through creating a new Backend API feature, ensuring all rules are followed.

---
description: Create a new backend API feature (Controller -> Service -> Route)
---

1. **Understand the Requirement**
   - Read the user request carefully.
   - Check `backend/src/app.ts` or `index.ts` to see where routes are registered.

2. **Create/Update Service**
   - Location: `backend/src/services/`
   - Rule: Business logic ONLY. No direct HTTP handling.
   
3. **Create/Update Controller**
   - Location: `backend/src/controllers/`
   - Rule: Handle validation, HTTP status codes, and call Service methods. 
   - Rule: `req` and `res` logic goes here.

4. **Update Routes**
   - Location: `backend/src/routes/`
   - Register the new controller methods.

5. **Verify**
   - // turbo
   - Run `npm run lint` in backend.
