#!/usr/bin/env bash
# Usage: ./ollama_pull_and_run.sh [model]
set -euo pipefail
MODEL=${1:-deepseek-coder:6.7b}
echo "Pulling model ${MODEL} (may take a while)..."
ollama pull "${MODEL}"
echo "Starting model ${MODEL}..."
ollama run "${MODEL}"
