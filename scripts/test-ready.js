/* eslint-disable no-console */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const docsDir = path.join(rootDir, 'docs');
const logPath = path.join(docsDir, 'test-ready-last.log');

function nowIso() {
  return new Date().toISOString();
}

function ensureDocsDir() {
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
}

function runCommand(commandLine) {
  return new Promise((resolve) => {
    const child = spawn(commandLine, {
      cwd: rootDir,
      shell: true,
      env: process.env,
    });

    let output = '';

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      process.stdout.write(text);
      output += text;
    });

    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      process.stderr.write(text);
      output += text;
    });

    child.on('close', (code) => {
      resolve({ code: code || 0, output });
    });
  });
}

async function main() {
  ensureDocsDir();

  const sections = [];
  sections.push(`=== TEST READY REPORT ===`);
  sections.push(`timestamp: ${nowIso()}`);
  sections.push(`cwd: ${rootDir}`);
  sections.push('');

  const commands = [
    { label: 'seed:smoke', commandLine: 'npm run seed:smoke' },
    { label: 'test:api', commandLine: 'npm run test:api' },
  ];

  let failed = false;

  for (const c of commands) {
    sections.push(`--- ${c.label} ---`);
    const result = await runCommand(c.commandLine);
    sections.push(result.output.trimEnd());
    sections.push(`exit_code=${result.code}`);
    sections.push('');

    if (result.code !== 0) {
      failed = true;
      break;
    }
  }

  sections.push(`result=${failed ? 'FAIL' : 'PASS'}`);
  sections.push(`finished_at=${nowIso()}`);

  fs.writeFileSync(logPath, sections.join('\n') + '\n', 'utf8');
  console.log(`\nLog saved: ${logPath}`);

  if (failed) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  const fallback = `=== TEST READY REPORT ===\ntimestamp: ${nowIso()}\nresult=FAIL\nerror=${err.message}\n`;
  try {
    ensureDocsDir();
    fs.writeFileSync(logPath, fallback, 'utf8');
  } catch {
    // Ignore secondary failure.
  }
  console.error('test:ready failed:', err.message);
  process.exitCode = 1;
});
