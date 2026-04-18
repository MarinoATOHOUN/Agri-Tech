#!/bin/bash
set -e

# Configuration (from user prompt)
FRONTEND_REPO="https://huggingface.co/spaces/rinogeek/GreenMetricFrontend"
BACKEND_REPO="https://huggingface.co/spaces/rinogeek/GreenMetricBackend"

echo "=========================================="
echo "DEPLOYING BACKEND TO HUGGING FACE SPACES"
echo "=========================================="
cd agri_backend

# Setup isolated git repo for backend
rm -rf .git
echo "Initializing git repo for backend..."
git init
git checkout -b main
cp ../.gitignore .
git add .
git commit -m "Initial backend deploy"

# Add remote if missing
if ! git remote | grep -q "^space$"; then
    git remote add space $BACKEND_REPO
    echo "Added remote 'space': $BACKEND_REPO"
fi

# Push
echo "Pushing to backend space (force)..."
# Note: This requires credentials. If this fails, the user must run it manually or configure helper.
git push space main -f

cd ..

echo ""
echo "=========================================="
echo "DEPLOYING FRONTEND TO HUGGING FACE SPACES"
echo "=========================================="
cd agri-frontend

# Setup isolated git repo for frontend
rm -rf .git
echo "Initializing git repo for frontend..."
git init
git lfs install
git lfs track "*.png"
git add .gitattributes
git checkout -b main
cp ../.gitignore .
git add .
git commit -m "Initial frontend deploy"

# Add remote if missing
if ! git remote | grep -q "^space$"; then
    git remote add space $FRONTEND_REPO
    echo "Added remote 'space': $FRONTEND_REPO"
fi

# Push
echo "Pushing to frontend space (force)..."
git push space main -f

cd ..

echo "Deployment script finished."
