

var consts = {

  // heroClasses: [, "Warrior", "Mage", "Marksman", "Engineer", "Support"],

  //             0        1        2        3        4        5
  elements: ['Neutral', 'Fire', 'Water', 'Nature', 'Dark', 'Light'],

  rarities: ['Common', 'Rare', 'Epic', 'Legendary', 'Set Item'],

  effectTypes: {
    0:'DamageEffect',
    1:'DamageAlterEffect',
    2:'HealEffect',
    3:'HealthBoostEffect',
    4:'AlterAttackSpeed',
    5:'SlowMovementEffect',
    6:undefined,
    7:'StunEffect',
    8:'SummonEffect',
    9:'MinusCooldownEffect',
    10:undefined,
    11:'DefenseModifierEffect',
    12:'ConfuseEffect',
  },

  targetTypes: {
    0:'',
    1:'self',
    2:'ally',// "Allies (targetted)",
    3:'team',// "Allies (untargetted)",
    4:'enemy',// "Enemies",
    // 6:"everyone",
    5:'self_and_enemies',
    7:'everyone',
  },

  // targetTypes
  //            0         1       2          3          4         5             6
  itemSlots: ['Head', 'Chest', 'Weapon', 'Off-hand', 'Boots', 'Necklace', 'Consummable'],

  //                     1         2         3           4          5
  heroClasses: ['', 'Warrior', 'Mage', 'Marksman', 'Engineer', 'Support'],
  // heroClass: new Proxy( heroClasses, {
  //     get: function(target, name) {
  //         return target[name];
  // } } )

  // getClass: (classID) => heroClasses[classID]

};

module.exports = consts;
