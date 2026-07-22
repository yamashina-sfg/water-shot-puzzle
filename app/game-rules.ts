import type { Stage } from "./game-data";

export type GameState = "playing" | "settling" | "cleared" | "failed";
export type GoalPoint = { x: number; y: number };
export type GoalMotion = GoalPoint & { vx: number; vy: number; hasEnteredGoal: boolean };
export type PhysicsStatus = { firing: boolean; inGoalArea: number; approachingGoal: number };
export type StarInput = { initialWater: number; remainingWater: number; finalGoalWater: number; shotCount: number };

export function getGoalZones(goal: Stage["goal"]) {
  return {
    entrance: { left: goal.x - 2, right: goal.x + 50, top: goal.y + 8, bottom: goal.y + 24 },
    // The black opening ends around y + 29. Requiring the particle center to
    // reach y + 34 keeps the whole stretched drop below the visible rim.
    internal: { left: goal.x + 12, right: goal.x + 36, top: goal.y + 34, bottom: goal.y + 49 },
    disposal: { left: goal.x + 10, right: goal.x + 38, top: goal.y + 48, bottom: goal.y + 64 },
  };
}

export function isPointInside(point: GoalPoint, area: { left: number; right: number; top: number; bottom: number }) {
  return point.x > area.left && point.x < area.right && point.y > area.top && point.y < area.bottom;
}

export function isApproachingGoal(particle: GoalMotion, goal: Stage["goal"]) {
  if (particle.hasEnteredGoal || particle.vy <= 0) return particle.hasEnteredGoal;
  const zones = getGoalZones(goal);
  return particle.x > goal.x - 35 && particle.x < goal.x + 55 && particle.y > goal.y - 75 && particle.y < zones.disposal.bottom;
}

export function shouldCountGoalParticle(particle: Pick<GoalMotion, "x" | "y" | "hasEnteredGoal">, goal: Stage["goal"]) {
  return !particle.hasEnteredGoal && isPointInside(particle, getGoalZones(goal).internal);
}

export function checkClearEligibility(input: { gameState: GameState; goalWater: number; requiredWater: number; physics: PhysicsStatus; now: number; lastGoalCountChangedAt: number; settleMs: number }) {
  return input.gameState === "settling" && input.goalWater >= input.requiredWater && !input.physics.firing && input.physics.inGoalArea === 0 && input.physics.approachingGoal === 0 && input.lastGoalCountChangedAt > 0 && input.now - input.lastGoalCountChangedAt >= input.settleMs;
}

export function calculateStars(stage: Stage, input: StarInput) {
  if (input.finalGoalWater < stage.goal.required) return 0;
  const usedWater = input.initialWater - input.remainingWater;
  const star3WaterLimit = stage.star3WaterLimit ?? 25;
  const star2WaterLimit = stage.star2WaterLimit ?? 45;
  const star3ShotLimit = stage.star3ShotLimit ?? 2;
  const star2ShotLimit = stage.star2ShotLimit ?? 3;
  if (usedWater <= star3WaterLimit && input.shotCount <= star3ShotLimit) return 3;
  if (usedWater <= star2WaterLimit && input.shotCount <= star2ShotLimit) return 2;
  return 1;
}
