<template>
  <div class="grid">
    <table class="maps">
      <thead>
        <th>Maiden</th>
        <th>Skill Dmg</th>
        <th>Skill Heal</th>
        <th>Cast Time</th>
      </thead>

      <tbody>
        <tr
          v-for="m in maidens"
          :key="m.id"
          :class="['h'+m.sElement, m.name === selected ? ' selected' : '']"
          @click.prevent="select(m)"
        >
          <td>
            <!-- <img :title="m.sClass" :src="classIcon(m)" style="width: 16px; height: 16px;"> -->
            <span>{{ m.name }}</span>
          </td>
          <td style="text-align:right">
            {{ skillDmg(m) }}
          </td>
          <td style="text-align:right">
            {{ skillHeal(m) }}
          </td>
          <td style="text-align:right">{{ m.skill.castTime.toFixed(1) }}</td>

        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td colspan="4">
            <div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
// import {  } from 'constants';
// import { VueContext } from 'vue-context';

export default {
  state: {
    selected: null,
  },

  computed: {
    ...mapState({
      heroes: state => state.heroes.heroes,
    }),

    ...mapGetters(['maidens', 'filteredHeroCols']),
  },

  methods: {
    classIcon (hero) {
      return `../src/assets/classes/${hero.sClass}.png`;
    },
    skillDmg (m) {
      if( m.name === 'Ophelia' ) {
        console.log( m.name + ' ticks',m.skillDMGticks );
      }
      const cd = m.skill.castTime + Math.ceil( 6 * m.skill.CD) / 10;
      // console.log( m.name, cd, m.skill.castTime, m.skill.CD, m.skillDMGticks + ' ticks' );
      return Math.round((m.skillDMG + m.skillDMGInc * 28 ** m.skillCoef) *
        m.skillDMGticks / cd).toLocaleString(10);
    },
    skillHeal (m) {
      const cd = m.skill.castTime + Math.ceil( 6 * m.skill.CD) / 10;
      return Math.round((m.skillHEAL + m.skillHEALInc * 28 ** m.skillCoef) *
        m.skillHEALticks / cd).toLocaleString(10);
    },
    select (hero) {
      this.selected = hero.name;
      console.log( this.selected );
      this.$forceUpdate();
    }
  },

  created() {
    this.selected = 'Heet';
  },

}
</script>

<style lang="scss" scoped>
$p-dark: #333;
$p-medium: #777;
$p-ml: #bbb;
$p-light: #eee;

.hFire {
  background: #f4cccc;
}
.hNature {
  background: #d9ead3;
}
.hWater{
  background: #c9daf8;
}
.hLight {
  background: #fff2cc;
}
.hDark {
  background: #d9d2e9;
}

.selected {
  outline: 3px solid #3c78d8;
}

.maps {
  background-color: $p-medium;
  box-shadow: 0px 0px 8px 1px rgba(51, 51, 51, 0.5);
  cursor: default;
}

table {
  font-size: smaller;
  background-color: $p-dark;
  display: inline-block;
  // white-space: pre;
  vertical-align: top;
  border-spacing: 1px;
  table-layout: auto;

  // tbody tr:hover {
  //   outline: 3px solid #3c78d8;
  // }

  thead, tfoot {
    background-color: $p-light;
  }

  th {
    padding: .3em .1em .2em .4em;
    text-align: left;
    width: auto;
    cursor: pointer;

    .sort-arrow {
      float: right;
    }
    .nosort {
      opacity: 0;
    }
    .sort1 {
      /* color: black; */
      opacity: 1;
    }
    .sort2 {
      /* color: #aaa; */
      opacity: .4;
    }
  }

  td {
    border-collapse: collapse;
    border: 1px solid $p-light;
    padding: .1em .3em;
  }
}

body {
  margin: 0 !important;
  padding: 0 !important;
}

</style>
