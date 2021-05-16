export function getNumberFromText(text) {
    if (typeof text === 'number') return text;

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
        return numPart * 10 ** exponent;
    }

    if (suffix.length == 3 && suffix[0] == suffix[1] && suffix[0] == suffix[2]) {
        const exponent = (suffix[0].charCodeAt() - 34) * 3;
        return numPart * 10 ** exponent;
    }

    if (suffix.length == 4 && suffix[0] == suffix[1] && suffix[0] == suffix[2] && suffix[0] == suffix[3]) {
        const exponent = (suffix[0].charCodeAt() - 8) * 3;
        return numPart * 10 ** exponent;
    }

    return 0;
}

export function getTextFromNumber(number) {
    if (number < 1000) return number.toFixed(2);

    let magnitude = 0;
    while (number > 999.999) { // Don't compare directly with 1000 to avoid floating point rounding errors
        number /= 1000;
        magnitude += 3;
    }

    let suffix;
    switch (magnitude) {
        case 3: suffix = 'K'; break;
        case 6: suffix = 'M'; break;
        case 9: suffix = 'B'; break;
        case 12: suffix = 'T'; break;
    }

    if (magnitude >= 15 && magnitude <= 90) {
        let char = String.fromCharCode(magnitude / 3 + 60);
        suffix = char + char;
    }
    else if (magnitude > 90 && magnitude <= 168) {
        let char = String.fromCharCode(magnitude / 3 + 34);
        suffix = char + char + char;
    }
    else if (magnitude > 168) {
        let char = String.fromCharCode(magnitude / 3 + 8);
        suffix = char + char + char + char;
    }

    return `${number.toFixed(2)} ${suffix}`;
}

export function factorial(n) {
    let value = 1;
    for (let ii = 2; ii <= n; ii++) {
        value = value * ii;
    }
    return value;
}