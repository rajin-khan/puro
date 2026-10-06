import assert from 'node:assert/strict';
import {readFile, mkdtemp, mkdir, cp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build, metadata, resolveSiteUrl, STRUCTURED_DATA, STRUCTURED_HASH, TITLE, DESCRIPTION} from './build.mjs';

const source = new URL('./', import.meta.url);
const publicRoot = new URL('public/', source);
const html = await readFile(new URL('index.html', publicRoot), 'utf8');
const config = JSON.parse(await readFile(new URL('vercel.json', source), 'utf8'));
assert.equal(config.buildCommand, 'node build.mjs --deploy');
assert.equal(config.installCommand, '');
assert(config.headers[0].headers.find(h => h.key === 'Content-Security-Policy').value.includes(`'${STRUCTURED_HASH}'`));
assert.equal(html.match(/<title>/g)?.length, 1);
assert.equal(html.match(/<meta name="description"/g)?.length, 1);
assert.equal(html.match(/<h1>/g)?.length, 1);
assert(html.includes('Follow 60 lessons across A1–C2 study levels.'));
assert(html.includes('<noscript>'));
assert(TITLE.length < 60 && DESCRIPTION.length <= 160);
const data = JSON.parse(STRUCTURED_DATA);
assert.equal(data['@type'], 'WebApplication');
assert.equal(data.description, DESCRIPTION);
assert(!data.aggregateRating && !data.offers, 'No invented ratings or prices');
for (const tag of [...html.matchAll(/<(?:meta|link)\b[^>]+>/g)]) {
  const path = tag[0].match(/(?:href|content)="(\/(?:icons\/|social\/|favicon|apple-touch|site\.)[^"?]*)"/);
  if (path) await readFile(new URL('.' + path[1], publicRoot));
}
assert(!html.includes('data:image/svg+xml'), 'Favicons must be real crawlable assets');
const manifest = JSON.parse(await readFile(new URL('site.webmanifest', publicRoot), 'utf8'));
assert.equal(manifest.scope, '/');
assert.equal(manifest.id, '/');
assert(manifest.start_url.startsWith('/'));
assert(manifest.icons.some(icon => icon.purpose === 'maskable'));
const pngSize = bytes => {
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
};
assert.deepEqual(pngSize(await readFile(new URL('social/puro-og.png', publicRoot))), [1200,630]);
assert.deepEqual(pngSize(await readFile(new URL('apple-touch-icon.png', publicRoot))), [180,180]);
assert.deepEqual(pngSize(await readFile(new URL('icons/favicon-96.png', publicRoot))), [96,96]);
for (const icon of manifest.icons) {
  const sizes = icon.sizes.split('x').map(Number);
  assert.deepEqual(pngSize(await readFile(new URL('.' + icon.src, publicRoot))), sizes);
}
const ico = await readFile(new URL('favicon.ico', publicRoot));
assert.equal(ico.readUInt16LE(0), 0);
assert.equal(ico.readUInt16LE(2), 1);
assert.equal(ico.readUInt16LE(4), 3);
assert.deepEqual([0,1,2].map(i => [ico[6+i*16], ico[7+i*16]]), [[16,16],[32,32],[48,48]]);

assert.equal(resolveSiteUrl({}), '');
assert.equal(resolveSiteUrl({VERCEL_PROJECT_PRODUCTION_URL:'puro-example.vercel.app'}), 'https://puro-example.vercel.app');
assert.equal(resolveSiteUrl({SITE_URL:'https://finnish.example.org/', VERCEL_PROJECT_PRODUCTION_URL:'other.vercel.app'}), 'https://finnish.example.org');
for (const url of ['http://example.org','https://localhost','https://127.0.0.1','https://aabivchuosrzxabfbloe.supabase.co','https://user:password@example.org','https://example.org/app','https://example.org/?x=1','https://example.org/#home','https://example.org:8080','javascript:alert(1)','example.org']) {
  assert.throws(() => resolveSiteUrl({SITE_URL:url}), /HTTPS origin/);
}
assert.throws(() => resolveSiteUrl({VERCEL:'1'}), /Production URL missing/);
const production = metadata({VERCEL:'1',VERCEL_ENV:'production',VERCEL_PROJECT_PRODUCTION_URL:'puro-example.vercel.app'});
assert.equal(production.indexable, true);
assert(production.head.includes('rel="canonical" href="https://puro-example.vercel.app/"'));
assert(production.head.includes('property="og:image" content="https://puro-example.vercel.app/social/puro-og.png"'));
assert(production.head.includes('name="twitter:image" content="https://puro-example.vercel.app/social/puro-og.png"'));
assert(production.robots.includes('Sitemap: https://puro-example.vercel.app/sitemap.xml'));
assert.equal(production.sitemap.match(/<loc>/g)?.length, 1);
assert(!production.sitemap.includes('#') && !production.sitemap.includes('supabase'));
for (const env of [{}, {VERCEL:'1',VERCEL_ENV:'preview',VERCEL_PROJECT_PRODUCTION_URL:'puro-example.vercel.app'}]) {
  const result = metadata(env);
  assert.equal(result.indexable, false);
  assert(result.head.includes('content="noindex, nofollow"'));
  assert(!result.robots.includes('Sitemap:'));
  assert(!result.robots.includes('Disallow: /'), 'Bots must be able to see the noindex meta tag');
}
assert(!/rajin|labbaiqua|gmail|publishable/i.test(production.head + production.robots + production.sitemap));

// Exercise real file generation and rebuilds in an isolated temporary directory.
const temp = await mkdtemp(join(tmpdir(), 'puro-seo-check-'));
try {
  const root = pathToFileURL(temp + '/');
  await mkdir(join(temp, 'public'));
  await cp(new URL('vercel.json', source), join(temp, 'vercel.json'));
  await cp(new URL('public/index.html', source), join(temp, 'public/index.html'));
  const env = {SITE_URL:'https://finnish.example.org',VERCEL_ENV:'production'};
  await build(root, env);
  const first = await readFile(join(temp,'public/index.html'), 'utf8');
  await build(root, env);
  assert.equal(await readFile(join(temp,'public/index.html'), 'utf8'), first, 'Rebuild is idempotent');
  assert.equal(first.match(/rel="canonical"/g)?.length, 1);
  assert.equal(first.match(/property="og:image" /g)?.length, 1);
  const originalMain = html.slice(html.indexOf('<body'));
  assert.equal(first.slice(first.indexOf('<body')), originalMain, 'Build leaves the app untouched');
  assert.equal(await readFile(join(temp,'public/robots.txt'),'utf8'), metadata(env).robots);
  assert.equal(await readFile(join(temp,'public/sitemap.xml'),'utf8'), metadata(env).sitemap);
  await assert.rejects(build(root, {VERCEL:'1'}), /Production URL missing/);
  await assert.rejects(build(root, {}, true), /Production URL missing/);
  assert.equal(await readFile(join(temp,'public/index.html'), 'utf8'), first, 'Invalid deployment leaves files intact');
  await build(root, {});
  const local = await readFile(join(temp,'public/index.html'), 'utf8');
  assert(!local.includes('https://finnish.example.org'), 'Local rebuild clears old production URLs');
} finally { await rm(temp, {recursive:true,force:true}); }

// Test the indexing transition with an isolated SDK and DOM, never live users.
const {startCloud} = await import('./public/cloud.js');
const originalInterval = globalThis.setInterval;
const oldGlobals = Object.fromEntries(['document','window','supabase','localStorage'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis,key)]));
const attributes = new Map([['content','index, follow, max-image-preview:large']]);
const classes = new Set(['signed-out']);
const elements = {
  'meta[name="robots"]': {setAttribute:(key,value)=>attributes.set(key,value)},
  '#learner-profile': {disabled:false}, '#sign-out': {hidden:true}
};
try {
  globalThis.document = {hidden:false,body:{classList:{remove:name=>classes.delete(name)}},querySelector:selector=>elements[selector]};
  globalThis.window = {dispatchEvent(){},addEventListener(){}};
  globalThis.localStorage = {getItem:()=>null,setItem(){},removeItem(){}};
  globalThis.setInterval = () => 0;
  globalThis.supabase = {createClient:()=>({
    auth:{getSession:async()=>({data:{session:{user:{id:'isolated-seo-fixture',email:'rajin.khan2001@gmail.com'}}}}),onAuthStateChange(){}},
    rpc:async name=>({data:name==='puro_bootstrap'?{slot:'rajin'}:[]})
  })};
  await startCloud();
  assert.equal(attributes.get('content'),'noindex, nofollow');
  assert.equal(classes.has('signed-out'),false);
  assert.equal(elements['#sign-out'].hidden,false);
} finally {
  globalThis.setInterval = originalInterval;
  for (const [key, descriptor] of Object.entries(oldGlobals)) {
    if (descriptor) Object.defineProperty(globalThis,key,descriptor); else delete globalThis[key];
  }
}
console.log('Passed: real icon assets and sizes, share image, manifest, metadata, CSP, private account noindex, production URLs, preview exclusion, sitemap, invalid URL rejection, and idempotent builds.');
