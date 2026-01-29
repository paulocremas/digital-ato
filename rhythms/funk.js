setCps(130/60/4)

let intro_kick = s("[bd,bd,bd] - - -").bank("rolandtr808").gain(1.5)
let intro_beep = note("1 <1 1 1 [12*60  - [12 12] - ]>").sound("didgeridoo").speed(10).delay(0.1)

let kick = s("[[bd:1,bd:1] ~ ~ bd] [~ ~ bd ~] [~ ~ bd:1 ~] [bd ~ ~ ~]").bank("rolandtr808").gain(1.5)
let beep = note("[- 1 - -] [- - 1 -] [- - 1 -] [12 - - - ]").sound("didgeridoo").speed(10).delay(0.1)


let intro = stack(
  intro_kick,
  intro_beep
)

let verse = stack(
  kick,
  beep
)

let true_intro = seq(intro,intro)

seq(
  [intro, verse],
  [8, 16]
).slow(2)

$: verse.postgain(5)
