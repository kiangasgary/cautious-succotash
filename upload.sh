#!/bin/bash

# Create proper .gitignore
echo "# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next
out

# production
build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo" > .gitignore

# Add all necessary files
git add .
git add -f *.ts *.js *.json *.yaml *.md *.mjs
git add -f app/ components/ lib/ types/ hooks/ actions/ styles/ public/

# Commit and push
git commit -m "Add all necessary project files"
git push origin main 