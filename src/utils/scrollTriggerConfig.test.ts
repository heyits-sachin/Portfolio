import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getSectionScrollRevealConfig,
  getStaggerBatchConfig,
  getTitleStaggerConfig,
  getContentBlockStaggerConfig,
  computeSectionRevealProgress,
} from './scrollTriggerConfig';

test('getSectionScrollRevealConfig returns fade-in and slide-up vars for normal motion', () => {
  const cfg = getSectionScrollRevealConfig(false);
  assert.equal(cfg.from.opacity, 0);
  assert.ok(cfg.from.y > 0, 'Section should start translated downward to slide up');
  assert.equal(cfg.to.opacity, 1);
  assert.equal(cfg.to.y, 0);
  assert.equal(cfg.to.scale, 1);
  assert.equal(cfg.triggerStart, 'top 86%');
});

test('getSectionScrollRevealConfig respects prefers-reduced-motion', () => {
  const cfg = getSectionScrollRevealConfig(true);
  assert.equal(cfg.from.opacity, 1);
  assert.equal(cfg.from.y, 0);
  assert.equal(cfg.to.duration, 0);
});

test('getStaggerBatchConfig adjusts stagger step based on item count', () => {
  const smallGrid = getStaggerBatchConfig(4, false);
  const largeGrid = getStaggerBatchConfig(6, false);
  assert.equal(smallGrid.from.opacity, 0);
  assert.ok(smallGrid.from.y > 0);
  assert.equal(smallGrid.to.opacity, 1);
  assert.equal(smallGrid.to.y, 0);
  assert.ok(largeGrid.to.stagger < smallGrid.to.stagger);
});

test('getTitleStaggerConfig provides graceful slide-up stagger parameters', () => {
  const cfg = getTitleStaggerConfig(false);
  assert.equal(cfg.from.opacity, 0);
  assert.equal(cfg.from.y, 32);
  assert.equal(cfg.to.opacity, 1);
  assert.equal(cfg.to.y, 0);
  assert.ok(cfg.to.stagger > 0);
});

test('getContentBlockStaggerConfig provides smooth staggered card entrance', () => {
  const cfg = getContentBlockStaggerConfig(false);
  assert.equal(cfg.from.opacity, 0);
  assert.equal(cfg.from.y, 34);
  assert.equal(cfg.to.opacity, 1);
  assert.equal(cfg.to.y, 0);
  assert.ok(cfg.to.stagger > 0);
});

test('computeSectionRevealProgress maps element viewport entry from 0 to 1', () => {
  // Viewport height 1000: startY = 860, endY = 350
  assert.equal(computeSectionRevealProgress(950, 1000), 0);
  assert.equal(computeSectionRevealProgress(860, 1000), 0);
  const mid = computeSectionRevealProgress(605, 1000);
  assert.ok(mid > 0.45 && mid < 0.55);
  assert.equal(computeSectionRevealProgress(350, 1000), 1);
  assert.equal(computeSectionRevealProgress(100, 1000), 1);
});
