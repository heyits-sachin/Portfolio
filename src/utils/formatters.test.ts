import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRelativeTime,
  calculateProgressPercentage,
  filterRepositories,
  formatNumberWithCommas,
  buildContributionGrid,
} from './formatters';

test('calculateProgressPercentage returns clamped accurate percentage', () => {
  assert.equal(calculateProgressPercentage(50, 100), 50);
  assert.equal(calculateProgressPercentage(61, 800), 7.6);
  assert.equal(calculateProgressPercentage(0, 500), 0);
  assert.equal(calculateProgressPercentage(10, 0), 0);
});

test('formatNumberWithCommas formats thousands and millions properly', () => {
  assert.equal(formatNumberWithCommas(1346395), '1,346,395');
  assert.equal(formatNumberWithCommas(120), '120');
  assert.equal(formatNumberWithCommas(0), '0');
});

test('filterRepositories filters by name and description case-insensitively', () => {
  const repos = [
    { name: 'QuickFolio', description: 'Flask SaaS portfolio builder' },
    { name: 'Campus-Marketplace-web', description: 'Student trading app' },
    { name: 'AI-Practicals', description: null },
  ];

  const results = filterRepositories(repos, 'flask');
  assert.equal(results.length, 1);
  assert.equal(results[0].name, 'QuickFolio');

  const campusResults = filterRepositories(repos, 'campus');
  assert.equal(campusResults.length, 1);
  assert.equal(campusResults[0].name, 'Campus-Marketplace-web');

  const emptyResults = filterRepositories(repos, '');
  assert.equal(emptyResults.length, 3);
});

test('formatRelativeTime handles recent times and invalid inputs', () => {
  assert.equal(formatRelativeTime('invalid-date'), 'Recently');
  const now = new Date().toISOString();
  assert.equal(formatRelativeTime(now), 'Just now');
});

test('buildContributionGrid generates 52 weeks of 7 days with valid levels and totals', () => {
  const fixedDate = new Date('2026-11-04T00:00:00Z');
  const lcGrid = buildContributionGrid(undefined, 'leetcode', fixedDate);
  assert.equal(lcGrid.weeks.length, 52);
  assert.equal(lcGrid.weeks[0].days.length, 7);
  assert.ok(lcGrid.totalContributions > 100);
  assert.ok(lcGrid.activeDays >= 60);

  const ghGrid = buildContributionGrid(undefined, 'github', fixedDate);
  assert.equal(ghGrid.weeks.length, 52);
  assert.ok(ghGrid.totalContributions > 150);
  assert.ok(ghGrid.activeDays >= 60);
});

test('buildContributionGrid includes today UTC midnight LeetCode submissions even in UTC-8 local time', () => {
  // 2026-11-05T05:00:00Z is Nov 4 21:00 in UTC-8, but Nov 5 in UTC and IST
  const refDate = new Date('2026-11-05T05:00:00Z');
  const calendar: Record<string, number> = {};
  // Populate 20 days of submissions ending on 2026-11-05T00:00:00Z (1793836800)
  for (let i = 0; i < 20; i++) {
    const ts = 1793836800 - i * 86400;
    calendar[String(ts)] = i === 0 ? 2 : 1;
  }
  const grid = buildContributionGrid(calendar, 'leetcode', refDate);
  assert.equal(grid.activeDays, 20);
  assert.equal(grid.totalContributions, 21);
});
