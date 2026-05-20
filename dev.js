const { spawn } = require('child_process');
const path = require('path');

// ANSI escape codes for beautiful colors
const BLUE = '\x1b[36m';  // Cyan/Blue
const GREEN = '\x1b[32m'; // Green
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function log(prefix, color, message) {
  const lines = message.toString().split('\n');
  lines.forEach(line => {
    // Avoid printing empty lines
    if (line.trim() !== '') {
      console.log(`${color}${BOLD}[${prefix}]${RESET} ${line}`);
    }
  });
}

function runService(name, dir, color) {
  console.log(`${color}${BOLD}[System] Starting ${name} in ./${dir}...${RESET}`);
  
  // Use shell: true to support Windows npm.cmd resolution natively and cross-platform
  const child = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, dir),
    shell: true,
    stdio: ['inherit', 'pipe', 'pipe']
  });

  child.stdout.on('data', (data) => {
    log(name, color, data);
  });

  child.stderr.on('data', (data) => {
    log(name, color, data);
  });

  child.on('close', (code) => {
    console.log(`${color}${BOLD}[${name}] process exited with code ${code}${RESET}`);
    // If one process stops, kill the parent process which terminates the session
    process.exit(code || 0);
  });

  return child;
}

console.log(`${BOLD}--- Starting Full-Stack Development Environment ---${RESET}\n`);

const serverProcess = runService('Server', 'server', BLUE);
const clientProcess = runService('Client', 'client', GREEN);

// Handle process termination cleanly
const cleanup = () => {
  console.log(`\n${BOLD}[System] Stopping all services...${RESET}`);
  try { serverProcess.kill(); } catch (e) {}
  try { clientProcess.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('SIGHUP', cleanup);
