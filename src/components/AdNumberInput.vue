<template>
    <div>
        <b-input 
            v-model="displayValue" 
            v-bind="inputAttrs" 
            @focus="focused = true" 
            @blur="focused = false" 
            @mousewheel="onMousewheel"
            @change="onChange">
        </b-input>
    </div>
</template>

<script>
import { getNumberFromText, getTextFromNumber } from '../utils/numbers';

export default {
  name: 'AdNumberInput',
  props: {
    value: Number,
  },
  data() {
    return {
      internalValue: this.value,
      displayValue: getTextFromNumber(this.value),
      focused: false,
    };
  },
  computed: {
    inputAttrs() {
      let attrs = this.$attrs;
      if ('value' in attrs) delete attrs.value;
      return attrs;
    },
    currentMagnitude() {
      let number = this.internalValue;
      let magnitude = 0;
      while (number > 999.999) {
        number /= 1000;
        magnitude += 3;
      }
      return 10 ** magnitude;
    },
  },
  watch: {
    value(val) {
      this.internalValue = val;
      if (!this.focused) this.formatDisplayValue();
    },
    internalValue() {
      this.$emit('input', this.internalValue);
    },
    displayValue(val) {
      this.internalValue = getNumberFromText(this.displayValue);
    },
  },
  methods: {
    formatDisplayValue() {
      this.displayValue = getTextFromNumber(this.internalValue);
    },
    onChange() {
      this.formatDisplayValue();
    },
    onMousewheel(e) {
      if (!this.focused) return;

      e.preventDefault();

      if (e.ctrlKey) {
        if (e.deltaY < 0 && this.internalValue < 1) this.internalValue = 1000;
        else if (e.deltaY < 0) this.internalValue *= 1000;
        else if (this.internalValue < 1000) this.internalValue = 0;
        else this.internalValue /= 1000;
      } else {
        let toAdd = this.currentMagnitude;

        if (e.shiftKey) toAdd *= 10;
        if (e.altKey) toAdd /= 10;

        if (e.deltaY < 0) this.internalValue += toAdd;
        else {
          let newVal = Math.max(0, this.internalValue - toAdd);
          this.internalValue = newVal;
        }
      }

      this.formatDisplayValue();
    },
  },
};
</script>