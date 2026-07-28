#!/usr/bin/env bash
# Deploy the stack from prebuilt ghcr.io images.
#
# Usage:
#   ./scripts/deploy.sh <tag>      # e.g. dev0.1.0, v1.0.0, latest
#
# Requires the invoking user to be in the 'docker' group (no sudo).
# Pulls the latest repo (ff-only) so this script + compose files stay current,
# then pulls the images for the requested tag and recreates the containers.

set -euo pipefail

TAG="${1:-latest}"

# Resolve the repo root from this script's location.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

echo "==> Updating repo (git pull --ff-only)"
git pull --ff-only || echo "    (git pull skipped — not a git repo or no remote, continuing)"

export IMAGE_TAG="$TAG"
export COMPOSE_FILE="docker-compose.yml:docker-compose.prod.yml"

echo "==> Pulling images for tag: $TAG"
docker compose pull

echo "==> Recreating containers"
docker compose up -d

echo "==> Health check (http://localhost:8080/api/)"
sleep 6
for i in 1 2 3 4 5; do
  if curl -fsS "http://localhost:8080/api/" >/dev/null 2>&1; then
    echo "    OK on attempt $i"
    docker compose ps
    echo "==> Deploy of $TAG complete."
    exit 0
  fi
  echo "    attempt $i failed, retrying in 5s..."
  sleep 5
done

echo "FAIL: /api/ not reachable after retries" >&2
docker compose logs --tail=50 backend >&2 || true
exit 1
