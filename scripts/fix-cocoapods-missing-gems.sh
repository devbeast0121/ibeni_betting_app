#!/usr/bin/env bash
set -euo pipefail

# Determine Homebrew and paths
BREW="$(command -v brew || true)"
if [ -z "$BREW" ]; then
  echo "Homebrew not found. Install Homebrew then re-run this script." >&2
  exit 1
fi
BREW_PREFIX="$("$BREW" --prefix)"
POD_BIN="$BREW_PREFIX/opt/cocoapods/bin/pod"
GEM_BIN="$BREW_PREFIX/opt/ruby/bin/gem"
LIBEXEC="$BREW_PREFIX/opt/cocoapods/libexec"
PROJECT_DIR="$(pwd)/ios/App"

if [ ! -x "$POD_BIN" ]; then
  echo "Error: Homebrew pod not found at $POD_BIN" >&2
  echo "Try: brew reinstall cocoapods && brew link --overwrite cocoapods" >&2
  exit 1
fi
if [ ! -x "$GEM_BIN" ]; then
  echo "Error: Homebrew ruby gem not found at $GEM_BIN" >&2
  echo "Try: brew install ruby" >&2
  exit 1
fi
if [ ! -d "$PROJECT_DIR" ]; then
  echo "Error: Project iOS path not found: $PROJECT_DIR" >&2
  exit 1
fi

cd "$PROJECT_DIR"

while true; do
  echo "Running: pod install (Homebrew pod, clean gem env) ..."
  set +e
  output="$(GEM_HOME= GEM_PATH= "$POD_BIN" install --verbose 2>&1)"
  status=$?
  set -e
  printf '%s\n' "$output"

  if [ "$status" -eq 0 ]; then
    echo "✅ pod install completed successfully."
    exit 0
  fi

  # Capture missing gem names from the pod output
  gems="$(printf '%s\n' "$output" | grep -oE "Could not find '([a-z0-9_+.-]+)'" | sed -E "s/Could not find '(.+)'/\1/" | sort -u || true)"
  # fallback pattern
  if [ -z "$gems" ]; then
    gems="$(printf '%s\n' "$output" | grep -oE "Could not find '([a-z0-9_+.-]+)' \(" | sed -E "s/.*'(.+)'.*/\1/" | sort -u || true)"
  fi

  if [ -z "$gems" ]; then
    echo "No missing gem pattern detected in output; please paste the last output here for manual inspection." >&2
    exit 1
  fi

  echo "Missing gems detected: $gems"
  for g in $gems; do
    echo "Installing $g into CocoaPods libexec..."
    "$GEM_BIN" install "$g" --no-document --install-dir "$LIBEXEC" || {
      echo "Failed to install $g into $LIBEXEC; aborting." >&2
      exit 1
    }
  done

  echo "Installed missing gems; retrying pod install..."
done