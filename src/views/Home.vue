<template>
  <div class="home">
    <b-container fluid>
      <b-row>
        <b-col cols="1">
          <b-input v-model.number="advanceBy" type="number"></b-input>
          <b-select v-model="selectedInterval" :options="intervals"></b-select>
          <b-button variant="primary" @click="advanceBy += parseInt(selectedInterval)">+</b-button>
        </b-col>
        <b-col cols="2">
          <age-calculator 
            baseResourceName="Weapons" 
            :resourceNames="['Gladiators', 'Chariots', 'Arenas', 'Roads', 'Spartans', 'Legionaries', 'Academies', 'Aqueducts', 'Law']"
            :advanceBy="advanceBy">
          </age-calculator>
          </b-col>
        <b-col cols="2">
          <age-calculator 
            baseResourceName="Knowledge" 
            :resourceNames="['Monks', 'Chapels', 'Knights', 'Crusaders', 'Artifacts', 'Libraries', 'Bishops', 'Castles', 'Kings']"
            :advanceBy="advanceBy">
          </age-calculator>
          </b-col>
        <b-col cols="2">
          <age-calculator 
            baseResourceName="Art" 
            :resourceNames="['Artists', 'Galleries', 'Musketeers', 'Gadgets', 'Inventors', 'Scholars', 'Observatories', 'Philosophers']"
            :advanceBy="advanceBy">
          </age-calculator>
          </b-col>
        <b-col cols="2">
          <age-calculator 
            baseResourceName="Machines" 
            :resourceNames="['Workers', 'Foundries', 'Light Bulbs', 'Engineers', 'Trains', 'Factories', 'Radios']"
            :advanceBy="advanceBy">
          </age-calculator>
          </b-col>
        <b-col cols="2">
          <age-calculator 
            baseResourceName="Science" 
            :resourceNames="['Scientists', 'Labs', 'Lasers', 'Robots', 'Computers', 'Spies']"
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
      ageOptions: [
        {
          label: 'Main',
          options: [
            {
              baseResourceName: 'Weapons',
              resourceNames: ['Gladiators', 'Chariots', 'Arenas', 'Roads', 'Spartans', 'Legionaries', 'Academies', 'Aqueducts', 'Law']
            },
            {
              baseResourceName: 'Knowledge',
              resourceNames: ['Monks', 'Chapels', 'Knights', 'Crusaders', 'Artifacts', 'Libraries', 'Bishops', 'Castles', 'Kings']
            },
            {
              baseResourceName: 'Art',
              resourceNames: ['Artists', 'Galleries', 'Musketeers', 'Gadgets', 'Inventors', 'Scholars', 'Observatories', 'Philosophers']
            },
            {
              baseResourceName: 'Machines',
              resourceNames: ['Workers', 'Foundries', 'Light Bulbs', 'Engineers', 'Trains', 'Factories', 'Radios']
            },
            {
              baseResourceName: 'Science',
              resourceNames: ['Scientists', 'Labs', 'Lasers', 'Robots', 'Computers', 'Spies']
            }
          ]
        }
      ]
    }
  }
}
</script>
