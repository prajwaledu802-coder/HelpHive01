const { spawn } = require('node:child_process');

// Compatibility entrypoint for hosts configured with: node src/service/index.js
const child = spawn(process.execPath, ['server/index.js'], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('Failed to start HelpHive backend:', error);
  process.exit(1);
});
