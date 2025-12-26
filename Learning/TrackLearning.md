# AuthService Learning & Progress Tracker

---

## 📅 24 December 2025

### Today's Progress
- ✅ Set up initial TypeScript configuration for Auth Service
- ✅ Configured build pipeline with proper compilation settings
- ✅ Added `.gitignore` to exclude build artifacts and dependencies
- ✅ Fixed `verbatimModuleSyntax` error by disabling it for CommonJS compatibility
- ✅ Implemented health check endpoint with Express
- ✅ Set up environment configuration system

### Key Learnings

#### 1. TypeScript Build System & Dist Folder

**Problem:** TypeScript doesn't clean the `dist/` folder automatically.
- **Issue:** If you rename/delete source files, old compiled `.js` files remain in `dist/`.
- **Solution:** Add a `clean` script that removes `dist/` before each build.

```json
"scripts": {
  "clean": "rm -rf dist",
  "build": "npm run clean && tsc"
}
```

**How `dist/` gets populated:**
- `npm run build` → runs `tsc` → compiles `src/**/*.ts` → outputs to `dist/**/*.js`
- `npm run dev` → uses `ts-node-dev` → runs TypeScript directly (no `dist/` output)
- `npm start` → runs compiled JavaScript from `dist/server.js`

**What goes in `dist/`:**
- `.js` files (compiled JavaScript)
- `.js.map` files (source maps for debugging)
- `.d.ts` files (type declarations)
- `.d.ts.map` files (declaration maps)

---

#### 2. verbatimModuleSyntax Error

**Error Message:**
```
ECMAScript imports and exports cannot be written in a CommonJS file under 'verbatimModuleSyntax'
```

**Cause:** Mismatch between:
- Using ESM syntax (`import`/`export`) in source code
- But compiling to CommonJS (`module: "commonjs"`)
- With `verbatimModuleSyntax: true` (prevents TypeScript from transforming imports)

**Solution:** Set `verbatimModuleSyntax: false` to let TypeScript transform ESM imports to CommonJS `require`.

---

#### 3. Architecture Decisions

**Layered Architecture:**
- Using file-by-type structure for simplicity
- Separation of concerns: routes → controllers → services → data layer
- Keeps code scalable, testable, and maintainable
- Database or transport layer can be swapped without affecting business logic


```
src/
├── controllers/        # Handle HTTP requests/responses
│   └── auth.controller.ts
├── services/           # Business logic layer
│   └── auth.service.ts
├── routes/             # API route definitions
│   └── auth.routes.ts
├── models/             # Database schemas
│   └── user.model.ts
├── utils/              # Utility functions
│   ├── jwt.ts          # JWT token operations
│   └── hash.ts         # Password hashing
├── middleware/         # Express middleware
│   └── auth.middleware.ts
├── config/             # Configuration
│   └── env.ts          # Environment variables
├── app.ts              # Express app setup
└── server.ts           # Server entry point
```

**Environment Configuration Pattern:**
- Don't use `.env` directly in code
- Process and validate in `config/env.ts`
- Export a typed, safe configuration object
- Single source of truth for all config values

---

#### 4. Module System Internals

**Key Concept:** Modules execute only ONCE.

```
First import of config/env.ts
  ├─ File executes
  ├─ Creates env object
  └─ Cached in memory

Subsequent imports
  └─ Return cached object (no re-execution)
```

This ensures:
- Consistent state across the application
- No duplicate initialization
- Better performance

---

### 📋 TypeScript Configuration Reference

#### File Layout
- `"rootDir": "./src"` → All source files in `src/`
- `"outDir": "./dist"` → Compiled output goes to `dist/`

#### Environment
- `"module": "commonjs"` → Node.js module system (`require`/`module.exports`)
- `"target": "es2022"` → Modern JavaScript output
- `"lib": ["es2022"]` → TypeScript definitions for modern JS features
- `"types": ["node"]` → Node.js globals (`process`, `Buffer`, `__dirname`)

#### Output & Debugging
- `"sourceMap": true` → Debug original `.ts` files instead of `.js`
- `"declaration": true` → Generate `.d.ts` type definition files
- `"declarationMap": true` → Maps `.d.ts` back to source `.ts`

#### Type Safety
- `"strict": true"` → All strict type checks enabled
- `"noUncheckedIndexedAccess": true` → Handle `undefined` for array/object access
- `"exactOptionalPropertyTypes": true` → Strict optional property handling

#### Best Practices
- `"esModuleInterop": true` → Clean imports from CommonJS libraries
- `"resolveJsonModule": true` → Import `.json` files directly
- `"isolatedModules": true` → Each file compiles independently
- `"skipLibCheck": true` → Skip type-checking `node_modules` (faster builds)

#### Project Scope
- `"include": ["src/**/*"]` → Only compile `src/` folder
- `"exclude": ["node_modules", "dist"]` → Ignore dependencies and output

---

### 🛠️ Tools & Dependencies

**Runtime Dependencies:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variable loading

**Dev Dependencies:**
- `typescript` - TypeScript compiler
- `ts-node-dev` - Development server with auto-reload
- `@types/*` - Type definitions for libraries

---

### 📝 Notes for Future

- Consider adding `rimraf` for cross-platform `clean` script
- Plan to implement user registration/login endpoints
- Need to set up MongoDB connection
- Add input validation middleware
- Implement JWT token generation and verification
- Set up proper error handling middleware

---

## 📅 26 December 2025

### Today's Progress
- ✅ Implemented user registration endpoint with password hashing
- ✅ Added availability check API for username/email validation
- ✅ Set up PostgreSQL database with Docker Compose
- ✅ Created User model with avatar_url field
- ✅ Configured Express body parser middleware (`express.json()`)
- ✅ Implemented signup flow with real-time availability checking

### Key Learnings

#### 1. Express Body Parser Middleware

**Problem:** `req.body` is undefined causing destructuring errors.

**Error:**
```
TypeError: Cannot destructure property 'username' of 'req.body' as it is undefined.
```

**Root Cause:** Express doesn't parse JSON request bodies by default.

**Solution:** Add `express.json()` middleware BEFORE route registration:

```typescript
import express from 'express';

const app = express();

// ✅ Must come BEFORE routes
app.use(express.json());

// Then register routes
app.use('/api/auth', authRoutes);
```

**Key Point:** Middleware order matters! Body parser must execute before your route handlers can access `req.body`.

---

#### 2. PostgreSQL Docker Persistent Volumes

**Problem:** After adding `avatar_url` column to `init.sql`, the column doesn't appear in the database.

**Why doesn't PostgreSQL add the new avatar_url column after updating init.sql when using Docker Compose with a persistent volume?**

**Answer:** Postgres Docker initialization behavior:

- Files in `/docker-entrypoint-initdb.d/` (like `init.sql`)
  👉 **run ONLY when the database is empty**

- You are using a **named volume**:
  ```yaml
  volumes:
    - postgres_auth_data:/var/lib/postgresql/data
  ```

- That volume **already contains your old database**

**What happens:**
1. First run: Volume is empty → `init.sql` executes → creates tables
2. Second run: Volume has data → Docker skips `init.sql` → your changes are ignored

**Solution Options:**

**Option 1: Reset the database (dev environment)**
```bash
# Stop containers
docker compose down

# Remove the named volume
docker volume rm postgres_auth_data

# Start fresh
docker compose up -d
```

**Option 2: Manual migration (production-safe)**
```bash
# Connect to running database
docker exec -it <container_name> psql -U <username> -d <database>

# Run ALTER statement
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);
```

**Option 3: Use migration tools (best practice)**
- Use tools like `node-pg-migrate`, `Flyway`, or `Liquibase`
- Track schema changes with version control
- Apply incremental migrations

**Key Takeaway:** 
- `init.sql` is for **initial setup only**, not schema updates
- Use proper migration strategies for database changes
- Docker volumes persist data even after container recreation

---

#### 3. Signup Flow Implementation

**Architecture:**

```
┌─────────────────┐
│   SignUp User   │
│      Flow       │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
         ▼              ▼
┌──────────────┐  ┌──────────────┐
│   UserName   │  │    Email     │
│    Input     │  │    Input     │
└──────┬───────┘  └──────┬───────┘
       │                 │
       │                 │
       └────────┬────────┘
                │
                ▼
       ┌────────────────────┐
       │   Delay of 400ms   │
       │   to check if      │
       │   availability     │
       └────────┬───────────┘
                │
         ┌──────┴──────┐
         │             │
        Yes            No
         │             │
         ▼             └─────────────┐
┌──────────────────────────────┐    │
│  Check for email and         │    │
│  username availability       │    │
│  via API call                │    │
│  POST /api/auth/check-       │    │
│       availability           │    │
└──────────────────────────────┘    │
                                    │
                                    ▼
                            ┌──────────────┐
                            │  Keep waiting│
                            │  for user    │
                            │  input       │
                            └──────────────┘
```

**Implementation Details:**

1. **Debounced Availability Check:**
   - 400ms delay prevents API spam
   - Only checks after user stops typing
   - Provides real-time feedback

2. **API Endpoint:** `POST /api/auth/check-availability`
   ```typescript
   // Request
   {
     "username": "john_doe",
     "email": "john@example.com"
   }
   
   // Response
   {
     "usernameAvailable": true,
     "emailAvailable": false
   }
   ```

3. **Controller Implementation:**
   ```typescript
   export async function availabilityCheckController(req: Request, res: Response) {
     const { username, email } = req.body || {};
     
     // Validation
     if (!username && !email) {
       return res.status(400).json({ 
         error: "Bad request", 
         message: "Username or email is required"
       });
     }
     
     // Check database
     const result = await checkForExistingUserService(username, email);
     res.status(200).json(result);
   }
   ```

---

#### 4. Database Schema - User Model

**Added avatar_url field:**

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),  -- NEW FIELD
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:**
- Store user profile picture URLs
- Optional field (can be NULL)
- Supports CDN/cloud storage URLs (up to 500 chars)

---

### 🎯 Today's Challenges & Solutions

**Challenge 1:** `req.body` undefined error
- **Solution:** Added `express.json()` middleware

**Challenge 2:** New database column not appearing
- **Solution:** Learned about Docker volume persistence, reset database for dev

**Challenge 3:** Real-time validation UX
- **Solution:** Implemented debounced availability check with 400ms delay

---

### 📝 Notes for Future

- Consider rate limiting for availability check endpoint
- Add email validation (format check)
- Implement password strength requirements
- Add CORS configuration for frontend integration
- Set up database migration system for production
- Add comprehensive error handling and logging
- Consider caching frequently checked usernames/emails

---

## Template for Next Day

```markdown
## 📅 [Date]

### Today's Progress
- 

### Key Learnings

#### [Topic]


---
```

