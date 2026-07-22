"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_SAVE, SaveData, Stage, STAGES, WORLD } from "./game-data";

type Screen = "title" | "stages" | "game";
type Particle = { active: boolean; x: number; y: number; vx: number; vy: number; born: number; counted: boolean };
type Result = { status: "clear" | "failed"; stars: number } | null;

const loadSave = (): SaveData => { try { return { ...DEFAULT_SAVE, ...JSON.parse(localStorage.getItem("water-shot-save") ?? "{}") }; } catch { return DEFAULT_SAVE; } };

function GameCanvas({ stage, angle, power, guide, firingKey, onGoal, onSpent, resetKey }: { stage: Stage; angle: number; power: number; guide: boolean; firingKey: number; onGoal: () => void; onSpent: (count: number) => void; resetKey: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>(Array.from({ length: WORLD.maxParticles }, () => ({ active: false, x: 0, y: 0, vx: 0, vy: 0, born: 0, counted: false })));
  const shots = useRef<{ remaining: number; nextAt: number; power: number } | null>(null);
  const angleRef = useRef(angle);
  const stageRef = useRef(stage);

  useEffect(() => { angleRef.current = angle; }, [angle]);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  useEffect(() => { particles.current.forEach(p => p.active = false); shots.current = null; }, [stage, resetKey]);
  useEffect(() => { if (firingKey > 0) shots.current = { remaining: WORLD.shotCount, nextAt: performance.now(), power }; }, [firingKey, power]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let frame = 0; let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032); last = now; const s = stageRef.current;
      if (shots.current && shots.current.remaining > 0 && now >= shots.current.nextAt) {
        const p = particles.current.find(item => !item.active);
        if (p) { const rad = angleRef.current * Math.PI / 180; const speed = 265 + shots.current.power * 2.7; p.active = true; p.x = s.gun.x + Math.cos(rad) * 43; p.y = s.gun.y - Math.sin(rad) * 43; p.vx = Math.cos(rad) * speed * (0.98 + Math.random() * .04); p.vy = -Math.sin(rad) * speed + (Math.random() - .5) * 12; p.born = now; p.counted = false; }
        shots.current.remaining--; shots.current.nextAt = now + 34; onSpent(1);
      }
      const moving = s.obstacles.map((o, i) => ({ ...o, x: o.x + (o.move?.axis === "x" ? Math.sin(now * .001 * o.move.speed + i) * o.move.distance : 0), y: o.y + (o.move?.axis === "y" ? Math.sin(now * .001 * o.move.speed + i) * o.move.distance : 0) }));
      particles.current.forEach(p => { if (!p.active) return; p.vy += s.gravity * dt; p.x += p.vx * dt; p.y += p.vy * dt; const inGoal = p.x > s.goal.x && p.x < s.goal.x + 48 && p.y > s.goal.y && p.y < s.goal.y + 45; if (inGoal && !p.counted) { p.counted = true; p.active = false; onGoal(); return; } const hit = moving.some(o => p.x > o.x && p.x < o.x + o.w && p.y > o.y && p.y < o.y + o.h); if (hit || p.y >= WORLD.groundY || p.x < -10 || p.x > WORLD.width + 10 || p.y < -20 || now - p.born > WORLD.particleLife) p.active = false; });
      const sky = ctx.createLinearGradient(0, 0, 0, WORLD.height); sky.addColorStop(0, "#64cff7"); sky.addColorStop(.72, "#dff7ff"); ctx.fillStyle = sky; ctx.fillRect(0, 0, WORLD.width, WORLD.height);
      ctx.fillStyle = "rgba(255,255,255,.82)"; [[38,95,34],[290,145,28],[130,235,24]].forEach(([x,y,r]) => { ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.arc(x+r,y+6,r*.75,0,Math.PI*2); ctx.fill(); });
      ctx.fillStyle = "#77c94b"; ctx.fillRect(0, WORLD.groundY - 7, WORLD.width, 12); ctx.fillStyle = "#9b6538"; ctx.fillRect(0, WORLD.groundY + 5, WORLD.width, 80);
      moving.forEach(o => { ctx.fillStyle = o.kind === "bounce" ? "#ffcc45" : "#7b5261"; ctx.fillRect(o.x, o.y, o.w, o.h); ctx.fillStyle = "#a97b85"; ctx.fillRect(o.x + 4, o.y + 4, Math.max(0,o.w - 8), 6); });
      const g = s.goal; ctx.fillStyle = "#8a9ba9"; ctx.fillRect(g.x - 8, g.y + 13, 64, 44); ctx.fillStyle = "#d8e3e8"; ctx.fillRect(g.x - 4, g.y + 17, 56, 36); ctx.fillStyle = "#14242c"; ctx.beginPath(); ctx.ellipse(g.x + 24, g.y + 17, 28, 12, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "800 13px sans-serif"; ctx.textAlign = "center"; ctx.fillText("GOAL", g.x + 24, g.y - 7);
      if (guide) { const rad = angleRef.current * Math.PI/180; const v = 265 + power*2.7; ctx.fillStyle = "rgba(255,255,255,.75)"; for(let t=.12;t<.9;t+=.12){ const x=s.gun.x+Math.cos(rad)*43+Math.cos(rad)*v*t; const y=s.gun.y-Math.sin(rad)*43-Math.sin(rad)*v*t+.5*s.gravity*t*t; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill(); } }
      ctx.save(); ctx.translate(s.gun.x,s.gun.y); ctx.rotate(-angleRef.current*Math.PI/180); ctx.fillStyle="#ffcf35"; ctx.fillRect(-20,-14,58,28); ctx.fillStyle="#4d75de"; ctx.fillRect(23,-8,35,16); ctx.fillStyle="#e85068"; ctx.fillRect(-17,12,22,30); ctx.restore(); ctx.fillStyle="#29465b"; ctx.beginPath(); ctx.arc(s.gun.x,s.gun.y,13,0,Math.PI*2); ctx.fill();
      particles.current.forEach(p => { if(!p.active)return; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(Math.atan2(p.vy,p.vx)); ctx.fillStyle="#23b9f2"; ctx.beginPath(); ctx.ellipse(0,0,8,3.2,0,0,Math.PI*2); ctx.fill(); ctx.restore(); });
      frame = requestAnimationFrame(loop);
    }; frame = requestAnimationFrame(loop); return () => cancelAnimationFrame(frame);
  }, [guide, onGoal, onSpent, power]);
  return <canvas ref={canvasRef} width={WORLD.width} height={WORLD.height} aria-label="水鉄砲パズルのプレイ画面" />;
}

export function WaterShotGame() {
  const [screen,setScreen]=useState<Screen>("title"); const [save,setSave]=useState<SaveData>(DEFAULT_SAVE); const [stageIndex,setStageIndex]=useState(0); const [angle,setAngle]=useState(45); const [power,setPower]=useState(0); const [water,setWater]=useState(60); const [goal,setGoal]=useState(0); const [firingKey,setFiringKey]=useState(0); const [resetKey,setResetKey]=useState(0); const [charging,setCharging]=useState(false); const [result,setResult]=useState<Result>(null); const chargeStart=useRef(0); const dragStart=useRef<{y:number;angle:number}|null>(null); const stage=STAGES[stageIndex];
  useEffect(()=>{ setSave(loadSave()); },[]); // eslint-disable-line react-hooks/set-state-in-effect
  useEffect(()=>{ if(typeof localStorage!=="undefined")localStorage.setItem("water-shot-save",JSON.stringify(save)); },[save]);
  const startStage=useCallback((index:number)=>{ const s=STAGES[index]; setStageIndex(index); setAngle(s.gun.angle); setWater(s.water); setGoal(0); setPower(0); setCharging(false); setFiringKey(0); setResult(null); setResetKey(k=>k+1); setScreen("game"); },[]);
  const onGoal=useCallback(()=>setGoal(v=>{ const next=v+1; if(next>=stage.goal.required){ const used=stage.water-water; const stars=used<=25?3:used<=45?2:1; setResult({status:"clear",stars}); setSave(prev=>({...prev,unlocked:Math.max(prev.unlocked,Math.min(10,stage.id+1)),stars:{...prev.stars,[stage.id]:Math.max(prev.stars[stage.id]??0,stars)}})); } return next; }),[stage,water]);
  const onSpent=useCallback((count:number)=>setWater(v=>Math.max(0,v-count)),[]);
  useEffect(()=>{ if(water===0&&!result){ const t=setTimeout(()=>{ if(goal<stage.goal.required)setResult({status:"failed",stars:0}); },5200); return()=>clearTimeout(t); } },[water,goal,result,stage.goal.required]);
  useEffect(()=>{ if(!charging)return; let f=0; const tick=()=>{setPower(Math.min(100,(performance.now()-chargeStart.current)/12)); f=requestAnimationFrame(tick)}; f=requestAnimationFrame(tick); return()=>cancelAnimationFrame(f);},[charging]);
  const beginCharge=()=>{if(water<=0||result)return;chargeStart.current=performance.now();setPower(0);setCharging(true)}; const fire=()=>{if(!charging)return;setCharging(false);setFiringKey(k=>k+1);if(save.vibration&&navigator.vibrate)navigator.vibrate(25)};
  const stars=(n:number)=>"★".repeat(n)+"☆".repeat(3-n);
  return <main className="app-shell">
    <div className="rotate-message"><span>↻</span><h1>縦画面でプレイしてください</h1><p>端末を縦向きに戻すとゲームを始められます。</p></div>
    <section className="phone-frame">
      {screen==="title"&&<div className="title-screen"><div className="cloud c1"/><div className="cloud c2"/><div className="title-mark"><span>WATER</span><strong>SHOT</strong><em>PUZZLE</em></div><div className="hero-gun">🔫<i>💦</i></div><p>ねらって、ためて、放て！</p><button className="primary big" onClick={()=>startStage(Math.min(save.unlocked-1,9))}>PLAY <span>▶</span></button><button className="secondary" onClick={()=>setScreen("stages")}>STAGE SELECT</button><button className="settings" onClick={()=>setSave(s=>({...s,guide:!s.guide}))}>軌道ガイド {save.guide?"ON":"OFF"}</button></div>}
      {screen==="stages"&&<div className="stage-screen"><header><button onClick={()=>setScreen("title")}>‹</button><div><small>SELECT</small><h1>ステージを選ぶ</h1></div><span>{Object.values(save.stars).reduce((a,b)=>a+b,0)} ★</span></header><div className="stage-grid">{STAGES.map((s,i)=>{const open=i<save.unlocked;return <button key={s.id} disabled={!open} onClick={()=>startStage(i)} className={open?"":"locked"}><b>{open?s.id:"🔒"}</b><span>{save.stars[s.id]?stars(save.stars[s.id]):"☆☆☆"}</span><small>{s.name}</small></button>})}</div></div>}
      {screen==="game"&&<div className="game-screen" onPointerMove={e=>{if(dragStart.current){const next=dragStart.current.angle+(dragStart.current.y-e.clientY)*.22;setAngle(Math.max(5,Math.min(85,next)))}}} onPointerUp={()=>dragStart.current=null}>
        <div className="hud"><button onClick={()=>setScreen("stages")}>‹</button><div><small>STAGE {stage.id}</small><strong>{stage.name}</strong></div><div className="water"><span>💧</span><b>{water}</b><small>WATER</small></div><button onClick={()=>startStage(stageIndex)}>↻</button></div>
        <div className="canvas-wrap" onPointerDown={e=>{if(e.clientY<innerHeight*.72)dragStart.current={y:e.clientY,angle}}}><GameCanvas stage={stage} angle={angle} power={power} guide={save.guide} firingKey={firingKey} onGoal={onGoal} onSpent={onSpent} resetKey={resetKey}/><div className="goal-count"><span>ゴール水量</span><b>{Math.min(goal,stage.goal.required)} / {stage.goal.required}</b></div><div className="angle-bubble">{Math.round(angle)}°</div><div className="hint">💡 {stage.hint}</div></div>
        <div className="controls"><div className="angle-row"><label>ANGLE <b>{Math.round(angle)}°</b></label><input aria-label="発射角度" type="range" min="5" max="85" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></div><div className="power-area"><div className="power-copy"><span>POWER</span><b>{power<34?"弱":power<68?"中":"強"}</b></div><div className="power-track"><i style={{width:`${power}%`}}/></div><button className={charging?"fire charging":"fire"} onPointerDown={beginCharge} onPointerUp={fire} onPointerCancel={fire}><b>{charging?"RELEASE!":"HOLD"}</b><span>{charging?"離して発射！":"長押しでためる"}</span></button></div></div>
        {result&&<div className="modal-backdrop"><div className="result-card"><small>{result.status==="clear"?"STAGE COMPLETE":"TRY AGAIN"}</small><h2>{result.status==="clear"?"CLEAR!":"水が足りない！"}</h2><div className="result-stars">{result.status==="clear"?stars(result.stars):"💧"}</div><p>{result.status==="clear"?`${stage.name} クリア！`:stage.hint}</p>{result.status==="clear"&&stage.id<10&&<button className="primary" onClick={()=>startStage(stageIndex+1)}>次のステージ ▶</button>}<button className="secondary" onClick={()=>startStage(stageIndex)}>↻ リトライ</button><button className="text-button" onClick={()=>setScreen("stages")}>ステージ選択へ</button></div></div>}
      </div>}
    </section>
  </main>;
}
