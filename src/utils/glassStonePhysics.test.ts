import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createGlassPhysicsSystem,
  triggerShatterImpulse,
  startRecoveryPhase,
  stepGlassPhysics,
  Vec3,
} from './glassStonePhysics';

function createSampleGeometry(): { vertices: Vec3[]; rawFaces: [number, number, number][] } {
  const vertices: Vec3[] = [
    { x: 0, y: -1, z: 0 },
    { x: 1, y: 0, z: 0.5 },
    { x: -1, y: 0, z: 0.5 },
    { x: 0, y: 0, z: -1 },
    { x: 0, y: 1, z: 0 },
  ];
  const rawFaces: [number, number, number][] = [
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 1],
    [4, 2, 1],
    [4, 3, 2],
    [4, 1, 3],
  ];
  return { vertices, rawFaces };
}

test('createGlassPhysicsSystem initializes intact state with zero offsets', () => {
  const { vertices, rawFaces } = createSampleGeometry();
  const sys = createGlassPhysicsSystem(vertices, rawFaces);

  assert.equal(sys.phase, 'intact');
  assert.equal(sys.pieces.length, 6);
  assert.equal(sys.dispersionMetric, 0);
  for (const p of sys.pieces) {
    assert.equal(p.offset.x, 0);
    assert.equal(p.offset.y, 0);
    assert.equal(p.offset.z, 0);
  }
});

test('triggerShatterImpulse and stepGlassPhysics make 3D pieces drift apart and tumble', () => {
  const { vertices, rawFaces } = createSampleGeometry();
  const sys = createGlassPhysicsSystem(vertices, rawFaces);

  triggerShatterImpulse(sys, 0.2, -0.1);
  assert.equal(sys.phase, 'drifting');
  assert.equal(sys.splinters.length, 84);

  // Measure initial average offset right at impulse
  const initialAvgDist =
    sys.pieces.reduce((acc, p) => acc + Math.hypot(p.offset.x, p.offset.y, p.offset.z), 0) /
    sys.pieces.length;

  // Step 0.5 seconds of particle physics drift
  for (let i = 0; i < 25; i++) {
    stepGlassPhysics(sys, 0.02);
  }

  const midDriftAvgDist =
    sys.pieces.reduce((acc, p) => acc + Math.hypot(p.offset.x, p.offset.y, p.offset.z), 0) /
    sys.pieces.length;

  // Step another 1.0 second of drift to confirm pieces continue drifting away
  for (let i = 0; i < 50; i++) {
    stepGlassPhysics(sys, 0.02);
  }

  const lateDriftAvgDist =
    sys.pieces.reduce((acc, p) => acc + Math.hypot(p.offset.x, p.offset.y, p.offset.z), 0) /
    sys.pieces.length;

  assert.ok(
    midDriftAvgDist > initialAvgDist * 4,
    `Expected midDriftAvgDist (${midDriftAvgDist}) > initialAvgDist * 4 (${initialAvgDist * 4})`
  );
  assert.ok(
    lateDriftAvgDist > midDriftAvgDist,
    `Expected pieces to keep drifting apart: late (${lateDriftAvgDist}) > mid (${midDriftAvgDist})`
  );

  // Verify 3D tumbling rotations are non-zero and distinct across pieces
  const rotNorm0 = Math.hypot(
    sys.pieces[0].rotation.x,
    sys.pieces[0].rotation.y,
    sys.pieces[0].rotation.z
  );
  const rotNorm1 = Math.hypot(
    sys.pieces[1].rotation.x,
    sys.pieces[1].rotation.y,
    sys.pieces[1].rotation.z
  );
  assert.ok(rotNorm0 > 0.2);
  assert.notEqual(rotNorm0, rotNorm1);
});

test('startRecoveryPhase smoothly pulls drifted pieces back to intact state', () => {
  const { vertices, rawFaces } = createSampleGeometry();
  const sys = createGlassPhysicsSystem(vertices, rawFaces);

  triggerShatterImpulse(sys, 0, 0);
  for (let i = 0; i < 30; i++) {
    stepGlassPhysics(sys, 0.02);
  }
  assert.ok(sys.dispersionMetric > 0.3);

  startRecoveryPhase(sys);
  assert.equal(sys.phase, 'recovering');

  for (let i = 0; i < 70; i++) {
    stepGlassPhysics(sys, 0.02);
  }

  assert.equal(sys.phase, 'intact');
  assert.equal(sys.dispersionMetric, 0);
  for (const p of sys.pieces) {
    assert.equal(p.offset.x, 0);
    assert.equal(p.offset.y, 0);
    assert.equal(p.offset.z, 0);
  }
});
