<template>
    <div>
        <b-form class="container-fluid">
            <label class="mb-1 bold font-weight-bold" style="font-size: 0.9rem;">{{ageData.baseResourceName}}</label>
            <b-row>
                <b-col><b-input v-model="baseResourceQuantity" size="sm" @change="timeUntilTarget"></b-input></b-col>
                <b-col cols="5">{{baseResourceAdvancedQuantity}}</b-col>
            </b-row>
            <b-row class="mt-1">
                <b-col class="pr-1">Luck %</b-col>
                <b-col cols="3" class="px-1"><b-input v-model="critRatePercent" size="sm"></b-input></b-col>
                <b-col class="px-1">Bonus</b-col>
                <b-col cols="3" class="pl-1"><b-input v-model="critBonus" size="sm"></b-input></b-col>
            </b-row>
            <b-row class="mt-1">
                <b-col cols="4">Target:</b-col>
                <b-col cols="4"><b-input v-model="targetQuantity" size="sm" @change="timeUntilTarget"></b-input></b-col>
                <b-col cols="4">{{timeToTarget}}</b-col>
            </b-row>
        </b-form>
        <b-form v-for="resource of resources" :key="resource.name" class="container-fluid mt-1">
            <label class="mb-1 bold font-weight-bold" style="font-size: 0.9rem;">{{resource.name}}</label>
            <b-row>
                <b-col cols=3>Output:</b-col>
                <b-col cols=1><b-button @click="divideOutput(resource)" tabindex="-1">&div;</b-button></b-col>
                <b-col cols=3><b-input v-model="resource.output" size="sm"></b-input></b-col>
                <b-col cols=1><b-button @click="multiplyOutput(resource)" tabindex="-1">x</b-button></b-col>
                <b-col cols=4>{{resource.advancedOutput}}</b-col>
            </b-row>
            <b-row>
                <b-col cols=4>Quantity:</b-col>
                <b-col cols=4><b-input v-model="resource.quantity" size="sm"></b-input></b-col>
                <b-col cols=4>{{resource.advancedQuantity}}</b-col>
            </b-row>
        </b-form>
    </div>
</template>

<script>
    export default {
        name: 'AgeCalculator',
        props: {
            ageData: Object,
            advanceBy: Number
        },
        data() {
            return {
                resources: [],
                baseResourceQuantity: '0',
                baseResourceAdvancedQuantity: '0',
                critRate: 0.3025,
                critBonus: 512,
                timeToTarget: '',
                targetQuantity: 0
            }
        },
        created() {
            this.setNewAge();
        },
        methods: {
            setNewAge() {
                this.resources = this.ageData.resourceNames.map(n => {
                return {
                    name: n,
                    quantity: '0',
                    output: '0',
                    quantityNum: 0,
                    outputNum: 0,
                    outputPerResource: 0,
                    advancedQuantity: '0',
                    advancedOutput: '0'
                    }
                });

                // TODO - sort this out
                this.loadState();
            },
            advanceTime(seconds) {
                let computedResources = [];
                let lastNonZeroResource = this.resources.length;

                for (let rr = 0; rr < this.resources.length; rr++) {
                    if (!this.resources[rr].quantityNum || !this.resources[rr].outputNum) {
                        lastNonZeroResource = rr + 1;
                        break;
                    }
                }

                for (let ii = 0; ii < lastNonZeroResource; ii++) {
                    let initialValue = ii == 0 ? this.getNumberFromText(this.baseResourceQuantity) : this.resources[ii - 1].quantityNum;

                    let workingQuantity = initialValue;

                    let terms = lastNonZeroResource - ii - 1;

                    for (let jj = terms; jj > 0; jj--) {
                        let termValue = this.resources[jj + ii - 1].quantityNum * (1 / this.factorial(jj)) * (seconds ** jj);

                        termValue = (1 - this.critRate) * termValue + this.critRate * this.critBonus * termValue;

                        for (let kk = 0; kk < jj; kk++) { 
                            termValue *= this.resources[kk + ii].outputPerResource;
                        }

                        workingQuantity += termValue;
                    }

                    if (ii === 0) {
                        this.baseResourceAdvancedQuantity = this.getTextFromNumber(workingQuantity);
                    }
                    else {
                        this.resources[ii - 1].advancedQuantity = this.getTextFromNumber(workingQuantity);
                        this.resources[ii - 1].advancedOutput = this.getTextFromNumber(workingQuantity * this.resources[ii - 1].outputPerResource);
                    }
                }
            },
            timeUntilTarget() {
                const targetNum = this.getNumberFromText(this.targetQuantity);
                const current = this.getNumberFromText(this.baseResourceQuantity);

                if (current >= targetNum) {
                    this.timeToTarget = 'Already reached';
                    return;
                }

                let coefficients = [current - targetNum];

                for (let ii = 0; ii < this.resources.length; ii++) {
                    let coefficient = this.resources[ii].quantityNum * (1 / this.factorial(ii + 1));

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
                }
                else if (coefficients.length === 2) {
                    // Only one resource, so linear growth
                    totalSeconds = -coefficients[0] / coefficients[1];
                }
                else {
                    // Higher order polnomial - use Newton-Raphson method to get real, positive root
                    const derivativeCoefficients = [];

                    for (let ii = 1; ii < coefficients.length; ii++) {
                        derivativeCoefficients.push(coefficients[ii] * ii);
                    }

                    const initialGuess = -coefficients[0] / coefficients[1] / 2;

                    let xcurrent = Infinity, xnext = initialGuess, iterations = 0;

                    while (Math.abs(xcurrent - xnext) > 1e-8 && iterations < 10000) {
                        iterations++;

                        xcurrent = xnext;

                        let f = 0, fdash = 0;

                        for (let ii = 0; ii < coefficients.length; ii++) {
                            f += coefficients[ii] * (xcurrent ** (ii + 1));
                        }

                        for (let ii = 0; ii < derivativeCoefficients.length; ii++) {
                            fdash += derivativeCoefficients[ii] * (xcurrent ** (ii + 1));
                        }

                        xnext = xcurrent - (f / fdash);
                    }

                    totalSeconds = xnext;
                }

                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = Math.round(totalSeconds % 60);

                this.timeToTarget = `${hours}h ${minutes}m ${seconds}s`;
            },
            getNumberFromText(text) {
                const regexMatch = text.toUpperCase().match(/(^[0-9]+\.?[0-9]*) ?([a-zA-Z]*)/);

                if (regexMatch === null) return 0;

                const numPart = parseFloat(regexMatch[1]);
                const suffix = regexMatch[2];

                switch (suffix) {
                    case '': return numPart;
                    case 'K': return numPart * 1e3;
                    case 'M': return numPart * 1e6;
                    case 'B': return numPart * 1e9;
                    case 'T': return numPart * 1e12;
                }

                if (suffix.length == 2 && suffix[0] == suffix[1]) {
                    // 60 because char code of 'A' is 65 so subtract 64, then add 4 to get past 'K', 'M', 'B', 'T'
                    const exponent = (suffix[0].charCodeAt() - 60) * 3;
                    return numPart * 10**exponent;
                }

                if (suffix.length == 3 && suffix[0] == suffix[1] && suffix[0] == suffix[2]) {
                    // 34 because char code of 'A' is 65 so subtract 64, add 4 to get past 'K', 'M', 'B', 'T', and add 26 to get past double letters
                    const exponent = (suffix[0].charCodeAt()  - 34) * 3;
                    return numPart * 10**exponent;
                }

                return 0;
            },
            getTextFromNumber(number) {
                if (number < 1000) return number.toFixed(2);
                
                let magnitude = 0;
                while (number > 1) {
                    number /= 1000;
                    magnitude += 3;
                }

                number *= 1000;

                let suffix;
                switch (magnitude) {
                    case 3: suffix = 'K'; break;
                    case 6: suffix = 'M'; break;
                    case 9: suffix = 'B'; break;
                    case 12: suffix = 'T'; break;
                }

                if (magnitude >= 15 && magnitude <= 90) {
                    let char = String.fromCharCode(magnitude / 3 + 59);
                    suffix = char + char;
                }
                else if (magnitude > 90) {
                    let char = String.fromCharCode(magnitude / 3 + 33);
                    suffix = char + char + char;
                }

                return `${number.toFixed(2)} ${suffix}`;
            },
            factorial(n) {
                let value = 1;
                for (let ii = 2; ii <= n; ii++) {
                    value = value * ii;
                }
                return value;
            },
            storeState() {
                localStorage.setItem(this.ageData.baseResourceName, JSON.stringify(this.resources));
            },
            loadState() {
                const state = localStorage.getItem(this.baseResourceName);
                if (state !== null) this.resources = JSON.parse(state);
            },
            getOutputWithCrit(n) {
                return (1 - this.critRate) * n + this.critRate * this.critBonus * n;
            },
            multiplyOutput(resource) {
                resource.output = this.getTextFromNumber(resource.outputNum * (this.ageData.individualMultiplier ?? 2))
            },
            divideOutput(resource) {
                resource.output = this.getTextFromNumber(resource.outputNum / (this.ageData.individualMultiplier ?? 2))
            }
        },
        computed: {
            resourceValues() {
                return this.resources.map(r => ({ quantity: r.quantity, output: r.output }));
            },
            critRatePercent: {
                get() { return this.critRate * 100 },
                set(val) { this.critRate = val / 100 }
            }
        },
        watch: {
            ageData() {
                this.setNewAge();
            },
            resourceValues(newVal, oldVal) {
                for (let r of this.resources) {
                    r.quantityNum = this.getNumberFromText(r.quantity);
                    r.outputNum = this.getNumberFromText(r.output);

                    if (r.outputNum === 0) r.outputPerResource = 0;
                    else r.outputPerResource = r.outputNum / r.quantityNum;
                }

                if (this.advanceBy) this.advanceTime(this.advanceBy);

                if (this.targetQuantity) this.timeUntilTarget();

                this.storeState();
            },
            advanceBy(val) {
                this.advanceTime(val);
            }
        }
    }
</script>