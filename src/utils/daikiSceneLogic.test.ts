import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCrystalChoreography,
  formatWorksCounter,
  computeFocusBlur,
} from './daikiSceneLogic';

test('getCrystalChoreography returns expected phase across scroll progress', () => {
  const heroState = getCrystalChoreography(0.02, false);
  assert.equal(heroState.sectionPhase, 'hero');
  assert.ok(heroState.normX >= 0.49 && heroState.normX <= 0.55);

  const aboutState = getCrystalChoreography(0.2, false);
  assert.equal(aboutState.sectionPhase, 'about');
  assert.ok(aboutState.normX > 0.65);

  const worksState = getCrystalChoreography(0.45, false);
  assert.equal(worksState.sectionPhase, 'works');
  assert.ok(worksState.shardScatter >= 0.7);

  const portalState = getCrystalChoreography(0.63, true);
  assert.equal(portalState.sectionPhase, 'dream-portal');
  assert.ok(portalState.portalIntensity >= 0.8);

  const contactState = getCrystalChoreography(0.95, false);
  assert.equal(contactState.sectionPhase, 'contact');
  assert.ok(contactState.normX > 0.7);
});

test('formatWorksCounter formats 1-indexed two-digit counter strings', () => {
  assert.equal(formatWorksCounter(0, 6), '01 / 06');
  assert.equal(formatWorksCounter(2, 6), '03 / 06');
  assert.equal(formatWorksCounter(9, 6), '06 / 06');
});

test('computeFocusBlur returns 0 blur at focus center and progressive blur away from focus', () => {
  const focused = computeFocusBlur(0);
  assert.equal(focused.blurPx, 0);
  assert.equal(focused.opacity, 1);

  const unfocused = computeFocusBlur(0.8);
  assert.equal(unfocused.blurPx, 8);
  assert.ok(unfocused.opacity < 0.5);
});
