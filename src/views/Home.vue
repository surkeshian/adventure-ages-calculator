<template>
  <div class="home">
    <b-container>
      <b-row>
        <b-col>
          <b-select v-model="age1" :options="ageOptions" @change="onSelectAge(age1, 'SelectedAge1')"></b-select>
          <age-calculator v-if="age1" :ageData="age1" :advanceBy="advanceBy">
          </age-calculator>
        </b-col>
        <b-col class="d-none d-lg-block">
          <b-select v-model="age2" :options="ageOptions" @change="onSelectAge(age2, 'SelectedAge2')"></b-select>
          <age-calculator v-if="age2" :ageData="age2" :advanceBy="advanceBy">
          </age-calculator>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import AgeCalculator from '@/components/AgeCalculator.vue';

export default {
  name: 'Home',
  components: {
    AgeCalculator,
  },
  created() {
    this.age1 = this.getAge(localStorage.getItem('SelectedAge1') || 'Weapons');
    this.age2 = this.getAge(localStorage.getItem('SelectedAge2') || 'Knowledge');
  },
  data() {
    return {
      advanceBy: 0,
      intervals: [
        { text: 'seconds', value: 1 },
        { text: 'minutes', value: 60 },
        { text: 'hours', value: 3600 },
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
              resourceNames: [
                'Gladiators',
                'Chariots',
                'Arenas',
                'Roads',
                'Spartans',
                'Legionaries',
                'Academies',
                'Aqueducts',
                'Law',
                'Senators',
                'Empires',
              ],
            },
            {
              baseResourceName: 'Knowledge',
              resourceNames: [
                'Monks',
                'Chapels',
                'Knights',
                'Crusaders',
                'Artifacts',
                'Libraries',
                'Bishops',
                'Castles',
                'Kings',
                'Cathedrals',
              ],
            },
            {
              baseResourceName: 'Art',
              resourceNames: [
                'Artists',
                'Galleries',
                'Musketeers',
                'Gadgets',
                'Inventors',
                'Scholars',
                'Observatories',
                'Philosophers',
                'Museums',
                'Universities',
              ],
            },
            {
              baseResourceName: 'Machines',
              resourceNames: [
                'Workers',
                'Foundries',
                'Light Bulbs',
                'Engineers',
                'Trains',
                'Factories',
                'Radios',
                'Airships',
                'Power Plants',
                'Entrepreneurs',
              ],
            },
            {
              baseResourceName: 'Science',
              resourceNames: [
                'Scientists',
                'Labs',
                'Lasers',
                'Robots',
                'Computers',
                'Spies',
                'Televisions',
                'Astronauts',
                'Rockets',
                'Nukes',
              ],
            },
          ],
        },
        {
          event: 'Egypt',
          ages: [
            {
              baseResourceName: 'Tools',
              resourceNames: ['Builders', 'Sleds', 'Quarries', 'Obelisks', 'Sphinxes', 'Pyramids'],
            },
            {
              baseResourceName: 'Hieroglyphics',
              resourceNames: ['Scribes', 'Papyruses', 'Priests', 'Temples', 'Prophets'],
            },
            {
              baseResourceName: 'Urns',
              resourceNames: ['Mummies', 'Sarcophaguses', 'Cats', 'Deities'],
            },
          ],
        },
        {
          event: 'Japan',
          ages: [
            {
              baseResourceName: 'Kamas',
              resourceNames: ['Farmers', 'Paddies', 'Carts', 'Festivals', 'Kabukis', 'Palaces'],
              individualMultiplier: 3,
            },
            {
              baseResourceName: 'Katanas',
              resourceNames: ['Ninjas', 'Black Belts', 'Dojos', 'Clans', 'Shoguns'],
              individualMultiplier: 4,
            },
            {
              baseResourceName: 'Torii Gates',
              resourceNames: ['Monks', 'Gardens', 'Shrines', 'Dragons'],
              individualMultiplier: 5,
            },
          ],
        },
        {
          event: 'Mexico',
          ages: [
            {
              baseResourceName: 'Crops',
              resourceNames: ['Corn', 'Agaves', 'Chinampas', 'Aqueducts', 'Lakes', 'Merchants'],
              individualMultiplier: 3,
            },
            {
              baseResourceName: 'Ceramics',
              resourceNames: ['Codices', 'Paints', 'Sculptures', 'Silver', 'Necklaces'],
              individualMultiplier: 4,
            },
            {
              baseResourceName: 'Temples',
              resourceNames: ['Murals', 'Calendars', 'Step Pyramids', 'Palaces'],
              individualMultiplier: 5,
            },
          ],
        },
      ],
    };
  },
  computed: {
    ageOptions() {
      return this.events.map(e => ({
        label: e.event,
        options: e.ages.map(a => ({ text: a.baseResourceName, value: a })),
      }));
    },
  },
  methods: {
    getAge(resource) {
      for (let event of this.events) {
        for (let age of event.ages) {
          if (age.baseResourceName === resource) return age;
        }
      }
    },
    onSelectAge(age, key) {
      localStorage.setItem(key, age.baseResourceName);
    },
  },
};
</script>
