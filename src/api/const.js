const heroImages = new Map([]);

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

const elements = ['Neutral', 'Fire', 'Water', null, 'Nature', null, null, null, 'Dark'];
elements[16] = 'Light';


module.exports = {
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
