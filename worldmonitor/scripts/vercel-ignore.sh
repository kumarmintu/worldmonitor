#!/bin/bash
# TRINETRA monorepo: upstream script skipped builds when only paths like `src/` changed.
# Here app code lives under `worldmonitor/` in git, so that diff never matched → Vercel canceled every deploy.
# Vercel: exit 0 = skip build, exit 1 = run build — we always build.
echo "TRINETRA: always run Vercel build"
exit 1
