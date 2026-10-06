import assert from 'node:assert/strict';
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {LESSONS, LEVELS, SOURCES} from './public/course.js';
import {emptyState, loadProgress, saveProgress, validateState, parseBackup, backupDocument, setActiveProfile, profileSnapshots} from './public/storage.js';
import {normalizeAnswer, answerIsCorrect, scheduleReview, checkpointQuestions, questionBank} from './public/study.js';
import {PAIR_TASKS, MISSIONS, WEEK_PLAN} from './public/practice-data.js';

assert.equal(LESSONS.length, 60);
assert.equal(new Set(LESSONS.map(l => l.id)).size, 60);
assert.equal(questionBank(LESSONS).length, 300);
for (const level of LEVELS) {
  assert.equal(LESSONS.filter(l => l.level === level.id).length, ['A1', 'A2'].includes(level.id) ? 18 : 6);
  const questions = checkpointQuestions(LESSONS, level.id, () => 0.42);
  assert.equal(questions.length, 15);
  assert.equal(new Set(questions.map(q => q.id)).size, 15);
  assert(questions.every(q => q.level === level.id));
  assert(new Set(questions.map(q => q.lesson)).size >= Math.min(15, LESSONS.filter(l => l.level === level.id).length));
  assert(PAIR_TASKS.some(t => t.level === level.id));
  assert(MISSIONS.some(m => m.level === level.id));
}
for (const lesson of LESSONS) {
  assert(lesson.points.length >= 3 && lesson.words.length >= 6 && lesson.examples.length >= 3, lesson.id);
  assert(lesson.task.prompt && lesson.task.model && lesson.task.checks.length >= 2);
  assert(SOURCES[lesson.source], lesson.id + ' has a valid reference');
  assert.equal(lesson.questions.length, 5);
  for (const question of lesson.questions) {
    assert(question.prompt && question.explanation);
    if (question.type === 'input') {
      assert(question.answers.every(a => typeof a === 'string' && a.length));
      assert(answerIsCorrect(question, question.answers[0].toUpperCase() + '!'));
    } else {
      assert(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length);
      assert.equal(new Set(question.options).size, question.options.length);
      assert(answerIsCorrect(question, question.answer));
      assert(!answerIsCorrect(question, (question.answer + 1) % question.options.length));
      if (question.type === 'listen') assert(question.audio);
    }
  }
}
assert.equal(WEEK_PLAN.length, 7);
assert.equal(PAIR_TASKS.length, 12);
assert.equal(MISSIONS.length, 10);
for (const task of PAIR_TASKS) assert(task.a && task.b && task.phrases.length >= 3 && task.success.length >= 3);
for (const mission of MISSIONS) assert(new URL(mission.url).protocol === 'https:' && mission.steps.length >= 3 && mission.output);
assert.equal(normalizeAnswer('  HYVÄÄ,   kiitos! '), 'hyvää kiitos');
assert.notEqual(normalizeAnswer('hyvaa'), normalizeAnswer('hyvää'));
assert.equal(normalizeAnswer('a\u0308'), 'ä');
assert.deepEqual(scheduleReview(null, false, 0), {stage: 0, due: 600000});
assert.deepEqual(scheduleReview(null, true, 0), {stage: 1, due: 86400000});
assert.deepEqual(scheduleReview({stage: 6}, true, 0), {stage: 6, due: 120 * 86400000});

const values = new Map();
const storage = {getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value)};
globalThis.localStorage = {...storage};
globalThis.sessionStorage = {...storage};
const locks = new Map();
Object.defineProperty(globalThis, 'navigator', {configurable: true, value: {locks: {request(name, work) {
  const result = (locks.get(name) || Promise.resolve()).then(work);
  locks.set(name, result.catch(() => {}));
  return result;
}}}});
const key = id => 'puro:progress:v2:' + id;
const date = new Date().toISOString();
const rajin = {...emptyState('rajin'), completed: {'a1-hello': {score: 100, date}}, journal: {'a1-hello': 'Hei! Kiitos!'}, customWords: {sisu: {en: 'determination', level: 'A1'}}, review: {sisu: {stage: 1, due: 100}}, draft: {id: 'a1-smalltalk', step: 2, mistakes: 1}, checkpoints: {A1: {score: 80, date}}};
assert.deepEqual(await loadProgress('rajin'), {data: emptyState('rajin'), revision: 0});
assert.deepEqual(await loadProgress('labbaiqua'), {data: emptyState('labbaiqua'), revision: 0});
assert.deepEqual(await saveProgress(rajin, 0, 'rajin'), {revision: 1});
assert.deepEqual(await loadProgress('rajin'), {data: rajin, revision: 1});
assert.deepEqual(await loadProgress('labbaiqua'), {data: emptyState('labbaiqua'), revision: 0});
const labbaiqua = {...emptyState('labbaiqua'), journal: {'a1-hello': 'Moi!'}};
await saveProgress(labbaiqua, 0, 'labbaiqua');
setActiveProfile('labbaiqua');
assert.deepEqual(await loadProgress(), {data: labbaiqua, revision: 1});
setActiveProfile('rajin');
assert.equal(profileSnapshots()[1].data.name, 'Labbaiqua');
await assert.rejects(saveProgress(rajin, 0, 'rajin'), error => error.code === 409);
const concurrent = await Promise.allSettled([saveProgress(rajin, 1, 'rajin'), saveProgress(rajin, 1, 'rajin')]);
assert.equal(concurrent.filter(r => r.status === 'fulfilled').length, 1);
assert.equal(concurrent.find(r => r.status === 'rejected').reason.code, 409);
assert.equal((await loadProgress('rajin')).revision, 2);
assert.equal((await loadProgress('labbaiqua')).revision, 1);
assert.deepEqual(parseBackup(JSON.stringify(backupDocument(rajin))), rajin);
assert.deepEqual(parseBackup(JSON.stringify(rajin)), rajin);
assert.throws(() => parseBackup('broken JSON'), /valid Puro JSON/);
assert.throws(() => parseBackup('x'.repeat(2500001)), /too large/);
assert(!validateState({...rajin, goal: -1}));
assert(!validateState({...rajin, draft: {id: 'a1-hello', step: -1, mistakes: 0}}));
assert(!validateState({...rajin, unexpected: 'not a progress field'}));
assert(!validateState(JSON.parse(JSON.stringify(rajin).replace('"journal":{', '"journal":{"__proto__":"bad",'))));
const saved = values.get(key('rajin'));
localStorage.setItem = () => {throw new Error('QuotaExceededError');};
await assert.rejects(saveProgress(rajin, 2, 'rajin'), /full or blocked/);
assert.equal(values.get(key('rajin')), saved);
localStorage.setItem = storage.setItem;
values.set(key('rajin'), 'broken JSON');
await assert.rejects(loadProgress('rajin'), /existing data has been kept/);
assert.equal(values.get(key('rajin')), 'broken JSON');
assert.equal(profileSnapshots()[0].error.includes('kept'), true);
values.delete(key('rajin'));
const legacy = {...emptyState(), name: 'Legacy learner'};
for (const field of ['mistakes', 'missions', 'sessions', 'checkpoints', 'draft']) delete legacy[field];
values.set('puro-progress-v1', JSON.stringify({data: legacy, revision: 4}));
const migrated = await loadProgress('rajin');
assert.equal(migrated.data.name, 'Legacy learner');
assert.deepEqual(migrated.data.mistakes, {});
await saveProgress(migrated.data, 4, 'rajin');
assert.equal((await loadProgress('rajin')).revision, 5);
assert.equal((await loadProgress('labbaiqua')).data.name, 'Labbaiqua');
localStorage.getItem = () => {throw new Error('SecurityError');};
await assert.rejects(loadProgress('rajin'), /storage is unavailable/);

const config = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url)));
assert.equal(config.outputDirectory, 'public');
assert.equal(config.framework, null);
assert.equal(config.installCommand, '');
assert.equal(config.buildCommand, '');
assert(existsSync(new URL('./public/index.html', import.meta.url)));
for (const file of readdirSync(new URL('./public/', import.meta.url)).filter(f => f.endsWith('.js')))
  execFileSync(process.execPath, ['--check', new URL('./public/' + file, import.meta.url).pathname]);
assert(!readFileSync(new URL('./public/app.js', import.meta.url), 'utf8').includes('/api/progress'));
const vocabulary = new Set(LESSONS.flatMap(l => l.words.map(([fi]) => fi))).size;
console.log(`Passed: 60 lessons, 300 answer checks, ${vocabulary} vocabulary entries, two isolated profiles, legacy migration, backups, save conflicts, storage failures, recall scheduling, checkpoint selection, JavaScript syntax, and static Vercel configuration.`);
