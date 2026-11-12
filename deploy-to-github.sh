#!/bin/bash
# Script to push RailOne to GitHub and trigger GitHub Actions for GitHub Pages
# Target: https://pravinau26-web.github.io/railone

set -e

if [ -z "$1" ]; then
  echo "Usage: ./deploy-to-github.sh <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>"
  echo ""
  echo "How to get a GitHub token:"
  echo "1. Go to https://github.com/settings/tokens (Personal access tokens -> Tokens classic)"
  echo "2. Click 'Generate new token (classic)'"
  echo "3. Give it 'repo' and 'workflow' scopes"
  echo "4. Copy the token (starts with ghp_...)"
  echo "5. Run: ./deploy-to-github.sh ghp_yourTokenHere"
  exit 1
fi

TOKEN="$1"
REMOTE_URL="https://${TOKEN}@github.com/pravinau26-web/railone.git"

echo "Pushing code to https://github.com/pravinau26-web/railone.git on branch main..."
git push -u "$REMOTE_URL" main --force

echo ""
echo "=========================================================="
echo "SUCCESS! Code pushed to GitHub."
echo "GitHub Actions is now building and deploying your website."
echo "Your live site will be ready at:"
echo "👉 https://pravinau26-web.github.io/railone/"
echo "=========================================================="
