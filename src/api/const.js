const imgWarrior = require('../assets/classes/Warrior.png');
const imgMage = require('../assets/classes/Mage.png');
const imgMarksman = require('../assets/classes/Marksman.png');
const imgEngineer = require('../assets/classes/Engineer.png');
const imgSupport = require('../assets/classes/Support.png');

const classImages = ['', imgWarrior, imgMage, imgMarksman, imgEngineer, imgSupport];

const elements = ['Neutral', 'Fire', 'Water', null, 'Nature', null, null, null, 'Dark'];
elements[16] = 'Light';


module.exports = {
  classImages,
  elements,
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
    13:'ChangeSkillEffect',
    14:'MorphEffect',
  },

  targetTypes: {
    0: '',
    1: 'self',
    2: 'ally',//"Allies (targetted)",
    3: 'team',//"Allies (untargetted)",
    4: 'enemy',//"Enemies",
    //6:"everyone",
    5: 'self_and_enemies',
    7: 'everyone',
  }


}
