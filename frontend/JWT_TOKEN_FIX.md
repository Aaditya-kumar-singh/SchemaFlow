# JWT Token Verification Fix - 2026-01-10

## Problem

The application was experiencing `UNAUTHORIZED: Invalid token` errors with `jwt malformed` messages after successful login.

## Root Cause

The backend's `ResponseUtil.success()` wraps all responses in:
```json
{
  "success": true,
  "data": { "user": {...}, "token": "..." },
  "timestamp": "..."
}
```

But the frontend's `authApi.ts` was returning `response.data` instead of `response.data.data`, causing the auth store to save `undefined` to localStorage instead of the actual JWT token.

## Solution

1. Created shared type definitions in `frontend/src/types/api.ts`
2. Fixed `authApi.ts` to unwrap the response correctly: `return response.data.data`
3. Updated all API clients to use shared `BackendResponse<T>` type
4. Ensured consistent response handling across the entire frontend

## Files Changed

1. `frontend/src/types/api.ts` (new)
2. `frontend/src/features/auth/api/authApi.ts`
3. `frontend/src/features/projects/api/projectsApi.ts`
4. `frontend/src/features/teams/api/teamsApi.ts`
5. `frontend/src/lib/api/axios.ts`

## Testing Checklist

- [ ] Login succeeds and stores valid JWT token
- [ ] Protected API routes work without 401 errors
- [ ] Token verification succeeds on backend
