/* eslint-disable no-console */
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';
const TEST_EMAIL = process.env.TEST_EMAIL || 'bip1@iesjoanramis.org';
const TEST_CODE = process.env.TEST_CODE || '123456';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { status: res.status, body };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  console.log(`API smoke test base: ${BASE_URL}`);

  // Step 1: login and token
  const login = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, code: TEST_CODE }),
  });
  assert(login.status === 201 || login.status === 200, `Login failed: ${login.status}`);
  assert(login.body?.token, 'Missing token in login response');
  const token = login.body.token;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  console.log('STEP1 login/token: OK');

  // Step 2: resources list
  const resources = await request('/resources?limit=20', { headers });
  assert(resources.status === 200, `Resources list failed: ${resources.status}`);
  const resourcesList = Array.isArray(resources.body) ? resources.body : resources.body?.data || [];
  assert(Array.isArray(resourcesList), 'Resources list is not an array');
  console.log(`STEP2 resources list: OK (${resourcesList.length})`);

  // Step 3: my resources
  const myBefore = await request('/resources/my', { headers });
  assert(myBefore.status === 200, `My resources failed: ${myBefore.status}`);
  const myBeforeList = Array.isArray(myBefore.body) ? myBefore.body : [];
  console.log(`STEP3 my resources: OK (${myBeforeList.length})`);

  // Step 4: self-assign available resource
  const available = await request('/resources?status=available&limit=1', { headers });
  assert(available.status === 200, `Available resources failed: ${available.status}`);
  const availableList = Array.isArray(available.body) ? available.body : available.body?.data || [];
  assert(availableList.length > 0, 'No available resource found for self-assign test');
  const candidate = availableList[0];

  const selfAssign = await request('/resources/self-assign', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      resource_code: candidate.code,
      location: { x: -5, z: -3, mesaId: 1 },
    }),
  });
  assert(selfAssign.status === 201 || selfAssign.status === 200, `Self-assign failed: ${selfAssign.status}`);
  assert(selfAssign.body?.resource?.status === 'assigned', 'Self-assign did not set assigned status');
  console.log(`STEP4 self-assign: OK (${candidate.code})`);

  // Step 5: release same resource
  const release = await request('/resources/release', {
    method: 'POST',
    headers,
    body: JSON.stringify({ resource_code: candidate.code }),
  });
  assert(release.status === 201 || release.status === 200, `Release failed: ${release.status}`);
  console.log(`STEP5 release: OK (${candidate.code})`);

  console.log('API smoke test completed successfully.');
}

run().catch((err) => {
  console.error('API smoke test failed:', err.message);
  process.exitCode = 1;
});
