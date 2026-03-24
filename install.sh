#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║   🥥  CoirCraft PH — Auto Installer          ║"
echo "║   Group 7                                    ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# ── Check dependencies ──────────────────────────────────────
echo -e "${YELLOW}Checking requirements...${NC}"
command -v php      >/dev/null 2>&1 || { echo -e "${RED}PHP 8.2+ is required. Please install it first.${NC}"; exit 1; }
command -v composer >/dev/null 2>&1 || { echo -e "${RED}Composer is required. https://getcomposer.org${NC}"; exit 1; }
command -v node     >/dev/null 2>&1 || { echo -e "${RED}Node.js 18+ is required. https://nodejs.org${NC}"; exit 1; }
command -v npm      >/dev/null 2>&1 || { echo -e "${RED}npm is required.${NC}"; exit 1; }
echo -e "${GREEN}✓ All dependencies found${NC}"

# ── Laravel Backend ─────────────────────────────────────────
echo -e "\n${CYAN}[1/4] Setting up Laravel backend...${NC}"
cd backend
composer install --no-interaction --prefer-dist
cp -n .env.example .env || true
php artisan key:generate
echo -e "${YELLOW}  → Please update backend/.env with your database credentials${NC}"
echo -e "${YELLOW}  → Then run: cd backend && php artisan migrate --seed${NC}"
cd ..
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# ── Node.js Service ─────────────────────────────────────────
echo -e "\n${CYAN}[2/4] Setting up Node.js service...${NC}"
cd node-service
npm install
cp -n .env.example .env || true
cd ..
echo -e "${GREEN}✓ Node service ready${NC}"

# ── Buyer Frontend ───────────────────────────────────────────
echo -e "\n${CYAN}[3/4] Setting up Buyer frontend...${NC}"
cd frontend-buyer
npm install
cp -n .env.example .env || true
cd ..
echo -e "${GREEN}✓ Buyer frontend ready${NC}"

# ── Seller Frontend ──────────────────────────────────────────
echo -e "\n${CYAN}[4/4] Setting up Seller frontend...${NC}"
cd frontend-seller
npm install
cp -n .env.example .env || true
cd ..
echo -e "${GREEN}✓ Seller frontend ready${NC}"

echo -e "\n${GREEN}"
echo "╔══════════════════════════════════════════════╗"
echo "║   ✅  Installation complete!                 ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"
echo -e "Next steps:"
echo -e "  1. Create MySQL database: ${CYAN}CREATE DATABASE coircraft;${NC}"
echo -e "  2. Edit ${CYAN}backend/.env${NC} with your DB credentials"
echo -e "  3. Run: ${CYAN}cd backend && php artisan migrate --seed${NC}"
echo -e "  4. Run each service in a separate terminal:"
echo -e "     ${CYAN}cd backend       && php artisan serve${NC}         → http://localhost:8000"
echo -e "     ${CYAN}cd node-service  && npm start${NC}                 → http://localhost:3001"
echo -e "     ${CYAN}cd frontend-buyer  && npm run dev${NC}             → http://localhost:5173"
echo -e "     ${CYAN}cd frontend-seller && npm run dev${NC}             → http://localhost:5174"
echo ""
echo -e "Default credentials (after seeding):"
echo -e "  Buyer:  ${CYAN}buyer@coircraft.ph${NC}  / ${CYAN}password${NC}"
echo -e "  Seller: ${CYAN}seller@coircraft.ph${NC} / ${CYAN}password${NC}"
