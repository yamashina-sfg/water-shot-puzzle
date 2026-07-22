import assert from "node:assert/strict";
import test from "node:test";
import { STAGES, WORLD, type Stage } from "../app/game-data.ts";
import { getGoalZones, isPointInside } from "../app/game-rules.ts";

test("campaign contains 30 ordered, valid and distinct stages", () => {
  assert.equal(STAGES.length, 30);
  assert.deepEqual(STAGES.map(stage => stage.id), Array.from({ length: 30 }, (_, index) => index + 1));
  assert.equal(new Set(STAGES.map(stage => `${stage.gun.x}:${stage.gun.y}:${stage.goal.x}:${stage.goal.y}:${stage.obstacles.map(o => `${o.x},${o.y},${o.kind ?? "wall"}`).join("|")}`)).size, 30);
  for (const stage of STAGES) {
    assert.ok(stage.name && stage.hint);
    assert.ok(stage.water >= stage.goal.required && stage.goal.required > 0);
    assert.ok(stage.gun.x >= 0 && stage.gun.x <= WORLD.width && stage.gun.y >= 0 && stage.gun.y <= WORLD.height);
    assert.ok(stage.goal.x >= 0 && stage.goal.x <= WORLD.width - 40 && stage.goal.y >= 0 && stage.goal.y <= WORLD.groundY);
  }
});

test("campaign introduces each requested mechanic before the finale", () => {
  assert.ok(STAGES.slice(10, 15).some(stage => stage.obstacles.some(obstacle => obstacle.kind === "slopeUp" || obstacle.kind === "slopeDown")));
  assert.ok(STAGES.slice(10, 15).some(stage => stage.obstacles.some(obstacle => obstacle.kind === "bounce")));
  assert.ok(STAGES.slice(15, 20).every(stage => stage.goal.move || stage.obstacles.some(obstacle => obstacle.move)));
  assert.ok(STAGES.slice(20, 25).every(stage => stage.water <= 42));
  assert.ok(STAGES.slice(25).every(stage => stage.difficulty >= 6));
});

function hasDirectSolution(stage: Stage) {
  const delays = [0, .6, 1.2, 1.8, 2.4, 3];
  for (const delay of delays) for (let angle = 8; angle <= 82; angle += 2) for (let power = 10; power <= 100; power += 5) {
    const rad = angle * Math.PI / 180; const speed = 265 + power * 2.7;
    const p = { x: stage.gun.x + Math.cos(rad) * 43, y: stage.gun.y - Math.sin(rad) * 43, vx: Math.cos(rad) * speed, vy: -Math.sin(rad) * speed };
    for (let elapsed = 0; elapsed < 6; elapsed += .016) {
      const clock = delay + elapsed;
      const goal = { ...stage.goal, x: stage.goal.x + (stage.goal.move?.axis === "x" ? Math.sin(clock * stage.goal.move.speed + (stage.goal.move.phase ?? 0)) * stage.goal.move.distance : 0), y: stage.goal.y + (stage.goal.move?.axis === "y" ? Math.sin(clock * stage.goal.move.speed + (stage.goal.move.phase ?? 0)) * stage.goal.move.distance : 0) };
      p.vy += stage.gravity * .016; p.x += p.vx * .016; p.y += p.vy * .016;
      if (isPointInside(p, getGoalZones(goal).internal)) return true;
      let dead = false;
      for (let index = 0; index < stage.obstacles.length; index++) {
        const base = stage.obstacles[index]; const phase = base.move?.phase ?? index;
        const o = { ...base, x: base.x + (base.move?.axis === "x" ? Math.sin(clock * base.move.speed + phase) * base.move.distance : 0), y: base.y + (base.move?.axis === "y" ? Math.sin(clock * base.move.speed + phase) * base.move.distance : 0) };
        if (p.x <= o.x || p.x >= o.x + o.w || p.y <= o.y || p.y >= o.y + o.h) continue;
        if (o.kind === "slopeUp" || o.kind === "slopeDown") {
          const t = (p.x - o.x) / o.w; const surfaceY = o.kind === "slopeUp" ? o.y + o.h * (1 - t) : o.y + o.h * t;
          if (p.y < surfaceY - 8 || p.y > surfaceY + 12 || p.vy < 0) continue;
          const tx0 = o.w; const ty0 = o.kind === "slopeUp" ? -o.h : o.h; const length = Math.hypot(tx0, ty0); const tx = tx0 / length; const ty = ty0 / length;
          const along = Math.max(75, p.vx * tx + p.vy * ty); p.x += tx * 4; p.y = surfaceY - 4; p.vx = tx * along * .94; p.vy = ty * along * .94;
        } else if (o.kind === "bounce") {
          const fromSide = Math.min(Math.abs(p.x-o.x),Math.abs(p.x-o.x-o.w)) < Math.min(Math.abs(p.y-o.y),Math.abs(p.y-o.y-o.h));
          if (fromSide) { p.vx *= -.72; p.x += Math.sign(p.vx)*5; } else { p.vy=-Math.abs(p.vy)*.32; p.vx=Math.max(80,p.vx*.9); p.y=o.y-4; }
        } else dead = true;
        break;
      }
      if (dead || p.y >= WORLD.groundY || p.x < -10 || p.x > WORLD.width + 10) break;
    }
  }
  return false;
}

test("every stage has at least one deterministic angle, power and timing solution", () => {
  const unsolved = STAGES.filter(stage => !hasDirectSolution(stage)).map(stage => stage.id);
  assert.deepEqual(unsolved, []);
});
