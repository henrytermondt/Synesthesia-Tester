let width = window.innerWidth,
    height = window.innerHeight;

let unit = width / 100;
document.documentElement.style.setProperty('--u', unit + 'px');


const wrapper = document.getElementById('wrapper'),
    results = document.getElementById('results-wrapper');

const hexToRGB = str => [parseInt(str.slice(1,3), 16), parseInt(str.slice(3,5), 16), parseInt(str.slice(5,7), 16)];

const compare = (a, b) => Math.sqrt(
    (a[0] - b[0]) ** 2 +
    (a[1] - b[1]) ** 2 +
    (a[2] - b[2]) ** 2
);


const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;

    unit = width / 100;

    if (width / 100 > 1.5 * height / 100)
        unit = 1.5 * height / 100;

    document.documentElement.style.setProperty('--u', unit + 'px');

    const wrapperHeight = +window.getComputedStyle(wrapper).height.slice(0, -2);
    wrapper.style.top = `${(height - wrapperHeight) / 2 - 50}px`;

    const resultsHeight = +window.getComputedStyle(results).height.slice(0, -2);
    results.style.top = `${(height - resultsHeight) / 2 - 50}px`;
};

window.onresize = resize;
resize();

const colors = [],
    hexCodes = [],
    colorPickers = document.querySelectorAll('input');

let phase = 1;
const phaseEl = document.getElementById('phase');

const submit = document.getElementById('submit');
const confirmations = document.getElementsByClassName('confirmation');

const synesthetic = document.getElementById('synesthetic'),
    notSynesthetic = document.getElementById('not-synesthetic');

submit.onclick = () => {
    for (const el of colorPickers) {
        colors.push(hexToRGB(el.value));
        hexCodes.push(el.value);
        el.value = '#363636';
    }
    
    if (phase === 1) {
        phaseEl.textContent = 'Phase 2';
        
        for (const el of confirmations) {
            el.style.opacity = 1;
        }
        window.setTimeout(() => {
            for (const el of confirmations) {
                el.style.opacity = 0;
            }
        }, 7000);

        phase ++;
    } else {
        let score = 0;

        // Perfect lack of variation
        if (hexCodes[0] === hexCodes[1] && hexCodes[1] === hexCodes[2] ||
            hexCodes[3] === hexCodes[4] && hexCodes[4] === hexCodes[5] ||
            hexCodes[0] === hexCodes[4] && hexCodes[1] === hexCodes[5] && hexCodes[2] === hexCodes[3]) score += Infinity;

        /*
        Song order
        ABC
        CAB
        */

        score += compare(colors[0], colors[1 + 3]); // First and second
        score += compare(colors[1], colors[2 + 3]); // Second and third
        score += compare(colors[2], colors[0 + 3]); // Third and first

        score /= 3; // Averages

        wrapper.style.display = 'none';
        results.style.display = 'block';
        resize(); // Fixes issue with centering

        results.style.opacity = 1;

        if (score <= 70) {
            synesthetic.style.display = 'block';
        } else {
            if (score === Infinity) {
                document.getElementById('not-reason').textContent = `The lack of natural variation in your colors indicates you don't have synesthesia.`
            }

            notSynesthetic.style.display = 'block';
        }
    }
};