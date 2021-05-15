<template>
  <div class="home">
    <b-container fluid>
      <b-row>
        <b-col cols="2">
          <b-input v-model.number="advanceBy" type="number"></b-input>
          <b-select v-model="selectedInterval" :options="intervals"></b-select>
          <b-button variant="primary" @click="advanceBy += parseInt(selectedInterval)">+</b-button>
        </b-col>
        <b-col cols="4">
          <b-select v-model="age1" :options="ageOptions"></b-select>
          <age-calculator 
            v-if="age1"
            :ageData="age1" 
            :advanceBy="advanceBy">
          </age-calculator>
        </b-col>
        <b-col cols="4">
          <b-select v-model="age2" :options="ageOptions"></b-select>
          <age-calculator 
            v-if="age2"
            :ageData="age2" 
            :advanceBy="advanceBy">
          </age-calculator>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import AgeCalculator from '@/components/AgeCalculator.vue'

export default {
  name: 'Home',
  components: {
    AgeCalculator
  },
  data() {
    return {
      advanceBy: 0,
      intervals: [
        { text: 'seconds', value: 1 },
        { text: 'minutes', value: 60 },
        { text: 'hours', value: 3600 }
      ],
      selectedInterval: 3600,
      age1: null,
      age2: null,
      events: [
        {
          event: 'Main',
          ages: [
            {
              baseResourceName: 'Weapons',
              resourceNames: ['Gladiators', 'Chariots', 'Arenas', 'Roads', 'Spartans', 'Legionaries', 'Academies', 'Aqueducts', 'Law', 'Senators', 'Empires']
            },
            {
              baseResourceName: 'Knowledge',
              resourceNames: ['Monks', 'Chapels', 'Knights', 'Crusaders', 'Artifacts', 'Libraries', 'Bishops', 'Castles', 'Kings', 'Cathedrals']
            },
            {
              baseResourceName: 'Art',
              resourceNames: ['Artists', 'Galleries', 'Musketeers', 'Gadgets', 'Inventors', 'Scholars', 'Observatories', 'Philosophers', 'Museums', 'Universities']
            },
            {
              baseResourceName: 'Machines',
              resourceNames: ['Workers', 'Foundries', 'Light Bulbs', 'Engineers', 'Trains', 'Factories', 'Radios', 'Airships', 'Power Plants', 'Entrepreneurs']
            },
            {
              baseResourceName: 'Science',
              resourceNames: ['Scientists', 'Labs', 'Lasers', 'Robots', 'Computers', 'Spies', 'Televisions', 'Astronauts', 'Rockets', 'Nukes']
            }
          ]
        },
        {
          event: 'Egypt',
          ages: [
            {
              baseResourceName: 'Tools',
              resourceNames: ['Builders', 'Sleds', 'Quarries', 'Obelisks', 'Sphinxes', 'Pyramids']
            },
            {
              baseResourceName: 'Hieroglyphics',
              resourceNames: ['Scribes', 'Papyruses', 'Priests', 'Temples', 'Prophets']
            },
            {
              baseResourceName: 'Urns',
              resourceNames: ['Mummies', 'Sarcophaguses', 'Cats', 'Deities']
            }
          ]
        },
        {
          event: 'Japan - TODO',
          ages: []
        }
      ]
    }
  },
  computed: {
    ageOptions() {
      return this.events.map(e => ({ label: e.event, options: e.ages.map(a => ({ text: a.baseResourceName, value: a }))}))
    }
  }
}
</script>
