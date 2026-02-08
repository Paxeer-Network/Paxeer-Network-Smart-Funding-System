#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# Paxeer Funding – Build, Validate & Start
# Builds backend, service workers, and frontend.
# Checks required env vars. Starts all three on pm2 if everything passes.
#   Frontend → port 4000
#   Backend  → port 4200
# ─────────────────────────────────────────────────────────────────────────────

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

ok()   { echo -e "  ${GREEN}✔${NC} $1"; }
fail() { echo -e "  ${RED}✘${NC} $1"; }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; }
info() { echo -e "  ${CYAN}→${NC} $1"; }
header() { echo -e "\n${BOLD}${CYAN}━━━ $1 ━━━${NC}"; }

ERRORS=0

# ─────────────────────────────────────────────────────────────────────────────
# 1. Load .env
# ─────────────────────────────────────────────────────────────────────────────
header "Environment"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
  ok ".env loaded from $ENV_FILE"
else
  fail ".env file not found at $ENV_FILE"
  info "Copy .env.example → .env and fill in the values"
  exit 1
fi

# ─────────────────────────────────────────────────────────────────────────────
# 2. Check required environment variables
# ─────────────────────────────────────────────────────────────────────────────
header "Required Environment Variables"

MISSING_VARS=0

# Format: VAR_NAME | where it's used
REQUIRED_VARS=(
  "DATABASE_URL|backendServers/src/config.ts, serviceWorkers/src/config.ts"
  "JWT_SECRET|backendServers/src/config.ts"
  "MORALIS_API_KEY|backendServers/src/services/moralis.ts"
  "ADMIN_PRIVATE_KEY|backendServers/src/config.ts, serviceWorkers/src/config.ts"
  "USDL_TOKEN_ADDRESS|backendServers/src/config.ts, serviceWorkers/src/config.ts"
  "WALLET_FACTORY_ADDRESS|backendServers/src/config.ts, serviceWorkers/src/config.ts"
  "EVENT_EMITTER_ADDRESS|backendServers/src/config.ts, serviceWorkers/src/config.ts"
  "RPC_URL_PAXEER|backendServers/src/config.ts, serviceWorkers/src/config.ts"
)

for entry in "${REQUIRED_VARS[@]}"; do
  VAR_NAME="${entry%%|*}"
  VAR_FILES="${entry##*|}"
  VAL="${!VAR_NAME:-}"

  if [ -z "$VAL" ]; then
    fail "${BOLD}$VAR_NAME${NC} is ${RED}not set${NC}"
    info "Set it in: ${YELLOW}$VAR_FILES${NC}"
    MISSING_VARS=$((MISSING_VARS + 1))
  else
    # Mask secrets in output
    case "$VAR_NAME" in
      *KEY*|*SECRET*|*PASSWORD*|*PRIVATE*)
        ok "$VAR_NAME = ****${VAL: -4}"
        ;;
      *)
        ok "$VAR_NAME = $VAL"
        ;;
    esac
  fi
done

# Warn-only vars (have safe defaults)
OPTIONAL_VARS=(
  "API_PORT|backendServers/src/config.ts (default: 3000)"
  "FUNDING_AMOUNT|backendServers/src/config.ts (default: 100)"
  "MIN_QUALITY_TRANSACTIONS|backendServers/src/config.ts (default: 20)"
  "TX_HISTORY_MONTHS|backendServers/src/config.ts (default: 2)"
  "ASSIGNMENT_POLL_INTERVAL|serviceWorkers/src/config.ts (default: 10000)"
  "FUNDING_POLL_INTERVAL|serviceWorkers/src/config.ts (default: 15000)"
)

for entry in "${OPTIONAL_VARS[@]}"; do
  VAR_NAME="${entry%%|*}"
  VAR_FILES="${entry##*|}"
  VAL="${!VAR_NAME:-}"
  if [ -z "$VAL" ]; then
    warn "$VAR_NAME not set – using default (${VAR_FILES})"
  fi
done

if [ "$MISSING_VARS" -gt 0 ]; then
  echo ""
  fail "${RED}${BOLD}$MISSING_VARS required variable(s) missing. Fix them in ${ENV_FILE} and re-run.${NC}"
  ERRORS=$((ERRORS + 1))
fi

# ─────────────────────────────────────────────────────────────────────────────
# 3. Build Backend
# ─────────────────────────────────────────────────────────────────────────────
header "Build: Backend Server"

BACKEND_DIR="$ROOT_DIR/backendServers"
if (cd "$BACKEND_DIR" && npx tsc --build 2>&1); then
  ok "Backend compiled successfully"
else
  fail "Backend build FAILED"
  ERRORS=$((ERRORS + 1))
fi

# ─────────────────────────────────────────────────────────────────────────────
# 4. Build Service Workers
# ─────────────────────────────────────────────────────────────────────────────
header "Build: Service Workers"

WORKERS_DIR="$ROOT_DIR/serviceWorkers"
if (cd "$WORKERS_DIR" && npx tsc --build 2>&1); then
  ok "Service Workers compiled successfully"
else
  fail "Service Workers build FAILED"
  ERRORS=$((ERRORS + 1))
fi

# ─────────────────────────────────────────────────────────────────────────────
# 5. Build Frontend
# ─────────────────────────────────────────────────────────────────────────────
header "Build: User Interface"

UI_DIR="$ROOT_DIR/userInterface"
if (cd "$UI_DIR" && npx vite build 2>&1); then
  ok "Frontend compiled successfully"
else
  fail "Frontend build FAILED"
  ERRORS=$((ERRORS + 1))
fi

# ─────────────────────────────────────────────────────────────────────────────
# 6. Summary & PM2 start
# ─────────────────────────────────────────────────────────────────────────────
header "Summary"

if [ "$ERRORS" -gt 0 ]; then
  fail "${RED}${BOLD}$ERRORS error(s) detected. Fix the issues above before starting.${NC}"
  exit 1
fi

ok "${GREEN}${BOLD}All builds passed and all variables set!${NC}"
echo ""
info "Starting services with pm2..."

# Stop any previous instances
pm2 delete paxeer-backend   2>/dev/null || true
pm2 delete paxeer-workers   2>/dev/null || true
pm2 delete paxeer-frontend  2>/dev/null || true

# Override backend port to 4200 in .env for this session
export API_PORT=4200

# Backend – port 4200 (cwd = root so dotenv finds .env)
API_PORT=4200 pm2 start "$BACKEND_DIR/dist/index.js" \
  --name paxeer-backend \
  --cwd "$ROOT_DIR"
ok "Backend started on port 4200"

# Service Workers (cwd = root so dotenv finds .env)
pm2 start "$WORKERS_DIR/dist/index.js" \
  --name paxeer-workers \
  --cwd "$ROOT_DIR"
ok "Service Workers started"

# Frontend – serve built dist on port 4000 via vite preview
pm2 start npx \
  --name paxeer-frontend \
  --cwd "$UI_DIR" \
  -- vite preview --port 4000 --host
ok "Frontend started on port 4000"

echo ""
pm2 list

header "Done"
echo -e "  ${GREEN}Frontend${NC}  → http://localhost:${BOLD}4000${NC}"
echo -e "  ${GREEN}Backend${NC}   → http://localhost:${BOLD}4200${NC}"
echo -e "  ${GREEN}Workers${NC}   → running in background"
echo ""
info "Logs: pm2 logs"
info "Stop: pm2 stop all"
