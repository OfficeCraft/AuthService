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

## Template for Next Day

```markdown
## 📅 [Date]

### Today's Progress
- 

### Key Learnings

#### [Topic]


---
```

