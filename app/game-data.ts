export type Obstacle = { x: number; y: number; w: number; h: number; kind?: "wall" | "bounce" | "absorb"; move?: { axis: "x" | "y"; distance: number; speed: number } };
export type Stage = { id: number; name: string; hint: string; gravity: number; gun: { x: number; y: number; angle: number }; goal: { x: number; y: number; required: number }; water: number; obstacles: Obstacle[] };

export const WORLD = { width: 390, height: 620, groundY: 548, maxParticles: 90, particleLife: 5000, shotCount: 20 } as const;

export const STAGES: Stage[] = [
  { id: 1, name: "はじめの一滴", hint: "45°前後で、ほどよく溜めよう", gravity: 310, gun: { x: 52, y: 490, angle: 45 }, goal: { x: 323, y: 457, required: 12 }, water: 60, obstacles: [] },
  { id: 2, name: "高台のパイプ", hint: "いつもより高い角度がコツ", gravity: 310, gun: { x: 52, y: 490, angle: 55 }, goal: { x: 318, y: 385, required: 12 }, water: 60, obstacles: [{ x: 294, y: 435, w: 82, h: 113 }] },
  { id: 3, name: "遠くへ届け", hint: "しっかり長押しして遠くへ", gravity: 310, gun: { x: 42, y: 490, angle: 38 }, goal: { x: 335, y: 456, required: 12 }, water: 60, obstacles: [] },
  { id: 4, name: "小さな壁", hint: "壁の少し上を狙おう", gravity: 310, gun: { x: 52, y: 490, angle: 48 }, goal: { x: 323, y: 456, required: 12 }, water: 60, obstacles: [{ x: 178, y: 455, w: 25, h: 93 }] },
  { id: 5, name: "大きな壁", hint: "高角度と強い水圧が必要", gravity: 300, gun: { x: 48, y: 490, angle: 63 }, goal: { x: 330, y: 456, required: 12 }, water: 70, obstacles: [{ x: 190, y: 365, w: 29, h: 183 }] },
  { id: 6, name: "低い天井", hint: "低い角度で天井の下を通そう", gravity: 280, gun: { x: 45, y: 490, angle: 28 }, goal: { x: 330, y: 456, required: 12 }, water: 60, obstacles: [{ x: 100, y: 320, w: 210, h: 28 }] },
  { id: 7, name: "谷底へ", hint: "低く、やさしく狙おう", gravity: 320, gun: { x: 52, y: 395, angle: 22 }, goal: { x: 325, y: 490, required: 12 }, water: 60, obstacles: [{ x: 20, y: 450, w: 100, h: 98 }] },
  { id: 8, name: "すきま通し", hint: "2つの壁の間を抜けよう", gravity: 290, gun: { x: 48, y: 490, angle: 42 }, goal: { x: 330, y: 456, required: 12 }, water: 70, obstacles: [{ x: 176, y: 310, w: 25, h: 112 }, { x: 176, y: 484, w: 25, h: 64 }] },
  { id: 9, name: "動くゲート", hint: "ゲートが上がった瞬間に発射", gravity: 300, gun: { x: 48, y: 490, angle: 42 }, goal: { x: 330, y: 456, required: 12 }, water: 70, obstacles: [{ x: 190, y: 425, w: 25, h: 123, move: { axis: "y", distance: 120, speed: 1.4 } }] },
  { id: 10, name: "ウォーター・マスター", hint: "壁と段差をまとめて攻略！", gravity: 300, gun: { x: 45, y: 490, angle: 57 }, goal: { x: 330, y: 365, required: 15 }, water: 80, obstacles: [{ x: 155, y: 445, w: 24, h: 103 }, { x: 245, y: 405, w: 24, h: 143 }, { x: 275, y: 447, w: 100, h: 101 }] },
];

export type SaveData = { unlocked: number; stars: Record<number, number>; sound: boolean; vibration: boolean; guide: boolean };
export const DEFAULT_SAVE: SaveData = { unlocked: 1, stars: {}, sound: true, vibration: true, guide: true };
