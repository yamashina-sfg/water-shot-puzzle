export type Motion = { axis: "x" | "y"; distance: number; speed: number; phase?: number };
export type Obstacle = {
  x: number; y: number; w: number; h: number;
  kind?: "wall" | "bounce" | "absorb" | "slopeUp" | "slopeDown";
  move?: Motion;
};
export type Stage = {
  id: number; name: string; hint: string; difficulty: number; gravity: number;
  gun: { x: number; y: number; angle: number };
  goal: { x: number; y: number; required: number; size?: number; move?: Motion };
  water: number; star3WaterLimit?: number; star2WaterLimit?: number;
  star3ShotLimit?: number; star2ShotLimit?: number; obstacles: Obstacle[];
};

export const WORLD = { width: 390, height: 620, groundY: 548, maxParticles: 90, particleLife: 6200, shotCount: 20, clearSettleMs: 1200 } as const;

const stage = (config: Stage) => config;

export const STAGES: Stage[] = [
  stage({ id:1,name:"はじめの一滴",hint:"45°前後で、軽くためよう",difficulty:1,gravity:300,gun:{x:58,y:486,angle:42},goal:{x:276,y:458,required:8,size:1.18},water:50,star3WaterLimit:20,star2WaterLimit:35,obstacles:[] }),
  stage({ id:2,name:"もう少し遠くへ",hint:"少し上向きにして距離を伸ばそう",difficulty:1,gravity:305,gun:{x:48,y:488,angle:48},goal:{x:326,y:452,required:10,size:1.12},water:55,obstacles:[] }),
  stage({ id:3,name:"重力のしずく",hint:"低めに撃ち、落下を利用しよう",difficulty:1,gravity:330,gun:{x:48,y:395,angle:24},goal:{x:314,y:490,required:10,size:1.12},water:55,obstacles:[] }),
  stage({ id:4,name:"空のカップ",hint:"強めにためて高いゴールへ",difficulty:1,gravity:285,gun:{x:50,y:493,angle:60},goal:{x:306,y:356,required:10,size:1.12},water:60,obstacles:[{x:282,y:407,w:82,h:141}] }),
  stage({ id:5,name:"はじめての壁",hint:"小さな壁の少し上を狙おう",difficulty:1,gravity:305,gun:{x:50,y:490,angle:48},goal:{x:323,y:456,required:10},water:60,obstacles:[{x:174,y:473,w:24,h:75}] }),

  stage({ id:6,name:"低いブロック",hint:"低い壁を山なりに越えよう",difficulty:2,gravity:310,gun:{x:48,y:490,angle:44},goal:{x:326,y:456,required:11},water:60,obstacles:[{x:174,y:458,w:30,h:90}] }),
  stage({ id:7,name:"そびえる壁",hint:"高い角度と強い水圧が必要",difficulty:2,gravity:290,gun:{x:45,y:490,angle:63},goal:{x:328,y:456,required:11},water:65,obstacles:[{x:182,y:352,w:30,h:196}] }),
  stage({ id:8,name:"天井すれすれ",hint:"角度を下げて天井の下へ",difficulty:2,gravity:275,gun:{x:45,y:486,angle:25},goal:{x:326,y:456,required:11},water:60,obstacles:[{x:95,y:330,w:225,h:32}] }),
  stage({ id:9,name:"細い水路",hint:"上下の壁の中央を通そう",difficulty:2,gravity:250,gun:{x:45,y:454,angle:13},goal:{x:326,y:456,required:11},water:65,obstacles:[{x:145,y:315,w:34,h:105},{x:145,y:492,w:34,h:56}] }),
  stage({ id:10,name:"壁の向こうの谷",hint:"壁を越えたら、落下する角度を作ろう",difficulty:2,gravity:330,gun:{x:45,y:404,angle:49},goal:{x:326,y:492,required:12},water:65,obstacles:[{x:172,y:419,w:28,h:129}] }),

  stage({ id:11,name:"すべり台",hint:"黄色い斜面へ落として滑らせよう",difficulty:3,gravity:320,gun:{x:45,y:390,angle:30},goal:{x:318,y:486,required:12,size:1.08},water:65,obstacles:[{x:166,y:431,w:125,h:78,kind:"slopeDown"}] }),
  stage({ id:12,name:"地面を流れて",hint:"手前の黄色い床へ水を落とそう",difficulty:3,gravity:335,gun:{x:45,y:360,angle:18},goal:{x:316,y:487,required:12,size:1.1},water:65,obstacles:[{x:98,y:500,w:194,h:18,kind:"bounce"}] }),
  stage({ id:13,name:"ワンバウンド",hint:"黄色い壁に一度当てて向きを変えよう",difficulty:3,gravity:285,gun:{x:54,y:486,angle:68},goal:{x:283,y:456,required:11,size:1.12},water:70,obstacles:[{x:210,y:300,w:22,h:155,kind:"bounce"}] }),
  stage({ id:14,name:"ダブルスロープ",hint:"2枚の斜面をつなぐ軌道を探そう",difficulty:3,gravity:320,gun:{x:43,y:398,angle:28},goal:{x:322,y:486,required:12},water:70,obstacles:[{x:118,y:430,w:95,h:62,kind:"slopeDown"},{x:220,y:447,w:77,h:55,kind:"slopeDown"}] }),
  stage({ id:15,name:"曲がり道",hint:"直接は届かない。黄色い地形を使おう",difficulty:3,gravity:305,gun:{x:45,y:410,angle:28},goal:{x:306,y:420,required:12,size:1.08},water:70,obstacles:[{x:282,y:471,w:94,h:77},{x:155,y:380,w:127,h:91,kind:"slopeDown"}] }),

  stage({ id:16,name:"上下リフト",hint:"壁が下がった瞬間を狙おう",difficulty:4,gravity:300,gun:{x:46,y:486,angle:43},goal:{x:326,y:456,required:12},water:65,obstacles:[{x:184,y:402,w:28,h:146,move:{axis:"y",distance:82,speed:.75}}] }),
  stage({ id:17,name:"横切るブロック",hint:"障害物が離れたタイミングで発射",difficulty:4,gravity:295,gun:{x:46,y:485,angle:45},goal:{x:326,y:445,required:12},water:65,obstacles:[{x:175,y:395,w:54,h:54,move:{axis:"x",distance:80,speed:.8}}] }),
  stage({ id:18,name:"開閉ゲート",hint:"ゲートが開く周期を見よう",difficulty:4,gravity:270,gun:{x:45,y:465,angle:24},goal:{x:326,y:458,required:12},water:70,obstacles:[{x:180,y:360,w:24,h:118,move:{axis:"y",distance:105,speed:1.05,phase:1.4}}] }),
  stage({ id:19,name:"動くゴール",hint:"ゴールの進行方向を先読みしよう",difficulty:4,gravity:300,gun:{x:47,y:486,angle:48},goal:{x:302,y:430,required:12,size:1.15,move:{axis:"y",distance:48,speed:.55}},water:70,obstacles:[] }),
  stage({ id:20,name:"タイミング迷路",hint:"固定壁を越え、動く壁の隙を通そう",difficulty:4,gravity:295,gun:{x:43,y:486,angle:55},goal:{x:326,y:428,required:13},water:75,obstacles:[{x:128,y:445,w:24,h:103},{x:224,y:360,w:26,h:138,move:{axis:"y",distance:70,speed:.7}}] }),

  stage({ id:21,name:"一発を大切に",hint:"水量は少ない。軌道を見てから撃とう",difficulty:5,gravity:300,gun:{x:48,y:486,angle:43},goal:{x:326,y:456,required:12,size:1.12},water:28,star3WaterLimit:20,star2WaterLimit:28,star3ShotLimit:1,star2ShotLimit:2,obstacles:[{x:180,y:475,w:25,h:73}] }),
  stage({ id:22,name:"小さなターゲット",hint:"ガイドの先端を穴の中心へ合わせよう",difficulty:5,gravity:300,gun:{x:46,y:484,angle:47},goal:{x:326,y:452,required:11,size:.76},water:40,obstacles:[] }),
  stage({ id:23,name:"細口パイプ",hint:"強すぎない細い軌道で入口へ",difficulty:5,gravity:290,gun:{x:46,y:480,angle:42},goal:{x:321,y:449,required:11,size:.68},water:42,obstacles:[{x:293,y:430,w:20,h:118},{x:356,y:430,w:20,h:118}] }),
  stage({ id:24,name:"ふたつの道",hint:"下の短いルートなら水を節約できる",difficulty:5,gravity:275,gun:{x:44,y:478,angle:26},goal:{x:326,y:458,required:12,size:.9},water:38,star3WaterLimit:20,star2WaterLimit:38,obstacles:[{x:144,y:395,w:92,h:24},{x:144,y:500,w:92,h:24,kind:"bounce"}] }),
  stage({ id:25,name:"三つの判断",hint:"角度、水量、ゲートの順に考えよう",difficulty:5,gravity:290,gun:{x:43,y:482,angle:49},goal:{x:324,y:445,required:12,size:.9},water:42,star3WaterLimit:20,star2WaterLimit:40,obstacles:[{x:133,y:457,w:22,h:91},{x:225,y:379,w:25,h:133,move:{axis:"y",distance:65,speed:.75}}] }),

  stage({ id:26,name:"高低差の針穴",hint:"高い隙間を抜けて小さな穴へ",difficulty:6,gravity:285,gun:{x:42,y:493,angle:60},goal:{x:323,y:378,required:12,size:.8},water:55,obstacles:[{x:150,y:330,w:25,h:92},{x:150,y:470,w:25,h:78},{x:288,y:430,w:88,h:118}] }),
  stage({ id:27,name:"動壁と斜面",hint:"壁の隙を通し、黄色い斜面へ",difficulty:6,gravity:305,gun:{x:42,y:420,angle:34},goal:{x:320,y:486,required:12,size:.85},water:55,obstacles:[{x:155,y:365,w:25,h:125,move:{axis:"y",distance:75,speed:.7}},{x:224,y:430,w:78,h:65,kind:"slopeDown"}] }),
  stage({ id:28,name:"ロングトリック",hint:"複数の壁の高さを一度に読もう",difficulty:6,gravity:275,gun:{x:38,y:493,angle:56},goal:{x:332,y:420,required:13,size:.82},water:60,obstacles:[{x:105,y:460,w:20,h:88},{x:181,y:395,w:22,h:153},{x:260,y:440,w:20,h:108}] }),
  stage({ id:29,name:"追いかける一滴",hint:"動く穴の少し先を狙い、水を節約",difficulty:6,gravity:290,gun:{x:42,y:484,angle:48},goal:{x:303,y:425,required:12,size:.82,move:{axis:"y",distance:45,speed:.5,phase:1}},water:40,star3WaterLimit:20,star2WaterLimit:40,obstacles:[{x:170,y:452,w:23,h:96},{x:242,y:345,w:22,h:90,move:{axis:"y",distance:48,speed:.6}}] }),
  stage({ id:30,name:"ウォーター・レジェンド",hint:"軌道、反射、タイミングのすべてを使おう",difficulty:7,gravity:285,gun:{x:40,y:490,angle:58},goal:{x:322,y:390,required:15,size:.88,move:{axis:"y",distance:28,speed:.4}},water:60,star3WaterLimit:25,star2WaterLimit:45,obstacles:[{x:112,y:452,w:22,h:96},{x:180,y:350,w:24,h:132,move:{axis:"y",distance:62,speed:.65}},{x:230,y:420,w:70,h:55,kind:"slopeUp"},{x:295,y:444,w:81,h:104}] }),
];

export type SaveData = { unlocked: number; stars: Record<number, number>; sound: boolean; vibration: boolean; guide: boolean };
export const DEFAULT_SAVE: SaveData = { unlocked: 1, stars: {}, sound: true, vibration: true, guide: true };
