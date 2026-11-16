import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { openStep } from './helpers/guided-flow.js';
import { readIntakeDraft, readFirstWorkspace } from './helpers/browser-persistence.js';
const data = JSON.parse(fs.readFileSync('fixtures/sample-analysis-en.json', 'utf8'));
async function capture(page) { await page.evaluate(() => { window.__copies=[]; Object.defineProperty(navigator.clipboard,'writeText',{configurable:true,value:async text=>window.__copies.push(text)}); }); }
for (const access of ['none','web','provided']) test(`copied ${access} boundary survives trip reload, answer reload and lens switch`, async ({page}) => {
  await page.goto('./'); await page.locator('#langEn').click(); await capture(page);
  if (access === 'provided') {
    const id = await page.evaluate(async () => {
      const m = await import('./src/core/research-dossier.js');
      let d = await m.createDossier({framing:{question:'Boundary matrix'}});
      d = await m.addSource(d,{title:'Original title',send:true});
      const repo=m.createDossierRepository({backend:m.createIndexedDbDossierBackend()});
      try { await repo.create(d); return d.dossier_id; } finally { repo.close(); }
    });
    await page.locator('#workspaceSaveState').click();
    await page.locator(`[data-case-open="${id}"]`).click();
    await page.locator('#workspaceClose').click();
  }
  await page.locator('#topicInput').fill('Boundary matrix');
  await openStep(page,'settings'); await page.locator('#evidenceAccess').selectOption(access);
  await openStep(page,'prompt'); await page.locator('#copyPromptBtn').click();
  await expect.poll(async()=> (await readIntakeDraft(page))?.sent_boundary?.boundary?.access).toBe(access);
  await openStep(page,'settings'); await page.locator('#evidenceAccess').selectOption(access==='none'?'web':'none');
  await page.reload(); await capture(page);
  await openStep(page,'answer');
  const draft=structuredClone(data); delete draft.tools; delete draft.narrative;
  await page.locator('#jsonInput').fill(JSON.stringify(draft));
  await expect(page.locator('#repairPromptBtn')).toHaveText('Copy a prompt to complete it');
  await page.locator('#repairPromptBtn').click();
  expect(await page.evaluate(()=>window.__copies.at(-1))).toContain(access === 'provided' ? 'Source access for this task is set to: supplied sources only' : `Source access for this task is set to: ${access}.`);
  if (access === 'provided') expect(await page.evaluate(()=>window.__copies.at(-1))).toContain('Original title');
  await page.locator('#jsonInput').fill(JSON.stringify(data));
  await page.locator('#importBtn').click();
  await expect.poll(async()=> (await readFirstWorkspace(page))?.metadata?.answer_boundary?.access).toBe(access);
  await page.reload(); await capture(page);
  await page.locator('[data-other-lens]').click(); await openStep(page,'lens');
  await page.locator('#analysisLens [data-lens="strategic"]').click();
  await page.locator('#improveCopy').click();
  expect(await page.evaluate(()=>window.__copies.at(-1))).toContain(access === 'provided' ? 'Source access for this task is set to: supplied sources only' : `Source access for this task is set to: ${access}.`);
});
