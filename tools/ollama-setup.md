# Ollama quick setup

Steps to use Ollama in this workspace:

1. Verify Ollama is installed:

   - Run `ollama --version`.

2. List local models:

   - Run `ollama list`.

3. Pull and run a model (helpers provided):

   - Windows: `scripts\\ollama_pull_and_run.bat [model]`
   - macOS/Linux (WSL/Git Bash): `scripts/ollama_pull_and_run.sh [model]`

   Default model used by the scripts: `deepseek-coder:6.7b` (already present on your machine).

4. Query a running model (example):

   - If the model exposes a local HTTP endpoint, use `curl` per that model's docs. Otherwise use the `ollama` CLI to interact:

     - Example interactive: `ollama run deepseek-coder:6.7b --prompt "Write a short function in Python to reverse a string"`

Notes:

- Pulling a model downloads sizable files. Pick a model you want before pulling large models.
- If you want, tell me which model you prefer and I can pull it now.
