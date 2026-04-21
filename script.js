const baseStats = {
    'deathknight': { rarity: 'common', hp: 11055, atk: 539, def: 826, spd: 86, cr: 15, cd: 50, acc: 0, res: 30, ign: 0 },
    'ninja': { rarity: 'legendary', hp: 16845, atk: 1509, def: 947, spd: 100, cr: 15, cd: 63, acc: 0, res: 30, ign: 0 },
    'marius': { rarity: 'mythical', hp: 19815, atk: 980, def: 1531, spd: 115, cr: 15, cd: 63, acc: 0, res: 30, ign: 0 }
};

const awkStats = {
    mythical: { 1: {hp: 10500}, 2: {atk: 900}, 3: {def: 750}, 4: {hp: 1000, cd: 45}, 5: {res: 90, acc: 90}, 6: {spd: 20} },
    legendary: { 1: {hp: 7500}, 2: {atk: 750}, 3: {def: 600}, 4: {hp: 1000, cd: 38}, 5: {res: 75, acc: 75}, 6: {spd: 15} },
    epic: { 1: {hp: 4500}, 2: {atk: 600}, 3: {def: 450}, 4: {hp: 1000, cd: 30}, 5: {res: 60, acc: 60}, 6: {spd: 10} },
    rare: { 1: {hp: 2250}, 2: {atk: 450}, 3: {def: 300}, 4: {hp: 1000, cd: 23}, 5: {res: 40, acc: 40}, 6: {spd: 7} }
};

const prio = { 
    'ATK Nuker': ['GAU','BOO','CHE','AMU','BAN','WEA','RIN','SHI','HEL'], 
    'DEF Nuker': ['GAU','BOO','CHE','AMU','BAN','WEA','RIN','SHI','HEL'],
    'HP Nuker':  ['GAU','BOO','CHE','AMU','BAN','WEA','RIN','SHI','HEL'], 
    'Tank':      ['CHE','SHI','GAU','RIN','HEL','AMU','BOO','BAN','WEA'], 
    'Support':   ['BOO','CHE','SHI','HEL','RIN','BAN','AMU','WEA','GAU'],
    'Custom':    ['BOO','CHE','GAU','SHI','HEL','RIN','AMU','BAN','WEA'] 
};

const utilityPrimaries = {
    'ATK Nuker': { GAU: 'cd', CHE: 'atkP', BOO: 'spd', RIN: 'atk', AMU: 'cd', BAN: 'atk' },
    'DEF Nuker': { GAU: 'cd', CHE: 'defP', BOO: 'spd', RIN: 'def', AMU: 'cd', BAN: 'def' },
    'HP Nuker':  { GAU: 'cd', CHE: 'hpP', BOO: 'spd', RIN: 'hp', AMU: 'cd', BAN: 'hp' },
    'Tank':      { GAU: 'hpP', CHE: 'res', BOO: 'spd', RIN: 'def', AMU: 'hp', BAN: 'res' },
    'Support':   { GAU: 'hpP', CHE: 'acc', BOO: 'spd', RIN: 'def', AMU: 'hp', BAN: 'acc' },
    'Custom':    { GAU: 'cd', CHE: 'atkP', BOO: 'spd', RIN: 'atk', AMU: 'cd', BAN: 'atk' }
};

/* ASCENSION DICTIONARIES */
const ascVals = {
    hp:   { AR: { 5: 870, 6: 1224 }, AC: { 5: 870, 6: 1224 } },
    hpP:  { AR: { 5: 13, 6: 20 }, AC: { 5: 0, 6: 0 } },
    atk:  { AR: { 5: 56, 6: 80 }, AC: { 5: 56, 6: 80 } },
    atkP: { AR: { 5: 13, 6: 20 }, AC: { 5: 0, 6: 0 } },
    def:  { AR: { 5: 56, 6: 80 }, AC: { 5: 56, 6: 80 } },
    defP: { AR: { 5: 13, 6: 20 }, AC: { 5: 0, 6: 0 } },
    cr:   { AR: { 5: 8, 6: 10 }, AC: { 5: 0, 6: 0 } },
    cd:   { AR: { 5: 14, 6: 20 }, AC: { 5: 10, 6: 12 } },
    spd:  { AR: { 5: 9, 6: 12 }, AC: { 5: 0, 6: 0 } },
    acc:  { AR: { 5: 20, 6: 29 }, AC: { 5: 20, 6: 29 } },
    res:  { AR: { 5: 20, 6: 29 }, AC: { 5: 20, 6: 29 } }
};

const ascPool = { 
    WEA: ['hp','atk','def'], HEL: ['hp','atk','def'], SHI: ['hp','atk','def'], 
    GAU: ['hp','hpP','atk','atkP','def','defP','cr','cd'], 
    CHE: ['hp','hpP','atk','atkP','def','defP','acc','res'], 
    BOO: ['hp','hpP','atk','atkP','def','defP','spd'], 
    RIN: ['hp','atk','def'], 
    AMU: ['hp','atk','def','cd','acc','res'], 
    BAN: ['hp','atk','def','acc','res','spd'] 
};

const utilityAscensions = {
    'ATK Nuker': { WEA:'atk', HEL:'hp', SHI:'def', GAU:'cd', CHE:'atkP', BOO:'spd', RIN:'atk', AMU:'cd', BAN:'atk' },
    'DEF Nuker': { WEA:'def', HEL:'hp', SHI:'def', GAU:'cd', CHE:'defP', BOO:'spd', RIN:'def', AMU:'cd', BAN:'def' },
    'HP Nuker':  { WEA:'hp', HEL:'hp', SHI:'def', GAU:'cd', CHE:'hpP', BOO:'spd', RIN:'hp', AMU:'cd', BAN:'hp' },
    'Tank':      { WEA:'def', HEL:'hp', SHI:'def', GAU:'hpP', CHE:'res', BOO:'spd', RIN:'def', AMU:'hp', BAN:'res' },
    'Support':   { WEA:'hp', HEL:'hp', SHI:'def', GAU:'hpP', CHE:'acc', BOO:'spd', RIN:'hp', AMU:'hp', BAN:'spd' },
    'Custom':    { WEA:'atk', HEL:'hp', SHI:'def', GAU:'cd', CHE:'atkP', BOO:'spd', RIN:'atk', AMU:'cd', BAN:'atk' }
};

const roll = { hpP: { n: "HP%", p: true, AR: { 5:[4,6], 6:[5,7] }, AC: { 5:[4,6], 6:[5,7] } }, atkP: { n: "ATK%", p: true, AR: { 5:[4,6], 6:[5,7] }, AC: { 5:[4,6], 6:[5,7] } }, defP: { n: "DEF%", p: true, AR: { 5:[4,6], 6:[5,7] }, AC: { 5:[4,6], 6:[5,7] } }, cr: { n: "C. RATE", p: true, AR: { 3:[3,5], 5:[3,5], 6:[5,7] }, AC: { 5:[3,5], 6:[5,7] } }, cd: { n: "C. DMG", p: true, AR: { 5:[4,6], 6:[5,7] }, AC: { 5:[4,6], 6:[5,7] } }, spd: { n: "SPD", p: false, AR: { 5:[3,5], 6:[5,6] }, AC: { 5:[3,5], 6:[5,6] } }, acc: { n: "ACC", p: false, AR: { 5:[7,10], 6:[9,12] }, AC: { 5:[7,10], 6:[9,12] } }, res: { n: "RES", p: false, AR: { 5:[7,10], 6:[9,12] }, AC: { 5:[7,10], 6:[9,12] } }, hp: { n: "HP", p: false, AR: { 5:[140,225], 6:[180,315] }, AC: { 5:[820,950], 6:[1000,1150] } }, atk: { n: "ATK", p: false, AR: { 5:[10,18], 6:[14,24] }, AC: { 5:[45,55], 6:[55,70] } }, def: { n: "DEF", p: false, AR: { 5:[10,18], 6:[14,24] }, AC: { 5:[45,55], 6:[55,70] } } };

const pVal = { hp: { 5: { AR: 3480, AC: 2750 }, 6: { AR: 4080, AC: 3300 } }, hpP: { 5: { AR: 50, AC: 50 }, 6: { AR: 60, AC: 60 } }, def: { 5: { AR: 225, AC: 215 }, 6: { AR: 265, AC: 260 } }, defP: { 5: { AR: 50, AC: 50 }, 6: { AR: 60, AC: 60 } }, atk: { 5: { AR: 225, AC: 215 }, 6: { AR: 265, AC: 260 } }, atkP: { 5: { AR: 50, AC: 50 }, 6: { AR: 60, AC: 60 } }, cr: { 5: { AR: 50, AC: 50 }, 6: { AR: 60, AC: 60 } }, cd: { 5: { AR: 65, AC: 33 }, 6: { AR: 80, AC: 40 } }, spd: { 5: { AR: 40, AC: 40 }, 6: { AR: 45, AC: 45 } }, acc: { 5: { AR: 78, AC: 78 }, 6: { AR: 96, AC: 96 } }, res: { 5: { AR: 78, AC: 78 }, 6: { AR: 96, AC: 96 } } };
const gCfg = [ { id: 'WEA', n: 'WEAPON', t: 'AR', po: ['atk'] }, { id: 'HEL', n: 'HELMET', t: 'AR', po: ['hp'] }, { id: 'SHI', n: 'SHIELD', t: 'AR', po: ['def'] }, { id: 'GAU', n: 'GAUNTLETS', t: 'AR', po: ['cr', 'cd', 'hpP', 'defP', 'atkP'] }, { id: 'CHE', n: 'CHEST PIECE', t: 'AR', po: ['acc', 'res', 'hpP', 'defP', 'atkP'] }, { id: 'BOO', n: 'BOOTS', t: 'AR', po: ['spd', 'hpP', 'defP', 'atkP'] }, { id: 'RIN', n: 'RING', t: 'AC', po: ['hp', 'def', 'atk'] }, { id: 'AMU', n: 'AMULET', t: 'AC', po: ['cd', 'hp', 'def', 'atk'] }, { id: 'BAN', n: 'BANNER', t: 'AC', po: ['acc', 'res', 'hp', 'def', 'atk'] } ];
const aSub = { 'WEA': ['hp', 'hpP', 'cr', 'cd', 'spd', 'acc', 'res', 'atkP'], 'HEL': ['hpP', 'def', 'defP', 'atk', 'atkP', 'cr', 'cd', 'spd', 'acc', 'res'], 'SHI': ['hp', 'hpP', 'defP', 'cr', 'cd', 'spd', 'acc', 'res'], 'GAU': ['hp', 'hpP', 'def', 'defP', 'atk', 'atkP', 'cr', 'cd', 'spd', 'acc', 'res'], 'CHE': ['hp', 'hpP', 'def', 'defP', 'atk', 'atkP', 'cr', 'cd', 'spd', 'acc', 'res'], 'BOO': ['hp', 'hpP', 'def', 'defP', 'atk', 'atkP', 'cr', 'cd', 'spd', 'acc', 'res'], 'RIN': ['hp', 'hpP', 'def', 'defP', 'atk', 'atkP'], 'AMU': ['hp', 'def', 'atk', 'cd', 'acc', 'res'], 'BAN': ['hp', 'hpP', 'def', 'defP', 'atk', 'atkP', 'spd', 'acc', 'res'] };

const perfBounds = {
    'ATK Nuker': { min: { g: 30, s: 15, t: 18 }, max: { g: 65, s: 12, t: 6 } },
    'DEF Nuker': { min: { g: 30, s: 15, t: 18 }, max: { g: 65, s: 12, t: 6 } },
    'HP Nuker':  { min: { g: 31, s: 14, t: 18 }, max: { g: 66, s: 11, t: 6 } },
    'Tank':      { min: { g: 35, s: 10, t: 18 }, max: { g: 71, s: 7, t: 3 } },
    'Support':   { min: { g: 33, s: 11, t: 19 }, max: { g: 69, s: 8, t: 4 } },
    'Custom':    { min: { g: 30, s: 15, t: 18 }, max: { g: 65, s: 10, t: 6 } }
};

const statGoals = {
    'ATK Nuker': { g: ['cr','cd','spd','atkP'], s: ['atk'] },
    'DEF Nuker': { g: ['cr','cd','spd','defP'], s: ['def'] },
    'HP Nuker':  { g: ['cr','cd','spd','hpP'], s: ['hp'] },
    'Tank':      { g: ['hpP','defP','spd','res'], s: ['hp','def'] },
    'Support':   { g: ['hpP','defP','spd','acc'], s: ['hp','def'] }
};

let state = { globalBudget: 72, pieceLimits: {}, ranks: {}, primaries: {}, ascensions: {}, hits: {}, rollValues: {} };
let activeSets = [];
let lastUtility = 'ATK Nuker';
let userGoals = { hp: '', atk: '', def: '', spd: 250, cr: 100, cd: '', acc: '', res: '', ign: '' };
let overrideGoalsActive = false;

const presetGoalsConfig = {
    'ATK Nuker': { cr: 100, spd: 250 },
    'DEF Nuker': { cr: 100, spd: 250 },
    'HP Nuker':  { cr: 100, spd: 250 },
    'Tank':      { spd: 250, res: 400 },
    'Support':   { spd: 300, acc: 400 },
    'Custom':    {} 
};

const glyphDict = {
    green5: { hp: 475, hpP: 5, atk: 30, atkP: 5, def: 30, defP: 5, spd: 5, acc: 12, res: 12 },
    green6: { hp: 750, hpP: 8, atk: 40, atkP: 8, def: 40, defP: 8, spd: 8, acc: 16, res: 16 },
    blue6: { hp: 850, hpP: 9, atk: 45, atkP: 9, def: 45, defP: 9, spd: 9, acc: 18, res: 18 },
    purple6: { hp: 950, hpP: 10, atk: 50, atkP: 10, def: 50, defP: 10, spd: 10, acc: 20, res: 20 },
    gold6: { hp: 1150, hpP: 12, atk: 60, atkP: 12, def: 60, defP: 12, spd: 12, acc: 24, res: 24 }
};

const setDB = {
    lethal: { n: 'Lethal', cat: 'off', type: 4, stats: { cr: 10, ign: 25 } },
    savage: { n: 'Savage', cat: 'off', type: 4, stats: { ign: 25 } },
    merciless: { n: 'Merciless', cat: 'off', type: 9, stats: { 1: {atkP: 10}, 2: {cd: 15}, 3: {spdP: 5}, 5: {atkP: 15}, 6: {ign: 35}, 7: {spdP: 5}, 8: {cd: 15} } },
    zeal: { n: 'Zeal', cat: 'off', type: 2, stats: { cd: 20 } },
    slayer: { n: 'Slayer', cat: 'off', type: 9, stats: { 1: {cr: 5}, 2: {cd: 10}, 3: {spdP: 5}, 5: {cr: 10}, 6: {ign: 30}, 7: {cd: 20}, 8: {spdP: 5} } },
    stonecleaver: { n: 'Stonecleaver', cat: 'off', type: 9, stats: { 1: {atkP: 10}, 2: {cd: 15}, 3: {spdP: 5}, 5: {atkP: 15}, 6: {ign: 20}, 7: {cd: 15}, 8: {spdP: 5} } },
    cruel: { n: 'Cruel', cat: 'off', type: 2, stats: { atkP: 15, ign: 5 } },
    fatal: { n: 'Fatal', cat: 'off', type: 2, stats: { atkP: 15, cr: 5 } },
    crit_damage: { n: 'Crit Damage', cat: 'off', type: 2, stats: { cd: 20 } },
    bloodthirst: { n: 'Bloodthirst', cat: 'off', type: 4, stats: { cr: 12 } },
    affinitybreaker: { n: 'Affinitybreaker', cat: 'off', type: 4, stats: { cd: 30 } },

    speed: { n: 'Speed', cat: 'spd', type: 2, stats: { spdP: 12 } },
    supersonic: { n: 'Supersonic', cat: 'spd', type: 9, stats: { 1: {res: 20}, 2: {hpP: 15}, 3: {spdP: 10}, 5: {spdP: 10}, 7: {res: 20}, 8: {spdP: 12} } },
    pinpoint: { n: 'Pinpoint', cat: 'spd', type: 9, stats: { 1: {acc: 20}, 2: {spdP: 10}, 3: {acc: 20}, 5: {spdP: 10}, 7: {acc: 20}, 8: {spdP: 12} } },
    perception: { n: 'Perception', cat: 'spd', type: 2, stats: { acc: 40, spdP: 5 } },
    instinct: { n: 'Instinct', cat: 'spd', type: 4, stats: { spdP: 12, ign: 20 } },
    divine_speed: { n: 'Divine Speed', cat: 'spd', type: 2, stats: { spdP: 12 } },
    impulse: { n: 'Impulse', cat: 'spd', type: 2, stats: { spdP: 12 } },
    righteous: { n: 'Righteous', cat: 'spd', type: 2, stats: { spdP: 10, res: 40 } },
    chronophage: { n: 'Chronophage', cat: 'spd', type: 9, stats: { 1: {res: 20}, 2: {spdP: 10}, 3: {res: 20}, 5: {spdP: 10}, 7: {res: 20}, 8: {spdP: 12} } },
    mercurial: { n: 'Mercurial', cat: 'spd', type: 9, stats: { 1: {res: 20}, 2: {hpP: 15}, 3: {spdP: 10}, 5: {spdP: 10}, 7: {res: 20}, 8: {spdP: 12} } },

    stone_skin: { n: 'Stone Skin', cat: 'surv', type: 9, stats: { 1: {res: 40}, 2: {hpP: 8}, 3: {defP: 15}, 5: {hpP: 8}, 7: {defP: 15}, 8: {res: 40} } },
    protection: { n: 'Protection', cat: 'surv', type: 9, stats: { 1: {res: 20}, 2: {hpP: 15}, 3: {spdP: 10}, 5: {spdP: 10}, 7: {res: 20}, 8: {spdP: 12} } },
    swift_parry: { n: 'Swift Parry', cat: 'surv', type: 9, stats: { 1: {cd: 10}, 2: {spdP: 10}, 3: {hpP: 10}, 5: {cd: 20}, 7: {hpP: 15}, 8: {spdP: 18} } },
    rebirth: { n: 'Rebirth', cat: 'surv', type: 9, stats: { 1: {res: 20}, 2: {hpP: 10}, 3: {spdP: 10}, 5: {spdP: 10}, 7: {res: 40}, 8: {spdP: 12} } },
};

function initSystem() {
    let gh = document.getElementById('ghToggle'); if(gh) gh.checked = false;
    let fg = document.getElementById('fgToggle'); if(fg) fg.checked = false;

    gCfg.forEach(p => {
        state.ranks[p.id] = 6; 
        state.ascensions[p.id] = 'none';
        let defaultP = (p.id === 'GAU') ? 'cd' : (p.id === 'BOO' ? 'spd' : p.po[0]);
        state.primaries[p.id] = defaultP;
        state.hits[p.id] = {};
        state.rollValues[p.id] = {};
        aSub[p.id].forEach(s => {
            state.hits[p.id][s] = 0;
            state.rollValues[p.id][s] = [];
        });
    });
    buildHTMLGrid();
    champChanged(); 
    updateGlobal(); 
}

function generateRollsFor(piece, stat, count) {
    let arr = [];
    let rnk = state.ranks[piece];
    let tType = gCfg.find(p => p.id === piece).t;
    let bounds = roll[stat][tType][rnk];
    for(let i=0; i<count; i++) {
        arr.push(Math.floor(Math.random() * (bounds[1] - bounds[0] + 1)) + bounds[0]);
    }
    return arr;
}

function champChanged() {
    let champId = document.getElementById('champSelect').value;
    let awkSelect = document.getElementById('awkSelect');
    let champData = baseStats[champId];
    
    if (champData && (champData.rarity === 'common' || champData.rarity === 'uncommon')) {
        awkSelect.value = "0"; 
        awkSelect.disabled = true;
    } else {
        awkSelect.disabled = false;
    }
    updateSummary();
}

function initSets() {
    ['off', 'spd', 'surv'].forEach(cat => {
        let sel = document.getElementById(`setSel_${cat}`);
        sel.innerHTML = '<option value="">+ Add Set...</option>';
        Object.keys(setDB).filter(k => setDB[k].cat === cat).forEach(k => {
            let suffix = setDB[k].type === 9 ? '(1-9)' : `(${setDB[k].type})`;
            sel.add(new Option(`${setDB[k].n} ${suffix}`, k));
        });
    });
    renderSets();
}

function updateDropdowns() {
    let b = getBudgets();
    ['off', 'spd', 'surv'].forEach(cat => {
        let sel = document.getElementById(`setSel_${cat}`);
        Array.from(sel.options).forEach(opt => {
            if(!opt.value) return; 
            let def = setDB[opt.value];
            let isEquipped = activeSets.some(s => s.id === opt.value);
            let cost = def.type === 9 ? 1 : def.type;
            
            if (isEquipped) {
                opt.disabled = true;
            } else if (def.type === 2 || def.type === 4) {
                opt.disabled = (b.art + cost > 6) || (b.tot + cost > 9);
            } else {
                opt.disabled = (b.tot + cost > 9);
            }
        });
    });
}

function getBudgets() {
    let artUsed = 0; let totalUsed = 0;
    activeSets.forEach(s => {
        let type = setDB[s.id].type;
        if(type === 2 || type === 4) { artUsed += s.pcs; totalUsed += s.pcs; }
        else if (type === 9) { totalUsed += s.pcs; }
    });
    return { art: artUsed, tot: totalUsed };
}

function addSet(id, cat) {
    if(!id) return;
    document.getElementById(`setSel_${cat}`).value = ""; 
    if(activeSets.find(s => s.id === id)) return; 

    let type = setDB[id].type;
    let b = getBudgets();
    let cost = type === 9 ? 1 : type;
    
    if(type === 2 || type === 4) { 
        if(b.art + cost > 6) return alert("Not enough Artifact slots! (Max 6)"); 
        if(b.tot + cost > 9) return alert("Not enough Total slots! (Max 9)");
    } 
    else { 
        if(b.tot + cost > 9) return alert("Not enough Total slots! (Max 9)"); 
    }
    
    activeSets.push({ id: id, pcs: cost });
    renderSets(); updateSummary();
}

function removeSet(id) {
    activeSets = activeSets.filter(s => s.id !== id);
    renderSets(); updateSummary();
}

function modSet(id, dir) {
    let s = activeSets.find(x => x.id === id);
    let type = setDB[id].type;
    let b = getBudgets();
    
    if(dir === 1) {
        if(type === 2 && b.art + 2 <= 6 && b.tot + 2 <= 9) s.pcs += 2;
        else if(type === 9 && b.tot + 1 <= 9 && s.pcs < 9) s.pcs += 1;
    } else if (dir === -1) {
        if(type === 2 && s.pcs > 2) s.pcs -= 2;
        else if(type === 9 && s.pcs > 1) s.pcs -= 1;
    }
    renderSets(); updateSummary();
}

function renderSets() {
    let b = getBudgets();
    document.getElementById('setBudgetLabel').innerText = `[${b.tot}/9]`;
    
    ['off', 'spd', 'surv'].forEach(cat => {
        let html = '';
        activeSets.filter(s => setDB[s.id].cat === cat).forEach(s => {
            let def = setDB[s.id];
            let ctrl = '';
            
            let disAdd = false; let disSub = false;
            if(def.type === 4) {
                ctrl = `<span style="font-family:monospace">[4]</span>`;
            } else if(def.type === 2) {
                disAdd = (b.art + 2 > 6) || (b.tot + 2 > 9); 
                disSub = (s.pcs <= 2);
                ctrl = `<button class="btn-set" ${disSub?'disabled':''} onclick="modSet('${s.id}', -1)">-</button>
                        <span style="font-family:monospace; min-width:30px; text-align:center;">[x${s.pcs/2}]</span>
                        <button class="btn-set" ${disAdd?'disabled':''} onclick="modSet('${s.id}', 1)">+</button>`;
            } else if(def.type === 9) {
                disAdd = (b.tot + 1 > 9 || s.pcs >= 9); 
                disSub = (s.pcs <= 1);
                ctrl = `<button class="btn-set" ${disSub?'disabled':''} onclick="modSet('${s.id}', -1)">-</button>
                        <span style="font-family:monospace; min-width:30px; text-align:center;">[${s.pcs}]</span>
                        <button class="btn-set" ${disAdd?'disabled':''} onclick="modSet('${s.id}', 1)">+</button>`;
            }
            
            html += `<div class="set-row">
                        <span class="set-name">${def.n}</span>
                        <div class="set-controls">${ctrl} <button class="btn-del" onclick="removeSet('${s.id}')">X</button></div>
                     </div>`;
        });
        document.getElementById(`setList_${cat}`).innerHTML = html;
    });
    
    updateDropdowns(); 
}

function toggleOverride(e) {
    if(e) e.stopPropagation();
    overrideGoalsActive = !overrideGoalsActive;
    let btn = document.getElementById('overrideBtn');
    if (overrideGoalsActive) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
    updateSummary();
}

function buildHTMLGrid() {
    const grid = document.getElementById('mainGrid');
    let html = '';
    gCfg.forEach(p => {
        html += `
        <div class="gear-card" id="card_${p.id}" onclick="expandCard('${p.id}')">
            <div class="card-header">
                <button class="btn-rank" id="btn_rank_${p.id}" onclick="event.stopPropagation(); togglePieceRank('${p.id}')">6★</button>
                <span id="title_${p.id}" class="card-title">${p.n}</span>
            </div>
            <div class="primary-display" id="p_disp_${p.id}"></div>
            <div class="ascension-display" id="a_disp_${p.id}"></div>
            <div class="limits-bar" id="limits_${p.id}"><span>Stats: <b id="l_stat_${p.id}">0/4</b></span><span>Rolls: <b id="l_rolls_${p.id}">0/4</b></span></div>
            <div class="sub-stat-list" id="subs_${p.id}"></div>
        </div>`;
    });
    grid.innerHTML = html;
}

function toggleSection(id) { document.getElementById(id).classList.toggle('collapsed'); }
function expandCard(id) {
    if(event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON' || event.target.tagName === 'SELECT') return;
    document.getElementById('card_' + id).classList.toggle('expanded');
    renderPiece(id);
}
function togglePieceRank(piece) {
    state.ranks[piece] = state.ranks[piece] === 6 ? 5 : 6;
    renderPiece(piece);
    updateSummary();
}
function changePrimary(piece, newPrimary) {
    state.primaries[piece] = newPrimary;
    if (state.hits[piece][newPrimary] > 0) {
        state.hits[piece][newPrimary] = 0; 
        state.rollValues[piece][newPrimary] = [];
    }
    renderPiece(piece); updateSummary();
}

function handleAscensionModeChange() {
    const mode = document.getElementById('ascensionMode').value;
    const util = document.getElementById('utilitySelect').value;
    if (mode === 'ideal') {
        gCfg.forEach(p => state.ascensions[p.id] = utilityAscensions[util][p.id]);
    } else if (mode === 'off') {
        gCfg.forEach(p => state.ascensions[p.id] = 'none');
    }
    gCfg.forEach(p => renderPiece(p.id));
    updateSummary();
}

function changeAscension(piece, val) {
    state.ascensions[piece] = val;
    document.getElementById('ascensionMode').value = 'custom';
    renderPiece(piece);
    updateSummary();
}

function calcLimits(budget, utility) {
    let limits = {};
    const pList = prio[utility] || prio['Custom'];
    pList.forEach(p => limits[p] = 7); 
    let rem = budget - 63; 
    for(let i=0; i<9 && rem>0; i++) { limits[pList[i]]++; rem--; } 
    for(let i=0; i<9 && rem>0; i++) { limits[pList[i]]++; rem--; } 
    return limits;
}

function enforceTrim(piece) {
    const lim = state.pieceLimits[piece];
    const mStat = 4;
    const mSing = lim - 3;
    
    let activeKeys = Object.keys(state.hits[piece]).filter(k => state.hits[piece][k] > 0);
    
    if (activeKeys.length > mStat) {
        activeKeys.slice(mStat).forEach(k => {
            state.hits[piece][k] = 0;
            state.rollValues[piece][k] = [];
        });
        activeKeys = activeKeys.slice(0, mStat);
    }
    
    activeKeys.forEach(k => {
        if (state.hits[piece][k] > mSing) {
            let overflow = state.hits[piece][k] - mSing;
            state.hits[piece][k] = mSing;
            for(let i=0; i<overflow; i++) state.rollValues[piece][k].pop();
        }
    });
    
    let tot = Object.values(state.hits[piece]).reduce((a,b)=>a+b,0);
    while (tot > lim && activeKeys.length > 0) {
        let highestKey = activeKeys.reduce((a,b) => state.hits[piece][a] > state.hits[piece][b] ? a : b);
        if (state.hits[piece][highestKey] > 1) {
            state.hits[piece][highestKey]--;
            state.rollValues[piece][highestKey].pop();
            tot--;
        } else {
            break; 
        }
    }
}

function updateUtilityGoals() {
    const util = document.getElementById('utilitySelect').value;
    userGoals = { hp: '', atk: '', def: '', spd: '', cr: '', cd: '', acc: '', res: '', ign: '' };
    
    if (presetGoalsConfig[util]) {
        Object.keys(presetGoalsConfig[util]).forEach(k => userGoals[k] = presetGoalsConfig[util][k]);
    }
}

function saveUserGoal(stat, value) {
    userGoals[stat] = value;
}

function updateGlobal() {
    let pctRaw = parseFloat(document.getElementById('budgetSlider').value);
    state.globalBudget = 63 + Math.round(18 * (pctRaw / 100)); 
    const utility = document.getElementById('utilitySelect').value;
    
    if (utility !== lastUtility) {
        lastUtility = utility;
        updateUtilityGoals();
        
        if (utilityPrimaries[utility]) {
            Object.keys(utilityPrimaries[utility]).forEach(piece => {
                let newPri = utilityPrimaries[utility][piece];
                state.primaries[piece] = newPri;
                if (state.hits[piece][newPri] > 0) {
                    state.hits[piece][newPri] = 0; 
                    state.rollValues[piece][newPri] = [];
                }
            });
            buildHTMLGrid();
        }
        
        const ascMode = document.getElementById('ascensionMode').value;
        if (ascMode === 'ideal' || ascMode === 'custom') {
            document.getElementById('ascensionMode').value = 'ideal';
            gCfg.forEach(p => state.ascensions[p.id] = utilityAscensions[utility][p.id]);
        }
    }

    document.getElementById('rarityLabel').innerText = `${Math.round(pctRaw)}%`;
    
    state.pieceLimits = calcLimits(state.globalBudget, utility);
    gCfg.forEach(p => { enforceTrim(p.id); renderPiece(p.id); });
    updateSummary();
}

function resetSubstats() {
    let gh = document.getElementById('ghToggle'); if(gh) gh.checked = false;
    let fg = document.getElementById('fgToggle'); if(fg) fg.checked = false;
    
    let glyph = document.getElementById('glyphSelect'); if(glyph) glyph.value = "0";
    let ign = document.getElementById('ignoreDefSelect'); if(ign) ign.value = "0";
    let awk = document.getElementById('awkSelect'); if(awk) awk.value = "0";

    document.querySelectorAll('.m-check').forEach(c => c.checked = false);
    mUpdate(); 

    gCfg.forEach(p => {
        Object.keys(state.hits[p.id]).forEach(k => {
            state.hits[p.id][k] = 0;
            state.rollValues[p.id][k] = [];
        });
        renderPiece(p.id);
    });

    updateSummary();
}

function evaluateStats(activeHits, currentPrimaries = state.primaries) {
    let t = { hp: [0,0], hpP: [0,0], atk: [0,0], atkP: [0,0], def: [0,0], defP: [0,0], spd: [0,0], spdP: [0,0], cr: [0,0], cd: [0,0], acc: [0,0], res: [0,0], ign: [0,0] };

    if(document.getElementById('ghToggle') && document.getElementById('ghToggle').checked) { 
        t.hpP[0]+=20; t.hpP[1]+=20; t.atkP[0]+=20; t.atkP[1]+=20; t.defP[0]+=20; t.defP[1]+=20; 
        t.cd[0]+=25; t.cd[1]+=25; t.acc[0]+=80; t.acc[1]+=80; t.res[0]+=80; t.res[1]+=80; 
    }
    if(document.getElementById('fgToggle') && document.getElementById('fgToggle').checked) {
        t.hpP[0]+=20; t.hpP[1]+=20; t.atkP[0]+=20; t.atkP[1]+=20; t.defP[0]+=20; t.defP[1]+=20;
        t.spdP[0]+=10; t.spdP[1]+=10;
    }
    
    if(document.getElementById('m_blade') && document.getElementById('m_blade').checked) { t.atk[0]+=75; t.atk[1]+=75; }
    if(document.getElementById('m_deadly') && document.getElementById('m_deadly').checked) { t.cr[0]+=5; t.cr[1]+=5; }
    if(document.getElementById('m_keen') && document.getElementById('m_keen').checked) { t.cd[0]+=10; t.cd[1]+=10; }
    if(document.getElementById('m_flawless') && document.getElementById('m_flawless').checked) { t.cd[0]+=20; t.cd[1]+=20; }
    if(document.getElementById('m_tough') && document.getElementById('m_tough').checked) { t.def[0]+=75; t.def[1]+=75; }
    if(document.getElementById('m_defiant') && document.getElementById('m_defiant').checked) { t.res[0]+=10; t.res[1]+=10; }
    if(document.getElementById('m_iron') && document.getElementById('m_iron').checked) { t.def[0]+=200; t.def[1]+=200; }
    if(document.getElementById('m_unshakable') && document.getElementById('m_unshakable').checked) { t.res[0]+=50; t.res[1]+=50; }
    if(document.getElementById('m_steadfast') && document.getElementById('m_steadfast').checked) { t.hp[0]+=810; t.hp[1]+=810; }
    if(document.getElementById('m_pinpoint') && document.getElementById('m_pinpoint').checked) { t.acc[0]+=10; t.acc[1]+=10; }
    if(document.getElementById('m_elixir') && document.getElementById('m_elixir').checked) { t.hp[0]+=3000; t.hp[1]+=3000; }
    if(document.getElementById('m_eagle') && document.getElementById('m_eagle').checked) { t.acc[0]+=50; t.acc[1]+=50; }

    const gActive = document.getElementById('glyphSelect').value;

    gCfg.forEach(p => {
        const rank = state.ranks[p.id];
        const pStat = currentPrimaries[p.id];
        t[pStat][0] += pVal[pStat][rank][p.t];
        t[pStat][1] += pVal[pStat][rank][p.t];

        const asc = state.ascensions[p.id];
        if (asc && asc !== 'none' && ascVals[asc]) {
            const aVal = ascVals[asc][p.t][rank];
            if (aVal > 0) {
                t[asc][0] += aVal;
                t[asc][1] += aVal;
            }
        }

        aSub[p.id].forEach(sid => {
            if (sid === pStat) return;
            const hits = activeHits[p.id][sid];
            if (hits > 0) {
                let gVal = 0;
                if (gActive !== "0" && glyphDict[gActive][sid]) {
                    if (rank === 6 || (rank === 5 && gActive === 'green5')) {
                        gVal = glyphDict[gActive][sid];
                    }
                }
                t[sid][0] += (hits * roll[sid][p.t][rank][0]) + gVal;
                t[sid][1] += (hits * roll[sid][p.t][rank][1]) + gVal;
            }
        });
    });

    activeSets.forEach(set => {
        let sDef = setDB[set.id];
        if (sDef.type === 2 || sDef.type === 4) {
            let mult = sDef.type === 2 ? (set.pcs / 2) : 1;
            Object.keys(sDef.stats).forEach(stat => {
                t[stat][0] += sDef.stats[stat] * mult; t[stat][1] += sDef.stats[stat] * mult;
            });
        } else if (sDef.type === 9) {
            for(let i=1; i<=set.pcs; i++) {
                if (sDef.stats[i]) {
                    Object.keys(sDef.stats[i]).forEach(stat => {
                        t[stat][0] += sDef.stats[i][stat]; t[stat][1] += sDef.stats[i][stat];
                    });
                }
            }
        }
    });

    let champId = document.getElementById('champSelect').value;
    let bDataRaw = champId ? baseStats[champId] : null;
    let awkLevel = parseInt(document.getElementById('awkSelect').value) || 0;
    
    let awkHp = 0, awkAtk = 0, awkDef = 0, awkCd = 0, awkRes = 0, awkAcc = 0, awkSpd = 0;
    if (bDataRaw && awkLevel > 0 && bDataRaw.rarity !== 'common' && bDataRaw.rarity !== 'uncommon') {
        let aCfg = awkStats[bDataRaw.rarity];
        if (aCfg) {
            if (awkLevel >= 1) awkHp += aCfg[1].hp || 0;
            if (awkLevel >= 2) awkAtk += aCfg[2].atk || 0;
            if (awkLevel >= 3) awkDef += aCfg[3].def || 0;
            if (awkLevel >= 4) { awkHp += aCfg[4].hp || 0; awkCd += aCfg[4].cd || 0; }
            if (awkLevel >= 5) { awkRes += aCfg[5].res || 0; awkAcc += aCfg[5].acc || 0; }
            if (awkLevel >= 6) awkSpd += aCfg[6].spd || 0;
        }
    }
    
    t.hp[0] += awkHp; t.hp[1] += awkHp; 
    t.atk[0] += awkAtk; t.atk[1] += awkAtk; 
    t.def[0] += awkDef; t.def[1] += awkDef; 
    t.cd[0] += awkCd; t.cd[1] += awkCd; 
    t.res[0] += awkRes; t.res[1] += awkRes; 
    t.acc[0] += awkAcc; t.acc[1] += awkAcc; 
    t.spd[0] += awkSpd; t.spd[1] += awkSpd;

    let res = {};

    ['hp','atk','def','spd','cr','cd','acc','res'].forEach(k => {
        let bVal = bDataRaw ? bDataRaw[k] : 0;
        let p0 = t[k+'P'] ? t[k+'P'][0] : 0; let p1 = t[k+'P'] ? t[k+'P'][1] : 0;
        let f0 = t[k][0]; let f1 = t[k][1];
        let t0 = 0, t1 = 0;
        
        if (bDataRaw) {
            if (['hp','atk','def','spd'].includes(k)) {
                t0 = Math.round(bVal + (bVal * (p0/100)) + f0);
                t1 = Math.round(bVal + (bVal * (p1/100)) + f1);
            } else {
                t0 = bVal + f0; t1 = bVal + f1;
            }
        } else {
            t0 = f0; t1 = f1;
        }

        res[k] = Math.round((t0+t1)/2);
    });

    return res;
}

function getScore(hitsObj, utility, currentPrimaries = state.primaries) {
    let totals = evaluateStats(hitsObj, currentPrimaries);
    let score = 0;

    let pctRaw = parseFloat(document.getElementById('budgetSlider').value);
    
    let penWeight = Math.max(0.001, Math.pow((100 - pctRaw) / 100, 3)); 
    let rollPenalty = 0;
    
    Object.keys(hitsObj).forEach(p => {
        let counts = Object.values(hitsObj[p]).filter(v => v > 0);
        let count2s = 0;
        let count3s = 0;
        let totalPieceHits = 0;
        
        counts.forEach(count => {
            if (count === 2) count2s++;
            if (count === 3) { rollPenalty += 100000; count3s++; }
            if (count === 4) rollPenalty += 1500000;      
            if (count === 5) rollPenalty += 20000000;     
            if (count === 6) rollPenalty += 250000000;    
            totalPieceHits += count;
        });
        
        // THE BORING TAX: Penalize perfectly flat distributions
        // Lowered to 250,000 so it closely competes with two double rolls (200,000)
        if (totalPieceHits === 8 && count2s === 4) {
            rollPenalty += 250000; // Flat Legendary Penalty [1][1][1][1]
        } else if (totalPieceHits === 9 && count2s === 3 && count3s === 1) {
            rollPenalty += 250000; // Flat Mythical Penalty [1][1][1][2]
        }
    });

    const tol = { hp: 2000, atk: 200, def: 200, spd: 5, acc: 10, res: 10, cr: 2, cd: 5 };
    
    if (utility === 'Custom' || overrideGoalsActive) {
        ['hp','atk','def','spd','cr','cd','acc','res'].forEach(k => {
            if (userGoals[k] !== '' && userGoals[k] !== undefined) {
                let diff = Math.abs(totals[k] - Number(userGoals[k]));
                if (diff > tol[k]) score += (diff - tol[k]) * 50000; 
            }
        });
    }
    
    let ignoreDef = parseFloat(document.getElementById('ignoreDefSelect').value);
    let effDef = totals.def * (1 - ignoreDef);
    let mitigation = effDef / (effDef + 1200);
    let ehp = totals.hp / (1 - mitigation);
    
    if (utility === 'Tank') {
        if (!overrideGoalsActive || userGoals.spd === '') {
            if (totals.spd < 250) score += (250 - totals.spd) * 100000;
            if (totals.spd > 275) score += (totals.spd - 275) * 100000;
        }
        if (!overrideGoalsActive || userGoals.res === '') {
            if (totals.res < 400) score += (400 - totals.res) * 100000;
        }
        score -= ehp;
        score += (rollPenalty * penWeight * 5); 
    } else if (utility === 'Support') {
        if (!overrideGoalsActive || userGoals.spd === '') {
            if (totals.spd < 300) score += (300 - totals.spd) * 100000;
        }
        if (!overrideGoalsActive || userGoals.acc === '') {
            if (totals.acc < 400) score += (400 - totals.acc) * 100000;
        }
        score -= ehp;
        score += (rollPenalty * penWeight * 5);
    } 
    else if (utility.includes('Nuker')) {
        if (!overrideGoalsActive || userGoals.spd === '') {
            if (totals.spd < 240) score += (240 - totals.spd) * 100000;
            if (totals.spd > 260) score += (totals.spd - 260) * 100000;
        }
        if (!overrideGoalsActive || userGoals.cr === '') {
            if (totals.cr < 100) score += (100 - totals.cr) * 100000;
            if (totals.cr > 110) score += (totals.cr - 110) * 100000;
        }
        
        let statKey = utility.split(' ')[0].toLowerCase();
        let champId = document.getElementById('champSelect').value;
        let baseStat = baseStats[champId][statKey]; 
        let totalStat = totals[statKey];
        let totalCd = totals.cd;
        
        let statRatio = (totalStat - baseStat) / baseStat;
        let cdRatio = totalCd / 100;
        let variance = Math.abs(statRatio - cdRatio);
        
        if (variance > 0.10) {
            score += variance * 1000000; 
        }

        let dmgMultiplier = totalStat * (1 + (totalCd / 100));
        score -= dmgMultiplier;
        score += (rollPenalty * penWeight); 
    } else if (utility === 'Custom') {
        score += (rollPenalty * penWeight);
    }
    
    return score;
}

function hillClimbOptimizer(initialHits, utility, initialPrimaries) {
    let currentHits = JSON.parse(JSON.stringify(initialHits));
    let currentPris = JSON.parse(JSON.stringify(initialPrimaries));
    let currentScore = getScore(currentHits, utility, currentPris);
    
    let allowPrimaryMutation = (utility === 'Custom' || utility.includes('Nuker') || overrideGoalsActive);
    
    for (let i=0; i<1500; i++) {
        if (currentScore === 0 && utility === 'Custom') break;
        
        let mutatedHits = JSON.parse(JSON.stringify(currentHits));
        let mutatedPris = JSON.parse(JSON.stringify(currentPris));
        
        if (allowPrimaryMutation && Math.random() < 0.25) {
            let mutablePieces = gCfg.filter(p => p.po.length > 1);
            let p = mutablePieces[Math.floor(Math.random() * mutablePieces.length)].id;
            
            let validPrimaryOptions = gCfg.find(x => x.id === p).po.filter(opt => 
                opt !== mutatedPris[p] && (!mutatedHits[p][opt] || mutatedHits[p][opt] === 0)
            );
            
            if (validPrimaryOptions.length > 0) {
                 mutatedPris[p] = validPrimaryOptions[Math.floor(Math.random() * validPrimaryOptions.length)];
            }
        } else {
            let p = gCfg[Math.floor(Math.random() * gCfg.length)].id;
            let activeStats = Object.keys(mutatedHits[p]).filter(s => mutatedHits[p][s] > 0);
            let candidatesA = activeStats.filter(s => mutatedHits[p][s] > 1);
            
            if (candidatesA.length > 0) {
                let statA = candidatesA[Math.floor(Math.random() * candidatesA.length)];
                let lim = state.pieceLimits[p];
                let mSing = lim - 3;
                
                let candidatesB = activeStats.filter(s => s !== statA && mutatedHits[p][s] < mSing);
                if (candidatesB.length > 0) {
                    let statB = candidatesB[Math.floor(Math.random() * candidatesB.length)];
                    mutatedHits[p][statA]--;
                    mutatedHits[p][statB]++;
                }
            }
        }
        
        let newScore = getScore(mutatedHits, utility, mutatedPris);
        if (newScore <= currentScore) {
            currentHits = mutatedHits;
            currentPris = mutatedPris;
            currentScore = newScore;
        }
    }
    return { hits: currentHits, pris: currentPris };
}

function rollDice() {
    const utility = document.getElementById('utilitySelect').value;
    let b = perfBounds[utility] || perfBounds['Custom'];
    let pNorm = (state.globalBudget - 63) / 18;
    let goalHits = Math.round(b.min.g + (b.max.g - b.min.g) * pNorm);
    let secHits = Math.round(b.min.s + (b.max.s - b.min.s) * pNorm);
    let trashHits = state.globalBudget - goalHits - secHits;

    let sGoals = statGoals[utility];
    
    if (utility === 'Custom') {
        sGoals = { g: [], s: [] };
        if (userGoals.hp !== '') { sGoals.g.push('hpP'); sGoals.s.push('hp'); }
        if (userGoals.atk !== '') { sGoals.g.push('atkP'); sGoals.s.push('atk'); }
        if (userGoals.def !== '') { sGoals.g.push('defP'); sGoals.s.push('def'); }
        if (userGoals.spd !== '') { sGoals.g.push('spd'); }
        if (userGoals.cr !== '') { sGoals.g.push('cr'); }
        if (userGoals.cd !== '') { sGoals.g.push('cd'); }
        if (userGoals.acc !== '') { sGoals.g.push('acc'); }
        if (userGoals.res !== '') { sGoals.g.push('res'); }
        
        const sinks = ['spd', 'hpP', 'defP', 'res', 'atkP', 'cr'];
        while(sGoals.g.length < 4) {
            let s = sinks.shift();
            if (!sGoals.g.includes(s)) sGoals.g.push(s);
        }
        
        const secSinks = ['hp', 'def', 'atk', 'acc'];
        while(sGoals.s.length < 2) {
            let s = secSinks.shift();
            if (!sGoals.g.includes(s) && !sGoals.s.includes(s)) sGoals.s.push(s);
        }
    }

    let bestHits = null;
    let bestPris = null;
    let bestScore = Infinity;
    
    let maxAttempts = 50; 
    let validGensFound = 0;
    let maxValidGensToProcess = 40; 

    for (let masterAttempts = 0; masterAttempts < 1000; masterAttempts++) {
        if (validGensFound >= maxValidGensToProcess) break;
        
        let baseSuccess = false;
        let baseAllocation = {};
        let g_used = 0, s_used = 0, t_used = 0;

        for(let attempts = 0; attempts < 100; attempts++) {
            g_used = 0; s_used = 0; t_used = 0;
            baseAllocation = {};

            gCfg.forEach(p => {
                let pId = p.id;
                let pPri = state.primaries[pId];
                let pOptions = aSub[pId].filter(stat => stat !== pPri); 
                pOptions = pOptions.sort(() => Math.random() - 0.5);
                let chosen = pOptions.slice(0, 4);

                chosen.forEach(stat => {
                    if (sGoals.g.includes(stat)) g_used++;
                    else if (sGoals.s.includes(stat)) s_used++;
                    else t_used++;
                });
                baseAllocation[pId] = chosen;
            });

            if (g_used <= goalHits && s_used <= secHits && t_used <= trashHits) {
                baseSuccess = true;
                break;
            }
        }

        if (!baseSuccess) {
            g_used = 0; s_used = 0; t_used = 0;
            gCfg.forEach(p => {
                let pId = p.id;
                let pPri = state.primaries[pId];
                let pOptions = aSub[pId].filter(stat => stat !== pPri);
                let chosen = pOptions.sort(()=>Math.random()-0.5).slice(0, 4);
                chosen.forEach(stat => {
                    if (sGoals.g.includes(stat)) g_used++;
                    else if (sGoals.s.includes(stat)) s_used++;
                    else t_used++;
                });
                baseAllocation[pId] = chosen;
            });
        }

        let tempHits = {};
        gCfg.forEach(p => { tempHits[p.id] = {}; aSub[p.id].forEach(s => tempHits[p.id][s] = 0); });
        gCfg.forEach(p => { baseAllocation[p.id].forEach(stat => { tempHits[p.id][stat] = 1; }); });

        let remG = goalHits - g_used;
        let remS = secHits - s_used;
        let remT = trashHits - t_used;

        let balance = 0;
        if (remT < 0) { balance += remT; remT = 0; }
        if (remS < 0) { balance += remS; remS = 0; }
        if (remG < 0) { balance += remG; remG = 0; }

        while (balance < 0) {
            if (remT > 0) { remT--; balance++; }
            else if (remS > 0) { remS--; balance++; }
            else if (remG > 0) { remG--; balance++; }
            else break; 
        }

        let rollPool = [
            ...Array(remG).fill('g'),
            ...Array(remS).fill('s'),
            ...Array(remT).fill('t')
        ].sort(() => Math.random() - 0.5);

        let rollFail = false;
        for (let i = 0; i < rollPool.length; i++) {
            let hitType = rollPool[i];
            let validOptions = [];
            let allOpenOptions = []; 

            gCfg.forEach(p => {
                let pId = p.id;
                let lim = state.pieceLimits[pId];
                let curTot = Object.values(tempHits[pId]).reduce((a, b) => a + b, 0);
                if (curTot >= lim) return; 

                let mSing = lim - 3; 
                let activeStats = baseAllocation[pId]; 
                
                activeStats.forEach(stat => {
                    if (tempHits[pId][stat] >= mSing) return; 
                    
                    allOpenOptions.push({ p: pId, s: stat });
                    
                    let isG = sGoals.g.includes(stat);
                    let isS = sGoals.s.includes(stat);
                    let isT = !isG && !isS;

                    if ((hitType === 'g' && isG) || (hitType === 's' && isS) || (hitType === 't' && isT)) {
                        validOptions.push({ p: pId, s: stat });
                    }
                });
            });

            if (validOptions.length > 0) { 
                let choice = validOptions[Math.floor(Math.random() * validOptions.length)];
                tempHits[choice.p][choice.s]++;
            } else if (allOpenOptions.length > 0) {
                let choice = allOpenOptions[Math.floor(Math.random() * allOpenOptions.length)];
                tempHits[choice.p][choice.s]++;
            } else {
                rollFail = true; break; 
            }
        }

        if (!rollFail) {
            validGensFound++;
            
            let refinedPris = JSON.parse(JSON.stringify(state.primaries));
            gCfg.forEach(p => {
                if (p.po.length > 1) {
                    let mutablePiece = gCfg.find(x => x.id === p.id);
                    let validOptions = mutablePiece.po.filter(opt => tempHits[p.id][opt] === 0);
                    
                    if (validOptions.length > 0) {
                        refinedPris[p.id] = validOptions[Math.floor(Math.random() * validOptions.length)];
                    } else {
                        refinedPris[p.id] = mutablePiece.po[0];
                        tempHits[p.id][refinedPris[p.id]] = 0; 
                    }
                }
            });

            let refinedObj = hillClimbOptimizer(tempHits, utility, refinedPris);
            let score = getScore(refinedObj.hits, utility, refinedObj.pris);
            
            if (score < bestScore) {
                bestScore = score;
                bestHits = JSON.parse(JSON.stringify(refinedObj.hits));
                bestPris = JSON.parse(JSON.stringify(refinedObj.pris));
            }
            if (bestScore === 0 && utility === 'Custom') break;
        }
    }

    if (bestHits) {
        state.hits = bestHits;
        if (bestPris) {
            state.primaries = bestPris;
            gCfg.forEach(p => {
                if (p.po.length > 1) {
                    let selectEl = document.getElementById(`p_sel_${p.id}`);
                    if(selectEl) selectEl.value = bestPris[p.id];
                }
            });
        }
        
        gCfg.forEach(p => {
            aSub[p.id].forEach(stat => {
                state.rollValues[p.id][stat] = generateRollsFor(p.id, stat, state.hits[p.id][stat]);
            });
        });
        
    } else {
        console.warn("RNG mathematically bottlenecked. Try lowering perfection scale.");
    }
    
    gCfg.forEach(p => renderPiece(p.id));
    updateSummary();
}

function toggleStatBox(piece, stat) {
    const lim = state.pieceLimits[piece];
    const mStat = 4;
    const pTot = Object.values(state.hits[piece]).reduce((a, b) => a + b, 0);
    const act = Object.values(state.hits[piece]).filter(v => v > 0).length;

    if (state.hits[piece][stat] > 0) {
        state.hits[piece][stat] = 0;
        state.rollValues[piece][stat] = []; 
    } else {
        if (act < mStat && pTot < lim) {
            state.hits[piece][stat] = 1;
            state.rollValues[piece][stat] = generateRollsFor(piece, stat, 1); 
        }
        else event.target.checked = false; 
    }
    renderPiece(piece); updateSummary();
}

function changeRoll(piece, stat, dir) {
    const cur = state.hits[piece][stat];
    const lim = state.pieceLimits[piece];
    const mRoll = lim - 4; 
    const mSing = lim - 3; 
    let cTot = Object.values(state.hits[piece]).reduce((sum, val) => sum + Math.max(0, val - 1), 0);

    if (dir === 1) { 
        if (cTot < mRoll && cur >= 1 && cur < mSing) {
            state.hits[piece][stat]++; 
            state.rollValues[piece][stat].push(generateRollsFor(piece, stat, 1)[0]); 
        }
    } 
    else if (dir === -1) { 
        if (cur > 1) {
            state.hits[piece][stat]--; 
            state.rollValues[piece][stat].pop(); 
        }
    }
    renderPiece(piece); updateSummary();
}

function renderPiece(piece) {
    const config = gCfg.find(p => p.id === piece);
    const rank = state.ranks[piece];
    const pStat = state.primaries[piece];
    const ascStat = state.ascensions[piece];
    const mode = document.getElementById('displayMode').value;
    const isExp = document.getElementById('card_' + piece).classList.contains('expanded');
    
    const pValRaw = pVal[pStat][rank][config.t];
    const pSuffix = roll[pStat].p ? "%" : "";
    
    document.getElementById('btn_rank_' + piece).innerText = rank + '★';

    const pNameRaw = roll[pStat].n.replace('%', '');
    let pHTML = '';
    if (config.po.length > 1) {
        pHTML = `<select class="primary-select" id="p_sel_${piece}" onchange="changePrimary('${piece}', this.value)" onclick="event.stopPropagation()">`;
        config.po.forEach(opt => {
            const sel = pStat === opt ? 'selected' : '';
            pHTML += `<option value="${opt}" ${sel}>${roll[opt].n.replace('%','')}</option>`;
        });
        pHTML += `</select>`;
    } else {
        pHTML = `<span class="primary-name">${pNameRaw}</span>`;
    }
    document.getElementById(`p_disp_${piece}`).innerHTML = `${pHTML}<span class="primary-val">${pValRaw}${pSuffix}</span>`;

    // RENDER ASCENSION INJECTION
    const aDisp = document.getElementById(`a_disp_${piece}`);
    if (ascStat && ascStat !== 'none') {
        document.getElementById(`card_${piece}`).classList.add('has-ascension');
        let aNameRaw = roll[ascStat] ? roll[ascStat].n.replace('%','') : '';
        let aValRaw = ascVals[ascStat][config.t][rank];
        let aSuffix = roll[ascStat] && roll[ascStat].p ? "%" : "";
        
        let aHTML = '';
        if (isExp) {
            aHTML = `<select class="asc-select" onchange="changeAscension('${piece}', this.value)" onclick="event.stopPropagation()">
                <option value="none">Remove</option>
                ${ascPool[piece].map(opt => `<option value="${opt}" ${ascStat===opt?'selected':''}>${roll[opt].n.replace('%','')}</option>`).join('')}
            </select>`;
        } else {
            aHTML = `<span class="asc-name">${aNameRaw}</span>`;
        }
        
        aDisp.innerHTML = `${aHTML}<span class="asc-val">+${aValRaw}${aSuffix}</span>`;
    } else {
        if (isExp) {
            document.getElementById(`card_${piece}`).classList.add('has-ascension');
            aDisp.innerHTML = `<select class="asc-select" onchange="changeAscension('${piece}', this.value)" onclick="event.stopPropagation()">
                <option value="none" selected>+ Add Ascension</option>
                ${ascPool[piece].map(opt => `<option value="${opt}">${roll[opt].n.replace('%','')}</option>`).join('')}
            </select>`;
        } else {
            document.getElementById(`card_${piece}`).classList.remove('has-ascension');
            aDisp.innerHTML = '';
        }
    }

    const lim = state.pieceLimits[piece];
    const mStat = 4;
    const mRoll = lim - 4;
    const mSing = lim - 3;
    
    const pTot = Object.values(state.hits[piece]).reduce((a, b) => a + b, 0);
    const act = Object.values(state.hits[piece]).filter(v => v > 0).length;
    const cTot = Object.values(state.hits[piece]).reduce((sum, val) => sum + Math.max(0, val - 1), 0);

    document.getElementById(`l_stat_${piece}`).innerText = `${act}/${mStat}`;
    document.getElementById(`l_rolls_${piece}`).innerText = `${cTot}/${mRoll}`;

    let totalHits = Object.values(state.hits[piece]).reduce((a, b) => a + b, 0);
    let titleSpan = document.getElementById(`title_${piece}`);
    titleSpan.className = 'card-title'; 
    if (totalHits === 9) titleSpan.classList.add('glow-mythic');
    else if (totalHits === 8) titleSpan.classList.add('glow-leggo');
    else if (totalHits === 7) titleSpan.classList.add('glow-epic');

    const container = document.getElementById('subs_' + piece);
    
    const gActive = document.getElementById('glyphSelect').value;

    let html = '';

    aSub[piece].forEach(sid => {
        if (sid === pStat) return; 
        const hits = state.hits[piece][sid];
        const isAct = hits > 0;
        const rCnt = isAct ? hits - 1 : 0;
        
        if (isExp || isAct) {
            const sData = roll[sid];
            const min = hits * sData[config.t][rank][0];
            const max = hits * sData[config.t][rank][1];
            const sSuf = sData.p ? "%" : "";
            
            let rStr = "0";
            if(isAct) {
                if(mode === 'avg') rStr = `${Math.round((min+max)/2)}${sSuf}`;
                else if(mode === 'low') rStr = `${min}${sSuf}`;
                else if(mode === 'high') rStr = `${max}${sSuf}`;
                else if(mode === 'random') {
                    let rSum = state.rollValues[piece][sid].reduce((a,b)=>a+b, 0);
                    rStr = `${rSum}${sSuf}`;
                }
                else rStr = `${min}-${max}${sSuf}`;
            }

            const dAdd = (cTot >= mRoll || hits >= mSing);
            const dChk = !isAct && (act >= mStat || pTot >= lim);

            let colorCls = "hit-default";
            if(hits === 6) colorCls = "hit-mythic";
            else if(hits === 5) colorCls = "hit-leggo";
            else if(hits === 4) colorCls = "hit-epic";

            let rInd = (!isExp && rCnt > 0) ? `<span class="roll-ind ${colorCls}">[${rCnt}]</span>` : '';

            let gStr = '';
            if (isAct && gActive !== "0" && glyphDict[gActive][sid]) {
                if (rank === 6 || (rank === 5 && gActive === 'green5')) {
                    let gVal = glyphDict[gActive][sid];
                    gStr = `<span class="glyph-val">+${gVal}${sSuf}</span>`;
                }
            }

            let sNameFormatted = sData.n.replace('%', '');

            html += `
                <div class="sub-row">
                    <div class="sub-row-top">
                        <label class="stat-toggle">
                            <input type="checkbox" ${isAct ? 'checked' : ''} ${dChk ? 'disabled' : ''} onclick="event.stopPropagation(); toggleStatBox('${piece}', '${sid}')" style="${isExp?'':'display:none;'}">
                            <span class="sub-label">${sNameFormatted}${isExp && rCnt>0 ? ` <span class="roll-ind ${colorCls}">[${rCnt}]</span>`:''}</span>
                        </label>
                        <div class="sub-val ${colorCls}">${rStr}${rInd}${gStr}</div>
                    </div>
                    ${isExp ? `
                        <div class="stepper">
                            <button class="btn-step" ${!isAct || rCnt <= 0 ? 'disabled' : ''} onclick="event.stopPropagation(); changeRoll('${piece}', '${sid}', -1)">-</button>
                            <span class="hit-count ${colorCls}">${rCnt}</span>
                            <button class="btn-step" ${!isAct || dAdd ? 'disabled' : ''} onclick="event.stopPropagation(); changeRoll('${piece}', '${sid}', 1)">+</button>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    });
    container.innerHTML = html || '<div style="text-align:center; color:#555; font-size:0.8em; margin-top:10px;">Tap to Edit Gear</div>';
}

function mUpdate() {
    const checks = document.querySelectorAll('.m-check');
    const activeTrees = new Set();
    let t6Selected = false;
    const tier1Counts = { offense: 0, defense: 0, support: 0 };
    
    checks.forEach(c => {
        if (c.checked) {
            activeTrees.add(c.dataset.tree);
            if (c.dataset.tier === "6") t6Selected = true;
            if (c.dataset.tier === "1") tier1Counts[c.dataset.tree]++;
        }
    });
    
    ['offense', 'defense', 'support'].forEach(t => {
        const el = document.getElementById('tree_' + t);
        if (activeTrees.size >= 2 && !activeTrees.has(t)) el.classList.add('disabled');
        else el.classList.remove('disabled');
    });
    
    checks.forEach(c => {
        c.parentElement.classList.remove('locked');
        if (t6Selected && c.dataset.tier === "6" && !c.checked) c.parentElement.classList.add('locked');
        if (tier1Counts[c.dataset.tree] >= 1 && c.dataset.tier === "1" && !c.checked) c.parentElement.classList.add('locked');
    });

    updateSummary();
}

function updateSummary() {
    let t = { hp: [0,0,0], hpP: [0,0,0], atk: [0,0,0], atkP: [0,0,0], def: [0,0,0], defP: [0,0,0], spd: [0,0,0], spdP: [0,0,0], cr: [0,0,0], cd: [0,0,0], acc: [0,0,0], res: [0,0,0], ign: [0,0,0] };

    if(document.getElementById('ghToggle') && document.getElementById('ghToggle').checked) { 
        t.hpP[0]+=20; t.hpP[1]+=20; t.hpP[2]+=20; 
        t.atkP[0]+=20; t.atkP[1]+=20; t.atkP[2]+=20;
        t.defP[0]+=20; t.defP[1]+=20; t.defP[2]+=20; 
        t.cd[0]+=25; t.cd[1]+=25; t.cd[2]+=25;
        t.acc[0]+=80; t.acc[1]+=80; t.acc[2]+=80;
        t.res[0]+=80; t.res[1]+=80; t.res[2]+=80;
    }
    if(document.getElementById('fgToggle') && document.getElementById('fgToggle').checked) {
        t.hpP[0]+=20; t.hpP[1]+=20; t.hpP[2]+=20;
        t.atkP[0]+=20; t.atkP[1]+=20; t.atkP[2]+=20;
        t.defP[0]+=20; t.defP[1]+=20; t.defP[2]+=20;
        t.spdP[0]+=10; t.spdP[1]+=10; t.spdP[2]+=10;
    }
    
    let applyMastery = (stat, val) => { t[stat][0]+=val; t[stat][1]+=val; t[stat][2]+=val; };
    if(document.getElementById('m_blade') && document.getElementById('m_blade').checked) applyMastery('atk', 75);
    if(document.getElementById('m_deadly') && document.getElementById('m_deadly').checked) applyMastery('cr', 5);
    if(document.getElementById('m_keen') && document.getElementById('m_keen').checked) applyMastery('cd', 10);
    if(document.getElementById('m_flawless') && document.getElementById('m_flawless').checked) applyMastery('cd', 20);
    if(document.getElementById('m_tough') && document.getElementById('m_tough').checked) applyMastery('def', 75);
    if(document.getElementById('m_defiant') && document.getElementById('m_defiant').checked) applyMastery('res', 10);
    if(document.getElementById('m_iron') && document.getElementById('m_iron').checked) applyMastery('def', 200);
    if(document.getElementById('m_unshakable') && document.getElementById('m_unshakable').checked) applyMastery('res', 50);
    if(document.getElementById('m_steadfast') && document.getElementById('m_steadfast').checked) applyMastery('hp', 810);
    if(document.getElementById('m_pinpoint') && document.getElementById('m_pinpoint').checked) applyMastery('acc', 10);
    if(document.getElementById('m_elixir') && document.getElementById('m_elixir').checked) applyMastery('hp', 3000);
    if(document.getElementById('m_eagle') && document.getElementById('m_eagle').checked) applyMastery('acc', 50);

    const gActive = document.getElementById('glyphSelect').value;

    gCfg.forEach(p => {
        const rank = state.ranks[p.id];
        const pStat = state.primaries[p.id];
        const pValR = pVal[pStat][rank][p.t];
        t[pStat][0] += pValR; t[pStat][1] += pValR; t[pStat][2] += pValR;

        // ASCENSION MATH
        const asc = state.ascensions[p.id];
        if (asc && asc !== 'none' && ascVals[asc]) {
            const aVal = ascVals[asc][p.t][rank];
            if (aVal > 0) {
                t[asc][0] += aVal;
                t[asc][1] += aVal;
                t[asc][2] += aVal;
            }
        }

        aSub[p.id].forEach(sid => {
            if (sid === pStat) return;
            const hits = state.hits[p.id][sid];
            if (hits > 0) {
                let baseMin = hits * roll[sid][p.t][rank][0];
                let baseMax = hits * roll[sid][p.t][rank][1];
                let gVal = 0;
                if (gActive !== "0" && glyphDict[gActive][sid]) {
                    if (rank === 6 || (rank === 5 && gActive === 'green5')) {
                        gVal = glyphDict[gActive][sid];
                    }
                }
                t[sid][0] += baseMin + gVal;
                t[sid][1] += baseMax + gVal;
                
                let rSum = 0;
                if (state.rollValues[p.id] && state.rollValues[p.id][sid]) {
                    rSum = state.rollValues[p.id][sid].reduce((a,b)=>a+b, 0);
                } else {
                    rSum = Math.round((baseMin+baseMax)/2); 
                }
                t[sid][2] += rSum + gVal;
            }
        });
    });

    activeSets.forEach(set => {
        let sDef = setDB[set.id];
        if (sDef.type === 2 || sDef.type === 4) {
            let mult = sDef.type === 2 ? (set.pcs / 2) : 1;
            Object.keys(sDef.stats).forEach(stat => {
                t[stat][0] += sDef.stats[stat] * mult;
                t[stat][1] += sDef.stats[stat] * mult;
                t[stat][2] += sDef.stats[stat] * mult;
            });
        } else if (sDef.type === 9) {
            for(let i=1; i<=set.pcs; i++) {
                if (sDef.stats[i]) {
                    Object.keys(sDef.stats[i]).forEach(stat => {
                        t[stat][0] += sDef.stats[i][stat];
                        t[stat][1] += sDef.stats[i][stat];
                        t[stat][2] += sDef.stats[i][stat];
                    });
                }
            }
        }
    });

    let champId = document.getElementById('champSelect').value;
    let bDataRaw = champId ? baseStats[champId] : null;
    let awkLevel = parseInt(document.getElementById('awkSelect').value) || 0;
    
    let awkHp = 0, awkAtk = 0, awkDef = 0, awkCd = 0, awkRes = 0, awkAcc = 0, awkSpd = 0;
    if (bDataRaw && awkLevel > 0 && bDataRaw.rarity !== 'common' && bDataRaw.rarity !== 'uncommon') {
        let aCfg = awkStats[bDataRaw.rarity];
        if (aCfg) {
            if (awkLevel >= 1) awkHp += aCfg[1].hp || 0;
            if (awkLevel >= 2) awkAtk += aCfg[2].atk || 0;
            if (awkLevel >= 3) awkDef += aCfg[3].def || 0;
            if (awkLevel >= 4) { awkHp += aCfg[4].hp || 0; awkCd += aCfg[4].cd || 0; }
            if (awkLevel >= 5) { awkRes += aCfg[5].res || 0; awkAcc += aCfg[5].acc || 0; }
            if (awkLevel >= 6) awkSpd += aCfg[6].spd || 0;
        }
    }
    
    t.hp[0] += awkHp; t.hp[1] += awkHp; t.hp[2] += awkHp;
    t.atk[0] += awkAtk; t.atk[1] += awkAtk; t.atk[2] += awkAtk;
    t.def[0] += awkDef; t.def[1] += awkDef; t.def[2] += awkDef;
    t.cd[0] += awkCd; t.cd[1] += awkCd; t.cd[2] += awkCd;
    t.res[0] += awkRes; t.res[1] += awkRes; t.res[2] += awkRes;
    t.acc[0] += awkAcc; t.acc[1] += awkAcc; t.acc[2] += awkAcc;
    t.spd[0] += awkSpd; t.spd[1] += awkSpd; t.spd[2] += awkSpd;

    const mode = document.getElementById('displayMode').value;
    const utilMode = document.getElementById('utilitySelect').value;
    const isCustom = utilMode === 'Custom';

    const formatStat = (statKey, flt, pct, isPctType) => {
        let bVal = bDataRaw ? bDataRaw[statKey] : 0;
        let suf = isPctType ? "%" : "";
        let mathStr = "", totalStr = "";

        if (mode === 'range') {
            let f0 = flt[0], f1 = flt[1];
            let p0 = pct ? pct[0] : 0, p1 = pct ? pct[1] : 0;
            
            let fRng = f0 === f1 ? `${f0}${suf}` : `[${f0}-${f1}]${suf}`;
            let pRng = pct ? (p0 === p1 ? `${p0}%` : `[${p0}-${p1}]%`) : "";
            
            if (bDataRaw) {
                if (['hp','atk','def','spd'].includes(statKey)) {
                    mathStr = pct ? `${bVal} + ${pRng} + ${fRng}` : `${bVal} + ${fRng}`;
                    let t0 = Math.round(bVal + (bVal * (p0/100)) + f0);
                    let t1 = Math.round(bVal + (bVal * (p1/100)) + f1);
                    totalStr = t0 === t1 ? `${t0}${suf}` : `[${t0}-${t1}]${suf}`;
                } else {
                    mathStr = `${bVal}${suf} + ${fRng}`;
                    let t0 = bVal + f0; let t1 = bVal + f1;
                    totalStr = t0 === t1 ? `${t0}${suf}` : `[${t0}-${t1}]${suf}`;
                }
            } else {
                mathStr = fRng + (pct ? ` + ${pRng}` : "");
                totalStr = "";
            }
        } else {
            let curF, curP;
            if (mode === 'random') { curF = flt[2]; curP = pct ? pct[2] : 0; }
            else if (mode === 'avg') { curF = Math.round((flt[0]+flt[1])/2); curP = pct ? Math.round((pct[0]+pct[1])/2) : 0; }
            else if (mode === 'low') { curF = flt[0]; curP = pct ? pct[0] : 0; }
            else if (mode === 'high') { curF = flt[1]; curP = pct ? pct[1] : 0; }

            if (bDataRaw) {
                if (['hp','atk','def','spd'].includes(statKey)) {
                    mathStr = pct ? `${bVal} + ${curP}% + ${curF}${suf}` : `${bVal} + ${curF}${suf}`;
                    let tV = Math.round(bVal + (bVal * (curP/100)) + curF);
                    totalStr = `${tV}${suf}`;
                } else {
                    mathStr = `${bVal}${suf} + ${curF}${suf}`;
                    let tV = bVal + curF;
                    totalStr = `${tV}${suf}`;
                }
            } else {
                mathStr = `${curF}${suf}` + (pct ? ` + ${curP}%` : "");
                totalStr = "";
            }
        }
        return { math: mathStr, total: totalStr };
    };

    const rows = [
        { k: 'hp', l: 'HP:', v: formatStat('hp', t.hp, t.hpP, false) },
        { k: 'atk', l: 'ATK:', v: formatStat('atk', t.atk, t.atkP, false) },
        { k: 'def', l: 'DEF:', v: formatStat('def', t.def, t.defP, false) },
        { k: 'spd', l: 'SPD:', v: formatStat('spd', t.spd, t.spdP, false) },
        { k: 'cr', l: 'C. RATE:', v: formatStat('cr', t.cr, null, true) },
        { k: 'cd', l: 'C. DMG:', v: formatStat('cd', t.cd, null, true) },
        { k: 'acc', l: 'ACC:', v: formatStat('acc', t.acc, null, false) },
        { k: 'res', l: 'RES:', v: formatStat('res', t.res, null, false) }
    ];
    
    if(t.ign[0] > 0 || t.ign[1] > 0 || t.ign[2] > 0) rows.push({ k: 'ign', l: 'IGN DEF:', v: formatStat('ign', t.ign, null, true) });

    if (['Tank', 'Support'].includes(utilMode)) {
        let ignoreDef = parseFloat(document.getElementById('ignoreDefSelect').value);
        
        let getVal = (flt) => {
            if (mode === 'random') return flt[2];
            if (mode === 'avg' || mode === 'range') return Math.round((flt[0]+flt[1])/2);
            if (mode === 'low') return flt[0];
            if (mode === 'high') return flt[1];
        };

        let curHpMode = getVal(t.hp);
        let curDefMode = getVal(t.def);
        
        let finalHp = curHpMode;
        let finalDef = curDefMode;
        
        if (bDataRaw) {
            let curHpP = getVal(t.hpP);
            let curDefP = getVal(t.defP);
            finalHp = Math.round(bDataRaw.hp + (bDataRaw.hp * (curHpP/100)) + curHpMode);
            finalDef = Math.round(bDataRaw.def + (bDataRaw.def * (curDefP/100)) + curDefMode);
        }
        
        let effDef = finalDef * (1 - ignoreDef);
        let mitigation = effDef / (effDef + 1200);
        let ehpTotal = Math.round(finalHp / (1 - mitigation));
        
        rows.push({ k: 'ehp', l: 'eHP:', v: { math: `vs ${ignoreDef * 100}% Enemy Ignore`, total: ehpTotal.toLocaleString() } });
    }

    if (['ATK Nuker', 'DEF Nuker', 'HP Nuker'].includes(utilMode) && bDataRaw) {
        let statKey = utilMode.split(' ')[0].toLowerCase(); 
        let baseStat = bDataRaw[statKey]; 
        
        let getVal = (flt, pct) => {
            if (mode === 'random') return { f: flt[2], p: pct?pct[2]:0 };
            if (mode === 'avg' || mode === 'range') return { f: Math.round((flt[0]+flt[1])/2), p: pct?Math.round((pct[0]+pct[1])/2):0 };
            if (mode === 'low') return { f: flt[0], p: pct?pct[0]:0 };
            if (mode === 'high') return { f: flt[1], p: pct?pct[1]:0 };
        };
        
        let statVals = getVal(t[statKey], t[statKey+'P']);
        let cdVals = getVal(t.cd, null);
        
        let lStr = "";
        let tStr = "";
        
        if (mode === 'range') {
            lStr = `DMG Balance: |`;
            tStr = "Switch mode from Range";
        } else {
            let totalStat = Math.round(baseStat + (baseStat * (statVals.p/100)) + statVals.f);
            let totalCd = bDataRaw.cd + cdVals.f; 
            
            let statRatio = (totalStat - baseStat) / baseStat;
            let cdRatio = totalCd / 100;
            
            let targetCd = Math.round(statRatio * 100);
            let targetStat = Math.round(baseStat + (baseStat * cdRatio));
            
            if (statRatio > cdRatio + 0.02) {
                lStr = `Balance: +${targetCd - totalCd}% C.DMG |`;
                tStr = `-${totalStat - targetStat} ${statKey.toUpperCase()}`;
            } else if (cdRatio > statRatio + 0.02) {
                lStr = `Balance: +${targetStat - totalStat} ${statKey.toUpperCase()} |`;
                tStr = `-${totalCd - targetCd}% C.DMG`;
            } else {
                lStr = `Balance:`;
                tStr = "Perfect";
            }
        }

        // Send 'balance' specific data to rendering
        rows.push({ k: 'balance', l: lStr, v: { math: '', total: tStr } });
    }

    let html = `
        <div class="col-header" style="text-align: right;">Breakdown</div>
        <div class="col-header" style="text-align: right; padding-right:10px;">Stat</div>
        <div class="col-header" style="text-align: left;">Total</div>
        <div class="col-header" style="text-align: center;">Goal</div>
    `;
    
    rows.forEach(r => { 
        let gVal = userGoals[r.k] !== undefined ? userGoals[r.k] : '';
        let inputDisabled = (isCustom || overrideGoalsActive) && r.k !== 'ehp' && r.k !== 'balance' ? '' : 'disabled';
        
        if (r.k === 'balance') {
            html += `<div style="grid-column: 1 / -1; text-align: center; color: #00ffff; font-family: monospace; font-size: 1.0em; font-weight: 900; margin-top: 5px; white-space: nowrap; letter-spacing: -0.5px;">${r.l} ${r.v.total}</div>`;
        } else if (r.k === 'ehp') {
            html += `<div class="sum-ranges ehp-row">${r.v.math}</div>
                     <div class="sum-label ehp-row">${r.l}</div>
                     <div class="sum-final ehp-row">${r.v.total}</div>
                     <div class="sum-goal ehp-row"><input type="number" value="${gVal}" placeholder="-" disabled></div>`;
        } else {
            html += `<div class="sum-ranges">${r.v.math}</div>
                     <div class="sum-label">${r.l}</div>
                     <div class="sum-final">${r.v.total}</div>
                     <div class="sum-goal"><input type="number" value="${gVal}" placeholder="-" ${inputDisabled} oninput="saveUserGoal('${r.k}', this.value)"></div>`; 
        }
    });
    document.getElementById('summaryOutput').innerHTML = html;
}

window.onload = () => {
    initSets();
    initSystem();
};