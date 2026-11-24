// Publish using your existing Git Credential Manager sign-in. Never prints credentials.
import { spawnSync } from 'node:child_process';
const action = process.argv[2] || 'inspect';
const owner = process.argv[3] || 'Reaganjade12';
const repo = 'flower-greeting';
const auth = spawnSync('git', ['credential', 'fill'], {
  input: `protocol=https\nhost=github.com\nusername=${owner}\n\n`,
  encoding: 'utf8', env: { ...process.env, GCM_INTERACTIVE: 'never', GIT_TERMINAL_PROMPT: '0' },
});
if (auth.status !== 0) throw new Error('GitHub sign-in could not be loaded. Sign in with Git Credential Manager first.');
const token = auth.stdout.split(/\r?\n/).find(line => line.startsWith('password='))?.slice(9);
if (!token) throw new Error('No GitHub credential available.');
async function api(path, method = 'GET', body) {
  const response = await fetch(`https://api.github.com${path}`, {
    method, headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'flower-greeting-publisher', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = response.status === 204 ? {} : await response.json();
  return { status: response.status, data };
}
const user = await api('/user');
if (user.status !== 200 || user.data.login.toLowerCase() !== owner.toLowerCase()) throw new Error('GitHub account did not match the selected owner.');
console.log(`Signed in as ${user.data.login}`);
if (action === 'inspect') {
  const result = await api(`/repos/${owner}/${repo}`);
  console.log(JSON.stringify({ repositoryStatus: result.status, url: result.data.html_url }));
} else if (action === 'create') {
  const existing = await api(`/repos/${owner}/${repo}`);
  if (existing.status !== 404) throw new Error('Repository already exists or could not be checked; refusing to overwrite it.');
  const result = await api('/user/repos', 'POST', { name: repo, description: 'An animated purple flower greeting. Personalize a note and share a little happiness.', private: false, auto_init: false, has_issues: false, has_wiki: false });
  if (result.status !== 201) throw new Error(`Repository creation failed (${result.status}): ${result.data.message}`);
  console.log(JSON.stringify({ repository: result.data.html_url, remote: result.data.clone_url }));
} else if (action === 'pages') {
  let result = await api(`/repos/${owner}/${repo}/pages`);
  if (result.status === 404) result = await api(`/repos/${owner}/${repo}/pages`, 'POST', { build_type: 'legacy', source: { branch: 'main', path: '/' } });
  if (![200, 201].includes(result.status)) throw new Error(`Pages setup failed (${result.status}): ${result.data.message}`);
  console.log(JSON.stringify({ url: result.data.html_url, status: result.data.status, source: result.data.source }));
} else if (action === 'status') {
  const result = await api(`/repos/${owner}/${repo}/pages`);
  const build = await api(`/repos/${owner}/${repo}/pages/builds/latest`);
  console.log(JSON.stringify({ pagesStatus: result.status, url: result.data.html_url, status: result.data.status, buildStatus: build.data.status, error: build.data.error }));
} else throw new Error('Unknown action. Use inspect, create, pages, or status.');
