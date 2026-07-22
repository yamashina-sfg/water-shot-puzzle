import assert from "node:assert/strict";
import test from "node:test";
import { calculateStars, checkClearEligibility, getGoalZones, isApproachingGoal, isPointInside, shouldCountGoalParticle } from "../app/game-rules.ts";
import { STAGES } from "../app/game-data.ts";

const stage = STAGES[0];
const zones = getGoalZones(stage.goal);

test("touching the rim is not inside the internal goal zone", () => {
  assert.equal(isPointInside({ x: stage.goal.x + 24, y: stage.goal.y + 16 }, zones.internal), false);
  assert.equal(isPointInside({ x: stage.goal.x + 24, y: stage.goal.y + 30 }, zones.internal), false);
  assert.equal(isPointInside({ x: stage.goal.x + 24, y: stage.goal.y + 39 }, zones.internal), true);
});

test("the same particle can only be counted once", () => {
  const particle = { x: stage.goal.x + 24, y: stage.goal.y + 39, hasEnteredGoal: false };
  assert.equal(shouldCountGoalParticle(particle, stage.goal), true);
  particle.hasEnteredGoal = true;
  assert.equal(shouldCountGoalParticle(particle, stage.goal), false);
});

test("a falling particle near the opening blocks clear settlement", () => {
  assert.equal(isApproachingGoal({ x: stage.goal.x + 20, y: stage.goal.y - 10, vx: 20, vy: 40, hasEnteredGoal: false }, stage.goal), true);
  assert.equal(isApproachingGoal({ x: stage.goal.x + 20, y: stage.goal.y - 10, vx: 20, vy: -40, hasEnteredGoal: false }, stage.goal), false);
});

test("clear requires final count, idle physics, and 1200ms stability", () => {
  const base = { gameState: "settling" as const, goalWater: 12, requiredWater: 12, physics: { firing: false, inGoalArea: 0, approachingGoal: 0 }, lastGoalCountChangedAt: 1000, settleMs: 1200 };
  assert.equal(checkClearEligibility({ ...base, now: 2199 }), false);
  assert.equal(checkClearEligibility({ ...base, now: 2200 }), true);
  assert.equal(checkClearEligibility({ ...base, now: 2300, physics: { ...base.physics, firing: true } }), false);
  assert.equal(checkClearEligibility({ ...base, now: 2300, physics: { ...base.physics, inGoalArea: 1 } }), false);
  assert.equal(checkClearEligibility({ ...base, now: 2300, physics: { ...base.physics, approachingGoal: 1 } }), false);
});

test("stars use final values and are never awarded below required water", () => {
  assert.equal(calculateStars(stage, { initialWater: 60, remainingWater: 40, finalGoalWater: 11, shotCount: 1 }), 0);
  assert.equal(calculateStars(stage, { initialWater: 60, remainingWater: 40, finalGoalWater: 12, shotCount: 1 }), 3);
  assert.equal(calculateStars(stage, { initialWater: 60, remainingWater: 20, finalGoalWater: 15, shotCount: 2 }), 2);
  assert.equal(calculateStars(stage, { initialWater: 60, remainingWater: 0, finalGoalWater: 18, shotCount: 4 }), 1);
});
