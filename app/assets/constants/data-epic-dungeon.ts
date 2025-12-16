export type RewardLevEpicDungeon = 0 | 1 | 2

export const highMountainData = {
  260: [0.15064],
  261: [0.15132],
  262: [0.15198],
  263: [0.15254],
  264: [0.15342],
  265: [0.13278],
  266: [0.13324],
  267: [0.13372],
  268: [0.13443],
  269: [0.13486],
  270: [0.06832],
  271: [0.06864],
  272: [0.06884],
  273: [0.06904],
  274: [0.06935],
  275: [0.03859],
  276: [0.03552],
  277: [0.03275],
  278: [0.03014],
  279: [0.02778],
  280: [0.01544],
  281: [0.01423],
  282: [0.01309],
  283: [0.01206],
  284: [0.01109],
  285: [0.00617],
  286: [0.00568],
  287: [0.00523],
  288: [0.00481],
  289: [0.00443],
  290: [0.00246],
  291: [0.00226],
  292: [0.00208],
  293: [0.00192],
  294: [0.00176],
  295: [0.00087],
  296: [0.00079],
  297: [0.00072],
  298: [0.00066],
  299: [0.00044],
} as Record<string, number[]>

Object.keys(highMountainData).forEach(lev => {
  const row = highMountainData[lev] as number[]
  const val = row[0]
  highMountainData[lev].push(val * 5, val * 9)
})

export const anglerCompanyData = Object.fromEntries(
  Object.entries(highMountainData)
    .filter(([level]) => Number(level) >= 270)
    .map(([level, values]) => [level, values.map(v => v * 1.5)])
);

export const nightmareParadiseData = Object.fromEntries(
  Object.entries(highMountainData)
    .filter(([level]) => Number(level) >= 280)
    .map(([level, values]) => [level, values.map(v => v * 2)])
);