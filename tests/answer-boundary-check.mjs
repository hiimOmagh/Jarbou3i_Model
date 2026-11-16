import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const src = readFileSync('src/app.js','utf8');
const fn = src.slice(src.indexOf('function followUpBoundary('),src.indexOf('/* RESEARCH-1D D3'));
const context = {structuredClone,state:{evidenceAccess:'web',lastPrompt:'copied'},replyFor:null,pendingBoundary:{prompt:'copied',replyFor:null,boundary:{access:'provided',sources:['Original']}},answerBoundaries:new WeakMap(),sentPromptSources:()=>[]};
vm.createContext(context);
vm.runInContext(fn,context);
assert.equal(vm.runInContext('followUpBoundary("pending").access',context),'provided');
assert.equal(vm.runInContext('followUpBoundary("answer").access',context),'web');
context.state.lastPrompt='preview';
assert.equal(vm.runInContext('followUpBoundary("pending").access',context),'web');
console.log('PASS pending boundary stays bound to copied prompt; answer and legacy fallback stay independent');

import { createWorkspace, verifyWorkspace, migrateWorkspace, createWorkspaceBundle, parseWorkspaceBundle } from '../src/core/workspace-contract.js';
const analysis = JSON.parse(readFileSync('fixtures/sample-analysis-en.json', 'utf8'));
const boundary = { access: 'provided', sources: ['Original title'] };
const workspace = await createWorkspace({ analysis, answerBoundary: boundary });
const checksum = workspace.working_draft.payload_checksum;
for (const restored of [await verifyWorkspace(workspace), await migrateWorkspace(workspace), await parseWorkspaceBundle(await createWorkspaceBundle(workspace))]) {
  assert.deepEqual(restored.metadata.answer_boundary, boundary);
  assert.equal(restored.working_draft.payload_checksum, checksum);
}
// Same canonical answer pasted without Copy must remove the old provenance.
const persist = src.slice(src.indexOf('async function persistImportedAnalysis('), src.indexOf('// A restore at startup'));
const previous = structuredClone(workspace);
const ctx = { structuredClone, state:{analysis,activeWorkspaceId:previous.workspace_id,analysisLens:'strategic'}, APPLICATION_SHELL:{render(){}}, LENS_REGISTRY:{manifest(){return undefined;}}, createWorkspace, answerBoundaries:new WeakMap(), WORKSPACE_REPOSITORY:{async get(){return previous;},async replace(value){return value;}},keptResults:{},writeSettings(){},setWorkspaceStatus(){},workspaceText(){},$:()=>null };
vm.createContext(ctx); vm.runInContext(persist,ctx);
const saved = await ctx.persistImportedAnalysis(analysis);
assert.equal(saved.metadata.answer_boundary, undefined);
console.log('PASS boundary metadata survives verify/migrate/bundle without payload drift; identical unbound import clears provenance');
// Stored source titles are snapshots, independent of the current dossier.
for (const access of ['none', 'provided', 'web']) {
  const answer = {};
  context.state.analysis = answer;
  context.answerBoundaries.set(answer, {access, sources: access === 'provided' ? ['Original title'] : []});
  context.state.evidenceAccess = access === 'none' ? 'web' : 'none';
  assert.equal(vm.runInContext('followUpBoundary("answer").access', context), access);
  if (access === 'provided') assert.equal(vm.runInContext('followUpBoundary("answer").sources[0]', context), 'Original title');
}
ctx.answerBoundaries.set(analysis, {access:'none', sources:[]});
const rebound = await ctx.persistImportedAnalysis(analysis, previous.workspace_id);
assert.equal(rebound.metadata.answer_boundary.access, 'none');
assert.equal(rebound.working_draft.payload_checksum, checksum);
console.log('PASS none/provided/web matrix retains answer mode and titles; same-checksum import updates boundary');
context.state.lastPrompt='copied'; context.replyFor='completion';
context.pendingBoundary={prompt:'copied',replyFor:'completion',boundary:{access:'provided',sources:['Original title']}};
const finish=src.slice(src.indexOf('function finishPendingReply()'),src.indexOf('// What the AI\'s own replies'));
vm.runInContext(finish,context); vm.runInContext('finishPendingReply()',context);
assert.equal(vm.runInContext('followUpBoundary().access',context),'provided');
context.replyFor='improve';
assert.equal(vm.runInContext('followUpBoundary().access',context),context.state.evidenceAccess);
console.log('PASS accepted completion retains pending boundary; a different reply kind cannot inherit it');
