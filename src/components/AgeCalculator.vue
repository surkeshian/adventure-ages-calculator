<template>
    <div>
        <b-form class="container-fluid mt-2">
            <b-row>
                <b-col>
                    <b-form-group label="Current quantity" :label-for="getId('current-quantity-input')">
                        <ad-number-input 
                            v-model="baseResourceQuantity" 
                            size="sm" 
                            @input="onFieldInput" 
                            :id="getId('current-quantity-input')">
                        </ad-number-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Luck %" :label-for="getId('crit-rate-input')">
                        <b-input 
                            v-model="critRatePercent" 
                            size="sm" 
                            @input="onFieldInput" 
                            :id="getId('crit-rate-input')">
                        </b-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Bonus" :label-for="getId('bonus-input')">
                        <b-input v-model="critBonus" size="sm" @input="onFieldInput" :id="getId('bonus-input')"></b-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group label="Target" :label-for="getId('target-input')">
                        <ad-number-input v-model="targetQuantity" size="sm" @input="onFieldInput" :id="getId('target-input')"></ad-number-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Time to target">
                        <div class="p-1 time-to-target">{{timeToTarget}}</div>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-button variant="outline-danger" size="sm" class="mr-2" @click="multiplyAll(0.5)">All &div;2</b-button>
                    <b-button variant="outline-success" size="sm" @click="multiplyAll(2)">All &times;2</b-button>
                </b-col>
                <b-col class="text-right">
                    <b-button variant="primary" size="sm" @click="reset">Reset</b-button>
                </b-col>
            </b-row>
        </b-form>
        <b-container fluid>
            <b-row class="column-header mt-3">
                <b-col>Output / sec</b-col>
                <b-col>Quantity</b-col>
                <hr />
            </b-row>
        </b-container>
        <b-form v-for="resource of resources" :key="resource.name" class="container-fluid mt-1">
            <label class="mb-1 bold font-weight-bold" style="font-size: 0.9rem;">{{resource.name}}</label>
            <b-row>
                <b-col class="d-flex" cols="7">
                    <b-button 
                        @click="divideOutput(resource)" 
                        tabindex="-1" 
                        size="sm" 
                        variant="outline-danger">
                        &div;{{individualMultiplier}}
                    </b-button>
                    <ad-number-input 
                        v-model="resource.output" 
                        size="sm" 
                        class="mx-2" 
                        label="Output" 
                        :aria-label="resource.name + ' output per second'">
                    </ad-number-input>
                    <b-button 
                        @click="multiplyOutput(resource)" 
                        tabindex="-1" 
                        size="sm" 
                        variant="outline-success">
                        &times;{{individualMultiplier}}
                    </b-button>
                </b-col>
                <b-col cols="5">
                    <ad-number-input v-model="resource.quantity" size="sm" :aria-label="'Number of ' + resource.name"></ad-number-input>
                </b-col>
            </b-row>
        </b-form>
    </div>
</template>

<script>
import { getNumberFromText, getTextFromNumber, factorial } from '../utils/numbers';
import AdNumberInput from './AdNumberInput.vue';

export default {
  name: 'AgeCalculator',
  components: { AdNumberInput },
  props: {
    ageData: Object,
    advanceBy: Number,
  },
  data() {
    return {
      resources: [],
      baseResourceQuantity: 0,
      baseResourceAdvancedQuantity: '0',
      critRate: 0,
      critBonus: 256,
      timeToTarget: 'No target',
      targetQuantity: 0,
      id: Math.random().toString(36).substr(2, 5)
    };
  },
  created() {
    this.setNewAge();
  },
  methods: {
    setNewAge() {
      this.resources = this.ageData.resourceNames.map(n => {
        return {
          name: n,
          quantity: 0,
          output: 0,
          outputPerResource: 0,
          advancedQuantity: '0',
          advancedOutput: '0',
        };
      });

      this.loadState();
    },
    advanceTime(seconds) {
      let computedResources = [];
      let lastNonZeroResource = this.resources.length;

      for (let rr = 0; rr < this.resources.length; rr++) {
        if (!this.resources[rr].quantity || !this.resources[rr].output) {
          lastNonZeroResource = rr + 1;
          break;
        }
      }

      for (let ii = 0; ii < lastNonZeroResource; ii++) {
        let initialValue =
          ii == 0
            ? getNumberFromText(this.baseResourceQuantity)
            : this.resources[ii - 1].quantityNum;

        let workingQuantity = initialValue;

        let terms = lastNonZeroResource - ii - 1;

        for (let jj = terms; jj > 0; jj--) {
          let termValue =
            this.resources[jj + ii - 1].quantity * (1 / factorial(jj)) * seconds ** jj;

          termValue = (1 - this.critRate) * termValue + this.critRate * this.critBonus * termValue;

          for (let kk = 0; kk < jj; kk++) {
            termValue *= this.resources[kk + ii].outputPerResource;
          }

          workingQuantity += termValue;
        }

        if (ii === 0) {
          this.baseResourceAdvancedQuantity = getTextFromNumber(workingQuantity);
        } else {
          this.resources[ii - 1].advancedQuantity = getTextFromNumber(workingQuantity);
          this.resources[ii - 1].advancedOutput = getTextFromNumber(
            workingQuantity * this.resources[ii - 1].outputPerResource
          );
        }
      }
    },
    timeUntilTarget() {
      const targetNum = this.targetQuantity;
      const current = this.baseResourceQuantity;

      if (targetNum === 0) {
        this.timeToTarget = 'No target';
        return;
      } else if (current >= targetNum) {
        this.timeToTarget = 'Already reached';
        return;
      }

      let coefficients = [current - targetNum];

      for (let ii = 0; ii < this.resources.length; ii++) {
        let coefficient = this.resources[ii].quantity * (1 / factorial(ii + 1));

        for (let jj = 0; jj <= ii && coefficient > 0; jj++) {
          coefficient *= this.getOutputWithCrit(this.resources[jj].outputPerResource);
        }

        if (coefficient > 0) coefficients.push(coefficient);
        else break;
      }

      let totalSeconds;

      if (coefficients.length < 2) {
        // It's never going to happen
        totalSeconds = Infinity;
      } else if (coefficients.length === 2) {
        // Only one resource, so linear growth
        totalSeconds = -coefficients[0] / coefficients[1];
      } else {
        // Higher order polnomial - use Newton-Raphson method to get real, positive root
        const derivativeCoefficients = [];

        for (let ii = 1; ii < coefficients.length; ii++) {
          derivativeCoefficients.push(coefficients[ii] * ii);
        }

        const initialGuess = -coefficients[0] / coefficients[1] / 2;

        let xcurrent = Infinity,
          xnext = initialGuess,
          iterations = 0;

        while (Math.abs(xcurrent - xnext) > 1e-8 && iterations < 10000) {
          iterations++;

          xcurrent = xnext;

          let f = 0,
            fdash = 0;

          for (let ii = 0; ii < coefficients.length; ii++) {
            f += coefficients[ii] * xcurrent ** (ii + 1);
          }

          for (let ii = 0; ii < derivativeCoefficients.length; ii++) {
            fdash += derivativeCoefficients[ii] * xcurrent ** (ii + 1);
          }

          xnext = xcurrent - f / fdash;
        }

        totalSeconds = xnext;
      }

      if (totalSeconds === Infinity) {
        this.timeToTarget = 'Infinity';
        return;
      }

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.round(totalSeconds % 60);

      this.timeToTarget = `${hours}h ${minutes}m ${seconds}s`;
    },
    storeState() {
      const state = {
        resources: this.resources,
        baseResourceQuantity: this.baseResourceQuantity,
        critRate: this.critRate,
        critBonus: this.critBonus,
        targetQuantity: this.targetQuantity,
      };
      localStorage.setItem(this.ageData.baseResourceName, JSON.stringify(state));
    },
    loadState() {
      const state = localStorage.getItem(this.ageData.baseResourceName);
      if (state !== null) {
        const parsed = JSON.parse(state);
        this.resources = parsed.resources;
        this.baseResourceQuantity = parsed.baseResourceQuantity;
        this.critRate = parsed.critRate;
        this.critBonus = parsed.critBonus;
        this.targetQuantity = parsed.targetQuantity;
      }
    },
    getOutputWithCrit(n) {
      return (1 - this.critRate) * n + this.critRate * this.critBonus * n;
    },
    multiplyOutput(resource) {
      resource.output = resource.output * this.individualMultiplier;
    },
    divideOutput(resource) {
      resource.output = resource.output / this.individualMultiplier;
    },
    onFieldInput() {
      this.timeUntilTarget();
      this.storeState();
    },
    multiplyAll(multiple) {
      for (let resource of this.resources) {
        resource.output = resource.output * multiple;
      }
    },
    reset() {
      this.baseResourceQuantity = 0;
      this.critRate = 0;
      this.critBonus = 256;
      this.targetQuantity = 0;
      for (let resource of this.resources) {
        resource.output = 0;
        resource.quantity = 0;
      }
    },
    getId(text) {
      return `${text}_${this.id}`;
    }
  },
  computed: {
    resourceValues() {
      return this.resources.map(r => ({ quantity: r.quantity, output: r.output }));
    },
    critRatePercent: {
      get() {
        return this.critRate * 100;
      },
      set(val) {
        this.critRate = val / 100;
      },
    },
    individualMultiplier() {
      return this.ageData.individualMultiplier ?? 2;
    },
  },
  watch: {
    ageData() {
      this.setNewAge();
    },
    resourceValues(newVal, oldVal) {
      for (let r of this.resources) {
        if (r.output === 0) r.outputPerResource = 0;
        else r.outputPerResource = r.output / r.quantity;
      }

      if (this.advanceBy) this.advanceTime(this.advanceBy);

      if (this.targetQuantity) this.timeUntilTarget();

      this.storeState();
    },
    advanceBy(val) {
      this.advanceTime(val);
    },
  },
};
</script>

<style scoped>
.column-header div {
  font-size: 0.95em;
  text-align: center;
}

.column-header hr {
  border-top: 1px solid #ced4da;
  width: 100%;
  margin: 3px 15px 0 15px;
}

.time-to-target {
  background: #cfe2ff;
}
</style>