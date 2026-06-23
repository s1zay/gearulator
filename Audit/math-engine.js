let championLibrary = [];

// Fetch the hand-audited champion data
async function loadChamps() {
    try {
        const response = await fetch('champs.json');
        championLibrary = await response.json();
        console.log("Champion Library Loaded:", championLibrary.length, "champions ready.");
    } catch (error) {
        console.error("Error loading champs.json:", error);
    }
}

// Call it immediately
loadChamps();

// ==========================================
// 1. GREAT HALL LOGIC ENGINE
// ==========================================
const GREAT_HALL_LEVELS = [
    { level: 1,  accRes: 5,  cd: 2,  basePct: 2,  cost: 50,   currency: "Bronze" },
    { level: 2,  accRes: 10, cd: 4,  basePct: 3,  cost: 150,  currency: "Bronze" },
    { level: 3,  accRes: 15, cd: 6,  basePct: 4,  cost: 300,  currency: "Bronze" },
    { level: 4,  accRes: 20, cd: 8,  basePct: 6,  cost: 400,  currency: "Silver" },
    { level: 5,  accRes: 30, cd: 10, basePct: 8,  cost: 500,  currency: "Silver" },
    { level: 6,  accRes: 40, cd: 12, basePct: 10, cost: 600,  currency: "Silver" },
    { level: 7,  accRes: 50, cd: 15, basePct: 12, cost: 700,  currency: "Gold" },
    { level: 8,  accRes: 60, cd: 18, basePct: 14, cost: 800,  currency: "Gold" },
    { level: 9,  accRes: 70, cd: 21, basePct: 17, cost: 900,  currency: "Gold" },
    { level: 10, accRes: 80, cd: 25, basePct: 20, cost: 1000, currency: "Gold" }
];

function getCostInGold(cost, currency) {
    if (currency === "Gold") return cost;
    if (currency === "Silver") return cost / 2;
    if (currency === "Bronze") return cost / 4;
    return 0;
}

function analyzeAffinityStat(statName, baseVal, affinVal, type) {
    // Added || 1 to baseVal to prevent dividing by zero
    let currentPctOrFlat = (type === "basePct") ? (Math.round((affinVal / (baseVal || 1)) * 100) || 0) : (affinVal || 0);
    let currentLevel = 0;
    
    for (let i = 0; i < GREAT_HALL_LEVELS.length; i++) {
        if (currentPctOrFlat >= GREAT_HALL_LEVELS[i][type]) {
            currentLevel = GREAT_HALL_LEVELS[i].level;
        }
    }

    let remainingGoldNeeded = 0;
    let goldSpent = 0;
    
    for (let i = 0; i < GREAT_HALL_LEVELS.length; i++) {
        let costInGold = getCostInGold(GREAT_HALL_LEVELS[i].cost, GREAT_HALL_LEVELS[i].currency);
        if (GREAT_HALL_LEVELS[i].level <= currentLevel) {
            goldSpent += costInGold;
        } else {
            remainingGoldNeeded += costInGold;
        }
    }

    let maxVal = GREAT_HALL_LEVELS[9][type];
    let missingPctOrFlat = maxVal - currentPctOrFlat;
    let rawStatGap = (type === "basePct") ? Math.round((missingPctOrFlat / 100) * baseVal) : missingPctOrFlat;
    if (rawStatGap < 0) rawStatGap = 0; 

    return { 
        stat: statName, 
        level: currentLevel, 
        isMaxed: currentLevel === 10, 
        goldToMax: remainingGoldNeeded,
        goldSpent: goldSpent,
        statGap: rawStatGap
    };
}

function gradeGreatHall(stats) {
    console.log("--- ADVANCED AFFINITY BONUS AUDIT ---");
    // Using ?. and || 0 to prevent crashes if a stat block is missing
    const analysis = [
        analyzeAffinityStat("HP", stats.HP?.base || 0, stats.HP?.affin || 0, "basePct"),
        analyzeAffinityStat("ATK", stats.ATK?.base || 0, stats.ATK?.affin || 0, "basePct"),
        analyzeAffinityStat("DEF", stats.DEF?.base || 0, stats.DEF?.affin || 0, "basePct"),
        analyzeAffinityStat("C.DMG", null, stats.CD?.affin || 0, "cd"),
        analyzeAffinityStat("RES", null, stats.RES?.affin || 0, "accRes"),
        analyzeAffinityStat("ACC", null, stats.ACC?.affin || 0, "accRes")
    ];

    let totalGoldNeeded = 0;
    let totalGoldSpent = 0;
    let maxedStatsCount = 0;
    let whatIfGaps = {}; 

    analysis.forEach(result => {
        totalGoldNeeded += result.goldToMax;
        totalGoldSpent += result.goldSpent;
        whatIfGaps[result.stat] = result.statGap;
        
        if (result.isMaxed) {
            maxedStatsCount++;
        }
    });

    if (maxedStatsCount === 6) {
        console.log("🏆 Congratulations! You have fully maxed out this Affinity in the Great Hall.");
        return { whatIfGaps, isFullyMaxed: true };
    }

    let arenaWinsSpent = Math.ceil(totalGoldSpent / 4);
    let arenaWinsNeeded = Math.ceil(totalGoldNeeded / 4);

    console.log(`History: You have won approximately ${arenaWinsSpent.toLocaleString()} Gold V Arena battles to reach this point.`);
    console.log(`Future: You need ${totalGoldNeeded.toLocaleString()} more Gold Medals (approx. ${arenaWinsNeeded.toLocaleString()} wins) to max this Affinity.`);

    return { whatIfGaps, isFullyMaxed: false, totalGoldNeeded, totalGoldSpent };
}

// ==========================================
// 2. SURVIVABILITY & eHP ENGINE
// ==========================================
const BOSS_BENCHMARKS = [
    { name: "A Very Angry Sheep", ehp: 5000, roast: "You could be defeated by a stiff breeze." },
    { name: "Spider 20", ehp: 150000, roast: "You're tougher than a bug, at least." },
    { name: "Dreadhorn (Normal)", ehp: 800000, roast: "Getting sturdy!" },
    { name: "UNM Clan Boss", ehp: 2000000000, roast: "Only 1.99 billion more eHP to go!" },
    { name: "The Sun", ehp: 999999999999, roast: "Maybe in the next patch." }
];

function getEHPReport(hp, def) {
    const safeHP = hp || 0;
    const safeDEF = def || 0;
    const damageMultiplier = 100 / (100 + (safeDEF / 300));
    const rawEHP = Math.floor(safeHP / damageMultiplier);
    
    let displayEHP = "";
    if (rawEHP >= 1000000) {
        displayEHP = (rawEHP / 1000000).toFixed(1) + " M";
    } else if (rawEHP >= 1000) {
        displayEHP = (rawEHP / 1000).toFixed(0) + " K";
    } else {
        displayEHP = rawEHP.toString();
    }

    console.log(`--- SURVIVABILITY ---`);
    console.log(`Your eHP: ${displayEHP}`);
    
    if (rawEHP < 1500000) {
        console.log(`Comparison: You are roughly 0.0001% as tanky as the UNM Clan Boss. ${BOSS_BENCHMARKS[0].roast}`);
    } else {
        console.log(`Comparison: You have surpassed the structural integrity of a small house.`);
    }

    return { rawEHP, displayEHP };
}

// ==========================================
// 3. BUILD PREDICTOR ENGINE
// ==========================================
function predictBuild(stats, damageScaling = []) {
    let roles = [];
    
    // Using ?. and || 0 to prevent missing stat crashes
    const hp = stats.HP?.total || 0;
    const atk = stats.ATK?.total || 0;
    const def = stats.DEF?.total || 0;
    const spd = stats.SPD?.total || 0;
    const cr = stats.CR?.total || 0;
    const cd = stats.CD?.total || 0;
    const res = stats.RES?.total || 0;
    const acc = stats.ACC?.total || 0;

    const isCritCapped = cr >= 90;
    
    if (damageScaling.includes("ATK") && atk >= 4000 && isCritCapped && cd >= 175) roles.push("Glass Cannon");
    if (damageScaling.includes("HP") && hp >= 75000 && isCritCapped && cd >= 175) roles.push("HP Nuker");
    if (damageScaling.includes("DEF") && def >= 4000 && isCritCapped && cd >= 175) roles.push("DEF Nuker");
    if (atk >= 4000 && !isCritCapped && cd < 120 && acc >= 350) roles.push("Bomber/Poisoner");
    if (hp >= 80000 && def >= 4000) roles.push("Brick Wall");
    if (res >= 400 && hp >= 60000 && def >= 3500) roles.push("Res Tank");
    if (spd >= 350) roles.push("Speed Lead");
    if (spd >= 300 && acc >= 400) roles.push("Setup Champ");
    
    if ((spd >= 220 && spd <= 260) && (acc >= 300 && acc <= 400) && (hp >= 45000 && hp <= 60000) && (def >= 3000)) {
        roles.push("Hybrid");
    }

    if (roles.length === 0) {
        return {
            matched: false,
            message: "Doesn't match meta utilities. Are you trying to reach any of these?",
            options: [
                "Res Tank", "Brick Wall", "Glass Cannon", "HP Nuker", "DEF Nuker", 
                "Setup Champ", "Speed Lead", "Hybrid", "Bomber/Poisoner"
            ],
            fallbackOptions: ["No", "Other"]
        };
    }

    return { matched: true, roles: roles.join(" / ") };
}

// ==========================================
// 4. RELIC PULSE CHECK
// ==========================================
function checkRelicStatus(stats) {
    let relicStats = [];
    
    for (const [statName, statData] of Object.entries(stats || {})) {
        if (statData?.relic && statData.relic > 0) {
            let formattedVal = statData.isPct ? `${statData.relic}%` : statData.relic;
            relicStats.push(`+${formattedVal} ${statName}`);
        }
    }

    if (relicStats.length === 0) {
        return {
            hasRelic: false,
            message: "No Relic equipped! Even a low-level one provides free stats. Time to farm the Cursed City."
        };
    }

    return { hasRelic: true, message: `Relic Contribution: ${relicStats.join(", ")}` };
}

// ==========================================
// 5. AREA BONUS (LIVE ARENA) ENGINE
// ==========================================
const MAX_AREA_BONUSES = { basePct: 20, spd: 20, cd: 30, accRes: 80 };

function analyzeAreaBonusGap(statName, baseVal, currentAreaVal, type) {
    let rawStatGap = 0;
    let maxCap = MAX_AREA_BONUSES[type];

    if (type === "basePct") {
        let maxFlatBonus = Math.round((maxCap / 100) * (baseVal || 0));
        rawStatGap = maxFlatBonus - (currentAreaVal || 0);
    } else {
        rawStatGap = maxCap - (currentAreaVal || 0);
    }

    if (rawStatGap < 0) rawStatGap = 0;
    return { stat: statName, statGap: rawStatGap };
}

function getAreaBonusWhatIfGaps(stats) {
    const analysis = [
        analyzeAreaBonusGap("HP", stats.HP?.base || 0, stats.HP?.area || 0, "basePct"),
        analyzeAreaBonusGap("ATK", stats.ATK?.base || 0, stats.ATK?.area || 0, "basePct"),
        analyzeAreaBonusGap("DEF", stats.DEF?.base || 0, stats.DEF?.area || 0, "basePct"),
        analyzeAreaBonusGap("SPD", null, stats.SPD?.area || 0, "spd"),
        analyzeAreaBonusGap("C.DMG", null, stats.CD?.area || 0, "cd"),
        analyzeAreaBonusGap("RES", null, stats.RES?.area || 0, "accRes"),
        analyzeAreaBonusGap("ACC", null, stats.ACC?.area || 0, "accRes")
    ];

    let areaWhatIfGaps = {};
    analysis.forEach(result => { areaWhatIfGaps[result.stat] = result.statGap; });
    return areaWhatIfGaps;
}

// ==========================================
// 6. FACTION GUARDIAN ENGINE
// ==========================================
const MAX_FG_BONUSES = {
    Legendary: { basePct: 10, spd: 10, accRes: 30 },
    Epic:      { basePct: 10, spd: 6,  accRes: 15 },
    Rare:      { basePct: 10, spd: 3,  accRes: 7 }
};

function analyzeFgGap(statName, baseVal, currentFgVal, type, rarity) {
    let safeRarity = MAX_FG_BONUSES[rarity] ? rarity : "Legendary";
    let maxCap = MAX_FG_BONUSES[safeRarity][type];
    let rawStatGap = 0;

    if (type === "basePct") {
        let maxFlatBonus = Math.round((maxCap / 100) * (baseVal || 0));
        rawStatGap = maxFlatBonus - (currentFgVal || 0);
    } else {
        rawStatGap = maxCap - (currentFgVal || 0);
    }

    if (rawStatGap < 0) rawStatGap = 0;
    return { stat: statName, statGap: rawStatGap };
}

function getFgWhatIfGaps(stats, rarity) {
    const analysis = [
        analyzeFgGap("HP", stats.HP?.base || 0, stats.HP?.fg || 0, "basePct", rarity),
        analyzeFgGap("ATK", stats.ATK?.base || 0, stats.ATK?.fg || 0, "basePct", rarity),
        analyzeFgGap("DEF", stats.DEF?.base || 0, stats.DEF?.fg || 0, "basePct", rarity),
        analyzeFgGap("SPD", null, stats.SPD?.fg || 0, "spd", rarity),
        analyzeFgGap("RES", null, stats.RES?.fg || 0, "accRes", rarity),
        analyzeFgGap("ACC", null, stats.ACC?.fg || 0, "accRes", rarity)
    ];

    let fgWhatIfGaps = {};
    analysis.forEach(result => { fgWhatIfGaps[result.stat] = result.statGap; });
    return fgWhatIfGaps;
}

// ==========================================
// 7. EMPOWERMENT ENGINE
// ==========================================
const MAX_EMPOWER_BONUSES = {
    Legendary: { basePct: 40, spd: 15, cr: 10, cd: 30, accRes: 55 },
    Mythical:  { basePct: 40, spd: 15, cr: 10, cd: 30, accRes: 55 },
    Epic:      { basePct: 40, spd: 10, cr: 5,  cd: 15, accRes: 40 }
};

function analyzeEmpowermentGap(statName, baseVal, currentEmpVal, type, rarity) {
    if (rarity === "Rare" || rarity === "Uncommon" || rarity === "Common") {
        return { stat: statName, statGap: 0 };
    }

    let safeRarity = MAX_EMPOWER_BONUSES[rarity] ? rarity : "Legendary";
    let maxCap = MAX_EMPOWER_BONUSES[safeRarity][type];
    let rawStatGap = 0;

    if (type === "basePct") {
        let maxFlatBonus = Math.round((maxCap / 100) * (baseVal || 0));
        rawStatGap = maxFlatBonus - (currentEmpVal || 0);
    } else {
        rawStatGap = maxCap - (currentEmpVal || 0);
    }

    if (rawStatGap < 0) rawStatGap = 0;
    return { stat: statName, statGap: rawStatGap };
}

function getEmpowermentWhatIfGaps(stats, rarity) {
    const analysis = [
        analyzeEmpowermentGap("HP", stats.HP?.base || 0, stats.HP?.emp || 0, "basePct", rarity),
        analyzeEmpowermentGap("ATK", stats.ATK?.base || 0, stats.ATK?.emp || 0, "basePct", rarity),
        analyzeEmpowermentGap("DEF", stats.DEF?.base || 0, stats.DEF?.emp || 0, "basePct", rarity),
        analyzeEmpowermentGap("SPD", null, stats.SPD?.emp || 0, "spd", rarity),
        analyzeEmpowermentGap("C.RATE", null, stats.CR?.emp || 0, "cr", rarity),
        analyzeEmpowermentGap("C.DMG", null, stats.CD?.emp || 0, "cd", rarity),
        analyzeEmpowermentGap("RES", null, stats.RES?.emp || 0, "accRes", rarity),
        analyzeEmpowermentGap("ACC", null, stats.ACC?.emp || 0, "accRes", rarity)
    ];

    let empWhatIfGaps = {};
    analysis.forEach(result => { empWhatIfGaps[result.stat] = result.statGap; });
    return empWhatIfGaps;
}

// ==========================================
// 8. DAMAGE BALANCE ENGINE
// ==========================================
function getDamageBalanceRecommendation(stats, damageScaling = []) {
    const primaryStat = damageScaling[0]; 
    const validStats = ["ATK", "DEF", "HP"];
    
    if (!validStats.includes(primaryStat) || !stats[primaryStat] || !stats.CD) {
        return { message: "Specialized scaling or missing stats detected. Standard ratios may vary." };
    }

    const base = stats[primaryStat].base || 1;
    const total = stats[primaryStat].total || 0;
    const currentCD = stats.CD.total || 0;

    const statMultiplier = total / base;
    const optimalCD = Math.round((statMultiplier * 100) - 100);
    const cdGap = currentCD - optimalCD;
    
    let msg = cdGap > 20 ? "Too much Crit Damage." : cdGap < -20 ? `Needs more ${primaryStat}.` : "Perfectly balanced!";
    
    if (damageScaling.includes("Enemy Max HP")) {
        msg += " (Note: Max HP damage benefits from even higher CD.)";
    }
    
    return { message: msg };
}