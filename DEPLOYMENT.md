<!--
  AI DEPLOYMENT INSTRUCTIONS
  This file contains step-by-step commands to deploy LocalSnips Preview to GitHub Pages.
  Execute each numbered step in order. All paths are absolute.
-->

# DEPLOYMENT PROCESS

## CONTEXT
- SOURCE: `/Users/yeray/Desktop/snippet/preview` (Next.js source code)
- TARGET: `https://github.com/yeraylois/localsnips-preview` (static artifacts only)
- URL: `https://yeraylois.github.io/localsnips-preview/`

## STEP 1: BUILD
```bash
cd /Users/yeray/Desktop/snippet/preview
npm run build
```
Wait for "Exit code: 0". Output is in `./out/`

## STEP 2: PREPARE TEMP DIRECTORY
```bash
rm -rf /tmp/preview_deploy
mkdir -p /tmp/preview_deploy
cd /tmp/preview_deploy
git init
```

## STEP 3: CREATE BASE COMMIT (v1.1.0)
```bash
cp -R ~/Desktop/localsnips-preview-main/* .
git add .
git commit -m "chore(release): snapshot of version 1.1.0 changes"
```

## STEP 4: APPLY NEW BUILD
```bash
# Remove everything except .git and READMEs
find . -maxdepth 1 ! -name '.git' ! -name 'README.md' ! -name 'README.es.md' ! -name '.' -exec rm -rf {} +

# Copy new build
cp -R /Users/yeray/Desktop/snippet/preview/out/* .

# CRITICAL: Add this file or _next folder will be ignored
touch .nojekyll

# Commit
git add .
git commit -m "chore(release): snapshot of version X.X.X changes"
```

## STEP 5: PUSH
```bash
git remote add origin https://github.com/yeraylois/localsnips-preview.git
git push origin main --force
```

## STEP 6: CLEANUP
```bash
rm -rf /tmp/preview_deploy
```

---

# CRITICAL RULES

## Rule 1: .nojekyll
GitHub Pages uses Jekyll which ignores `_next/` folders.
ALWAYS run `touch .nojekyll` before committing.

## Rule 2: Navigation Links
NEVER use `window.location.href`. ALWAYS use `router.push()`.

```typescript
// WRONG - breaks on GitHub Pages
window.location.href = "/collections/graph";

// CORRECT - respects basePath
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/collections/graph");
```

## Rule 3: basePath in next.config.ts
```typescript
basePath: process.env.NODE_ENV === "production" ? "/localsnips-preview" : ""
```

---

# TROUBLESHOOTING

| Symptom | Cause | Fix |
|---------|-------|-----|
| 404 on CSS/JS | Missing .nojekyll | `touch .nojekyll` |
| Wrong URL | window.location.href | Use router.push() |
| Infinite spinner | Missing build manifest | Check `_next/static/[buildId]/` |
