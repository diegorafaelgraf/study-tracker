const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(process.cwd(), 'coverage', 'test-results.json');
const htmlPath = path.resolve(process.cwd(), 'coverage', 'test-results.html');

if (!fs.existsSync(jsonPath)) {
  console.error('No se encontró coverage/test-results.json. Ejecuta primero `npm run test:unit`.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const tests = [];

for (const suite of data.testResults) {
  for (const assertion of suite.assertionResults) {
    tests.push({
      suite: suite.name,
      title: assertion.title,
      fullName: assertion.fullName,
      status: assertion.status,
      duration: assertion.duration,
      failureMessages: assertion.failureMessages,
    });
  }
}

const passed = tests.filter((t) => t.status === 'passed');
const failed = tests.filter((t) => t.status === 'failed');
const pending = tests.filter((t) => t.status === 'skipped' || t.status === 'todo');

const htmlBody = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Frontend Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; }
    h1, h2 { color: #222; }
    .summary { margin-bottom: 24px; }
    .summary span { display: inline-block; margin-right: 16px; }
    .passed { color: #107C10; }
    .failed { color: #D13438; }
    .pending { color: #FF8C00; }
    .test-row { border-bottom: 1px solid #ddd; padding: 12px 0; }
    .failure { color: #a00; white-space: pre-wrap; margin-top: 8px; }
    .suite { font-weight: 700; margin-bottom: 4px; }
  </style>
</head>
<body>
  <h1>Frontend Test Results</h1>
  <div class="summary">
    <span class="passed">Passed: ${passed.length}</span>
    <span class="failed">Failed: ${failed.length}</span>
    <span class="pending">Pending: ${pending.length}</span>
    <span>Total: ${tests.length}</span>
  </div>

  ${failed.length ? '<h2 class="failed">Failed tests</h2>' : '<h2 class="passed">All tests passed</h2>'}
  ${failed.map((test) => `
    <div class="test-row">
      <div class="suite">${test.suite}</div>
      <div><strong>${test.title}</strong></div>
      <div>Status: ${test.status}</div>
      <div>Duration: ${test.duration ?? 0} ms</div>
      ${test.failureMessages.length ? `<div class="failure">${test.failureMessages.join('\n')}</div>` : ''}
    </div>
  `).join('')}

  ${pending.length ? '<h2 class="pending">Pending tests</h2>' : ''}
  ${pending.map((test) => `
    <div class="test-row">
      <div class="suite">${test.suite}</div>
      <div><strong>${test.title}</strong></div>
      <div>Status: ${test.status}</div>
    </div>
  `).join('')}

  ${passed.length ? '<h2 class="passed">Passed tests</h2>' : ''}
  ${passed.map((test) => `
    <div class="test-row">
      <div class="suite">${test.suite}</div>
      <div><strong>${test.title}</strong></div>
      <div>Status: ${test.status}</div>
      <div>Duration: ${test.duration ?? 0} ms</div>
    </div>
  `).join('')}
</body>
</html>`;

fs.writeFileSync(htmlPath, htmlBody, 'utf8');
console.log(`Frontend HTML report generated at ${htmlPath}`);
