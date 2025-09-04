import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../apps/mobile/.env') });

// Configuration
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID;
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const ENVIRONMENT = process.env.EXPO_PUBLIC_APP_VARIANT || 'development';

if (!SUPABASE_PROJECT_ID) {
  console.error('Error: SUPABASE_PROJECT_ID is not set in environment variables');
  process.exit(1);
}

if (!SUPABASE_ACCESS_TOKEN) {
  console.error('Error: SUPABASE_ACCESS_TOKEN is not set in environment variables');
  console.log('You can create an access token at: https://app.supabase.com/account/tokens');
  process.exit(1);
}

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const MIGRATIONS_DIR = path.join(ROOT_DIR, 'supabase/migrations');
const FUNCTIONS_DIR = path.join(ROOT_DIR, 'supabase/functions');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

const log = {
  info: (message: string) => console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`),
  success: (message: string) => console.log(`${colors.green}✅ ${message}${colors.reset}`),
  warn: (message: string) => console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`),
  error: (message: string) => console.error(`${colors.red}❌ ${message}${colors.reset}`),
};

// Helper function to run shell commands
const runCommand = (command: string, cwd: string = process.cwd()) => {
  log.info(`Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit', cwd });
    return true;
  } catch (error) {
    log.error(`Command failed: ${command}`);
    if (error instanceof Error) {
      log.error(error.message);
    }
    return false;
  }
};

// Deploy database migrations
const deployMigrations = async () => {
  log.info('Deploying database migrations...');
  
  // Check if migrations directory exists
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    log.warn('No migrations directory found. Skipping database migrations.');
    return true;
  }
  
  // Deploy migrations using Supabase CLI
  const deployCommand = `npx supabase db push --project-ref ${SUPABASE_PROJECT_ID} --db-url postgresql://postgres:${SUPABASE_ACCESS_TOKEN}@db.${SUPABASE_PROJECT_ID}.supabase.co:5432/postgres`;
  
  if (!runCommand(deployCommand, ROOT_DIR)) {
    log.error('Failed to deploy database migrations');
    return false;
  }
  
  log.success('Database migrations deployed successfully');
  return true;
};

// Deploy Edge Functions
const deployFunctions = async () => {
  log.info('Deploying Edge Functions...');
  
  // Check if functions directory exists
  if (!fs.existsSync(FUNCTIONS_DIR)) {
    log.warn('No functions directory found. Skipping function deployment.');
    return true;
  }
  
  // Deploy each function
  const functions = fs.readdirSync(FUNCTIONS_DIR).filter(dir => {
    const stat = fs.statSync(path.join(FUNCTIONS_DIR, dir));
    return stat.isDirectory() && dir !== 'shared';
  });
  
  if (functions.length === 0) {
    log.warn('No functions found in the functions directory');
    return true;
  }
  
  let allDeployed = true;
  
  for (const func of functions) {
    log.info(`Deploying function: ${func}`);
    const deployCommand = `npx supabase functions deploy ${func} --project-ref ${SUPABASE_PROJECT_ID} --no-verify-jwt`;
    
    if (!runCommand(deployCommand, path.join(FUNCTIONS_DIR, '..'))) {
      log.error(`Failed to deploy function: ${func}`);
      allDeployed = false;
    } else {
      log.success(`Successfully deployed function: ${func}`);
    }
  }
  
  if (!allDeployed) {
    log.error('Some functions failed to deploy');
    return false;
  }
  
  log.success('All Edge Functions deployed successfully');
  return true;
};

// Set up environment variables in Supabase
const setupEnvironmentVariables = async () => {
  log.info('Setting up environment variables in Supabase...');
  
  // List of required environment variables
  const envVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  
  // Check if all required variables are set
  const missingVars = envVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    log.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
    log.warn('Please set them in your .env file before deploying');
    return false;
  }
  
  // Set environment variables in Supabase
  for (const varName of envVars) {
    const value = process.env[varName];
    if (!value) continue;
    
    const setVarCommand = `npx supabase secrets set --env-file ./apps/mobile/.env ${varName} --project-ref ${SUPABASE_PROJECT_ID}`;
    
    if (!runCommand(setVarCommand, ROOT_DIR)) {
      log.error(`Failed to set environment variable: ${varName}`);
      return false;
    }
  }
  
  log.success('Environment variables set up successfully');
  return true;
};

// Main deployment function
const deploy = async () => {
  console.log(`${colors.bright}🚀 Starting Supabase deployment to ${ENVIRONMENT} environment${colors.reset}\n`);
  
  // 1. Deploy database migrations
  if (!(await deployMigrations())) {
    process.exit(1);
  }
  
  // 2. Deploy Edge Functions
  if (!(await deployFunctions())) {
    process.exit(1);
  }
  
  // 3. Set up environment variables
  if (!(await setupEnvironmentVariables())) {
    process.exit(1);
  }
  
  console.log(`\n${colors.bright}${colors.green}🎉 Deployment completed successfully!${colors.reset}`);
  console.log(`\nNext steps:
1. Verify your deployment at: https://app.supabase.com/project/${SUPABASE_PROJECT_ID}
2. Test your Edge Functions
3. Monitor your deployment in the Supabase dashboard\n`);
};

// Run the deployment
deploy().catch(error => {
  log.error('Deployment failed:');
  console.error(error);
  process.exit(1);
});
