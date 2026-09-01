#!/bin/bash
# Harness verification for apm-backoffice. Run from repo root.
# Usage: ./verify.sh [build|test|lint|all]   (default: build)
# Always ends with a machine-parseable line: HARNESS_VERIFY: PASS|FAIL
set -eo pipefail

MODE="${1:-build}"

fail() { echo "HARNESS_VERIFY: FAIL ($1)"; exit 1; }

run_build() {
  echo "TODO: replace with this project's real build command." >&2
  fail "build not configured"
}

run_test() {
  echo "No test check configured for this project."
}

run_lint() {
  echo "No lint check configured for this project."
}

case "$MODE" in
  build) run_build ;;
  test)  run_test ;;
  lint)  run_lint ;;
  all)   run_build && run_test && run_lint ;;
  *)     echo "Unknown mode: $MODE (use build|test|lint|all)"; exit 2 ;;
esac

echo "HARNESS_VERIFY: PASS ($MODE)"
