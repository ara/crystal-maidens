const heroImages = new Map([]);

try {
  heroImages.set('Warrior', require('../assets/classes/Warrior.png'));
  heroImages.set('Mage', require('../assets/classes/Mage.png'));
  heroImages.set('Marksman', require('../assets/classes/Marksman.png'));
  heroImages.set('Engineer', require('../assets/classes/Engineer.png'));
  heroImages.set('Support', require('../assets/classes/Support.png'));

  heroImages.set('Fire', require('../assets/elements/Fire.png'));
  heroImages.set('Nature', require('../assets/elements/Nature.png'));
  heroImages.set('Water', require('../assets/elements/Water.png'));
  heroImages.set('Light', require('../assets/elements/Light.png'));
  heroImages.set('Dark', require('../assets/elements/Dark.png'));
} catch(err) { ; }

const elements = ['Neutral', 'Fire', 'Water', null, 'Nature', null, null, null, 'Dark'];
elements[16] = 'Light';


module.exports = {
  maxSkillLevel: 29,
  maxStunDuration: 2.5,
  heroImages,
  elements,
  campBonuses: [1, 1.05, 1.1, 1.2, 1.3, 1.45, 1.6, 1.8, 2, 2.25, 3, 3.25, 3.5, 3.75, 4, 4.5],
  //            0         1       2          3          4         5             6
  itemSlots: ['Head', 'Chest', 'Weapon', 'Off-hand', 'Boots', 'Necklace', 'Consummable'],
  //            0       1         2         3           4          5
  classes: ['', 'Warrior', 'Mage', 'Marksman', 'Engineer', 'Support'],
  //             0       1       2          3            4
  rarities: ['Common', 'Rare', 'Epic', 'Legendary', 'Set Item'],

  effectTypes: {
    0: 'DamageEffect',
    1: 'DamageAlterEffect',
    2: 'HealEffect',
    3: 'HealthBoostEffect',
    4: 'AlterAttackSpeed',
    5: 'SlowMovementEffect',
    6:  null,
    7: 'StunEffect',
    8: 'SummonEffect',
    9: 'MinusCooldownEffect',
    10: null,
    11:'DefenseModifierEffect',
    12:'ConfuseEffect',
    13:'ReflectEffect',
    14:'MorphEffect',
  },

  targetTypes: {
    0: '',
    1: 'yourself',
    2: 'your allies',
    3: 'your allies and yourself',
    4: 'enemies',
    5: 'self_and_enemies',
    6: 'everyone except yourself',
    7: 'everyone',
  },

  effects: new Map([
    ['DamageEffect', 'Deals <color=red>#VALUE</color> damage to #TARGET.'],
    ['DamageAlterEffect', '#ALTER damage dealt by #TARGET by <color=teal>#VALUE</color> for <color=orange>#DURATION</color> seconds.'],
    ['HealEffect', 'Heals #TARGET for <color=green>#VALUE</color> health.'],
    ['HealthBoostEffect', 'Boosts #TARGET health by <color=teal>#VALUE</color> for <color=orange>#DURATION</color> seconds.'],
    ['AlterAttackSpeed', 'Alter the Attack Speed of #TARGET by #VALUE% for <color=orange>#DURATION</color> seconds.'],
    ['SlowMovementEffect', 'Reduces the speed of #TARGET by #VALUE% for <color=orange>#DURATION</color> sec.'],
    ['StealEffect', 'Steals <color=yellow>#VALUE</color> coins from #TARGET.'], // 6
    ['StunEffect', 'Stuns #TARGET for <color=orange>#DURATION</color> seconds.'],
    ['SummonEffect', 'The summon will be level #LEVEL. A maximum of #VALUE summon can be called at the same time.'],
    ['MinusCooldownEffect', 'Reduces the cooldown of #TARGET\'s skill by #VALUE%.'],
    ['Unknown2', ''],
    ['DefenseModifierEffect', 'Alter defense by #VALUE to #TARGET for <color=orange>#DURATION</color> seconds.'],
    ['ConfuseEffect', 'Confuse #TARGET during <color=orange>#DURATION</color> seconds.'],
    ['ChangeSkillEffect', 'Change skills among the following options.'],
    ['MorphEffect', 'Common: <color=orange>#PERCENT1%</color>, Rare: <color=orange>#PERCENT2%</color>, Epic: <color=orange>#PERCENT3%</color>, Legendary: <color=orange>#PERCENT4%</color>'],
    ['ReflectEffect', 'Gives a buff that reflect #VALUE% of the damage received to the attacker.'],
  ]),

  setBonuses: {
    hp: 'Health',
    dmg: 'DAMAGE',
    attackSpd: 'ATK SPD',
    critChance: 'CRIT HIT',
    dodge: 'DODGE',
    def: 'DEFENSE',
    cooldownReduc: 'CDR',
    speed: 'SPEED',
    dmgpercent: 'DAMAGE %',
    hppercent: 'HEALTH %',
    dmgAgainstFire: 'DMG vs Fire',
    dmgAgainstWater: 'DMG vs Water',
    dmgAgainstNature: 'DMG vs Nature',
    dmgAgainstDark: 'DMG vs Dark',
    dmgAgainstLight: 'DMG vs Light',
    resistanceAgainstFire: 'Fire Resist',
    resistanceAgainstWater: 'Water Resist',
    resistanceAgainstNature: 'Nature Resist',
    resistanceAgainstDark: 'Dark Resist',
    resistanceAgainstLight: 'Light Resist',
    reflect: 'Reflect',
    lifesteal: 'Lifesteal',
    stepPerTiles: 'Speed Change',
    hpAfterItems: 'hp after items',
    crystalOnMap: 'Crystals (map)',
    coinOnMap: 'Coins (map)',
    dropChanceOnMap: 'Drop Chance (map)',
    xp: 'XP',
    respawn: 'Respawn',
    cooldownOverCap: 'CDR over cap',
    deathGateShield: 'Immune to Death',
  },

}
