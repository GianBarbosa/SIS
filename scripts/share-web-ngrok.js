#!/usr/bin/env node

const net = require('node:net');
const http = require('node:http');
const { spawn } = require('node:child_process');

let qrcodeTerminal = null;
try {
  qrcodeTerminal = require('qrcode-terminal');
} catch {
  qrcodeTerminal = null;
}

const initialPort = Number.parseInt(process.argv[2] || '19006', 10);

if (!Number.isInteger(initialPort) || initialPort < 1 || initialPort > 65535) {
  console.error('Error: invalid port. Use a number between 1 and 65535.');
  process.exit(1);
}

let expoProc = null;
let ngrokProc = null;
let shuttingDown = false;
let ngrokLogs = '';

function logNgrokData(chunk) {
  const text = chunk.toString();
  ngrokLogs += text;
  if (ngrokLogs.length > 8000) {
    ngrokLogs = ngrokLogs.slice(-8000);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });

    server.listen(port, '127.0.0.1');
  });
}

async function findFreePort(startPort) {
  let port = startPort;
  while (!(await isPortFree(port))) {
    port += 1;
    if (port > 65535) {
      throw new Error('No free port found.');
    }
  }
  return port;
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk.toString();
      });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
          return;
        }
        reject(new Error(`HTTP ${res.statusCode || 'unknown'}`));
      });
    });

    req.on('error', reject);
    req.setTimeout(2500, () => {
      req.destroy(new Error('Timeout reading ngrok API'));
    });
  });
}

function getPublicUrlFromTunnels(payload) {
  if (!payload || !Array.isArray(payload.tunnels)) {
    return '';
  }

  const httpsTunnel = payload.tunnels.find((t) => typeof t.public_url === 'string' && t.public_url.startsWith('https://'));
  return httpsTunnel ? httpsTunnel.public_url : '';
}

function startProcess(command, args, options = {}) {
  return spawn(command, args, {
    shell: process.platform === 'win32',
    ...options,
  });
}

function cleanup() {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  if (expoProc && !expoProc.killed) {
    expoProc.kill('SIGTERM');
  }
  if (ngrokProc && !ngrokProc.killed) {
    ngrokProc.kill('SIGTERM');
  }
}

process.on('SIGINT', () => {
  cleanup();
  process.exit(130);
});

process.on('SIGTERM', () => {
  cleanup();
  process.exit(143);
});

process.on('exit', cleanup);

async function main() {
  const port = await findFreePort(initialPort);

  console.log(`Starting Expo Web on port ${port}...`);
  expoProc = startProcess('npx', ['expo', 'start', '--web', '--port', String(port), '--host', 'localhost'], {
    stdio: 'inherit',
  });

  expoProc.on('exit', (code) => {
    if (!shuttingDown && code !== 0 && code !== null) {
      console.error(`Expo exited with code ${code}.`);
    }
  });

  console.log('Starting ngrok tunnel...');
  ngrokProc = startProcess('ngrok', ['http', String(port)], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  ngrokProc.stdout.on('data', logNgrokData);
  ngrokProc.stderr.on('data', logNgrokData);

  let ngrokExited = false;
  ngrokProc.on('exit', () => {
    ngrokExited = true;
  });

  let publicUrl = '';
  for (let i = 0; i < 40; i += 1) {
    if (ngrokExited) {
      break;
    }

    try {
      const payload = await getJson('http://127.0.0.1:4040/api/tunnels');
      publicUrl = getPublicUrlFromTunnels(payload);
      if (publicUrl) {
        break;
      }
    } catch {
      // ngrok API can take a few seconds to become available.
    }

    await sleep(1000);
  }

  if (!publicUrl) {
    if (ngrokExited) {
      console.error('Error: ngrok exited early.');
      if (ngrokLogs.trim()) {
        console.error('ngrok output:');
        console.error(ngrokLogs.trim());
      }
      process.exit(1);
    }

    console.warn('Warning: could not detect ngrok public URL yet. Open http://127.0.0.1:4040 to copy it manually.');
  } else {
    console.log('');
    console.log(`Public URL: ${publicUrl}`);
    console.log('');

    if (qrcodeTerminal) {
      console.log('QR code (terminal):');
      qrcodeTerminal.generate(publicUrl, { small: true });
      console.log('');
    } else {
      console.log('QR tip: install qrcode-terminal to print a terminal QR automatically.');
    }
  }

  console.log('Press Ctrl+C to stop Expo and ngrok.');

  await new Promise((resolve) => {
    expoProc.on('exit', resolve);
  });

  cleanup();
}

main().catch((err) => {
  console.error(err.message || err);
  cleanup();
  process.exit(1);
});
