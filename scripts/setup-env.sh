#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Setting up your Expo/EAS environment variables${NC}"
echo -e "${YELLOW}============================================${NC}"

# Check if .env file exists
if [ ! -f "apps/mobile/.env" ]; then
  echo -e "${GREEN}ℹ️  Creating .env file from template...${NC}"
  cp apps/mobile/.env.example apps/mobile/.env
fi

# Function to set environment variable
set_env_var() {
  local var_name=$1
  local prompt=$2
  local is_secret=$3
  local current_value
  
  # Get current value
  if [ -f "apps/mobile/.env" ]; then
    current_value=$(grep -m 1 -E "^$var_name=" apps/mobile/.env | cut -d '=' -f2-)
  fi
  
  # Skip if already set and not empty
  if [ -n "$current_value" ] && [ "$current_value" != "your_$(echo $var_name | tr '[:upper:]' '[:lower:]')_here" ]; then
    echo -e "${GREEN}ℹ️  $var_name is already set.${NC}"
    return
  fi
  
  # Prompt for new value
  echo -e "\n${YELLOW}🔑 $prompt${NC}"
  if [ "$is_secret" = true ]; then
    read -s -p "> " value
    echo # New line after hidden input
  else
    read -p "> " value
  fi
  
  # Update .env file
  if [ -n "$value" ]; then
    if grep -q "^$var_name=" apps/mobile/.env; then
      # Update existing variable
      if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^$var_name=.*|$var_name=$value|" apps/mobile/.env
      else
        # Linux/Unix
        sed -i "s|^$var_name=.*|$var_name=$value|" apps/mobile/.env
      fi
    else
      # Add new variable
      echo -e "\n# $prompt" >> apps/mobile/.env
      echo "$var_name=$value" >> apps/mobile/.env
    fi
    echo -e "${GREEN}✅ $var_name has been set${NC}"
  else
    echo -e "${YELLOW}⚠️  $var_name was not updated${NC}"
  fi
}

# Set up environment variables
set_env_var "EXPO_PUBLIC_SUPABASE_URL" "Enter your Supabase URL" false
set_env_var "EXPO_PUBLIC_SUPABASE_ANON_KEY" "Enter your Supabase Anon Key" true
set_env_var "SUPABASE_SERVICE_ROLE_KEY" "Enter your Supabase Service Role Key" true
set_env_var "DATABASE_URL" "Enter your Database URL" true
set_env_var "EXPO_PUBLIC_EAS_PROJECT_ID" "Enter your EAS Project ID" false

echo -e "\n${GREEN}✨ Environment setup complete!${NC}"
echo -e "${YELLOW}Don't forget to restart your development server for changes to take effect.${NC}"
