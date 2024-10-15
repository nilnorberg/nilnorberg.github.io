const FONT = 'Slant';

// Dependencies
figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });

// Obfuscated Email
const obfuscatedEmail = "cmhvZG9waWFuQHByb3Rvbm1haWwuY29t"; // Base64 encoded email

// Decode Base64 encoded email
function decodeEmail(encodedEmail) {
    return atob(encodedEmail);
}

// Nostr Key
const nostrPublicKey = 'npub16gsqs348zdg7r3pjg9t32nm66cwa6r9ucazqk7ku40nw4s57l34snjwtpp'

// Commands
const commands = {
    about: () => {
      term.echo("The best way I can describe myself is that I'm an engineer at heart. I thrive on finding innovative solutions to complex challenges, blending my background in Industrial Engineering with a minor degree in Computer Science. My primary areas of interest include machine learning, customer experience, explainable AI, differential privacy, and decentralization.");
      term.echo("\nIn my free time, I enjoy experimenting with new ideas to develop digital solutions focused on data privacy and decentralization.");
    },
    github: () => {
        window.open("https://github.com/nileceozturk");
    },
    linkedin: () => {
        window.open("https://www.linkedin.com/in/nileceozturk/")
    },
    mail: () => {
        const email = decodeEmail(obfuscatedEmail);
        term.echo(`${email}`);
    },
    nostr: () => {
        term.echo("A quick introduction to what's Nostr: ");
        term.echo("https://nostr.com/#what-is-nostr");
        term.echo(`Public Key: ${nostrPublicKey}`);
    }
};

const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction'
});

const command_list = Object.keys(commands);
const formatted_list = command_list.map(cmd => {
    return `<white class="command">${cmd}</white>`;
});
const help = formatter.format(formatted_list);

const re = new RegExp(`^\s*(${command_list.join('|')})(\s?.*)`);

$.terminal.new_formatter([re, function(_, command, args) {
    return `${command}${args}`;
}]);

// Terminal Setup
const term = $('#terminal').terminal(commands, {
    greetings: false,
    checkArity: false,
    exit: false,
    completion: true
});

// Pause the terminal
term.pause();

// Helper Functions for Greetings
function render(text) {
    const cols = term.cols();
    return trim(figlet.textSync(text, {
        font: FONT,
        width: cols,
        whitespaceBreak: true
    }));
}

function trim(str) {
    return str.replace(/[\n\s]+$/, '');
}

function rainbow(string) {
    return lolcat.rainbow(function(char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
    }, string).join('\n');
}

function hex(color) {
    return '#' + [color.red, color.green, color.blue].map(n => {
        return n.toString(16).padStart(2, '0');
    }).join('');
}

// Animation
function gaussian(x, mean, variance) {
    return (1 / (Math.sqrt(2 * Math.PI * variance))) * Math.exp(-(Math.pow(x - mean, 2)) / (2 * variance));
}

// Function to create a gradient color effect
function getGradientColor(percentage) {
    const colors = ['#FF5733', '#FFBD33', '#33FF57', '#33FFBD', '#3357FF'];
    const index = Math.floor(percentage * (colors.length - 1));
    return colors[index];
}

// Function to draw a complex horizontal Gaussian graph
function drawComplexGaussian(distributions) {
    const cols = 200; // Width of the graph
    const rows = 40; // Height of the graph
    const rangeX = Array.from({ length: cols }, (_, i) => i - cols / 2);

    // Initialize a blank grid
    let grid = Array(rows).fill('').map(() => Array(cols).fill(' '));

    // Plot each Gaussian distribution with different colors and effects
    distributions.forEach(({ mean, variance, peak, color, symbols }) => {
        rangeX.forEach((x, colIdx) => {
            const y = gaussian(x, mean, variance) * peak;
            const scaledY = Math.floor(y * rows * 2); // Scale to fit within graph height
            const rowIdx = rows - scaledY - 1;

            if (rowIdx >= 0 && rowIdx < rows) {
                const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                grid[rowIdx][colIdx] = `<span style="color:${color}">${symbol}</span>`;
            }
        });
    });

    return grid.map(row => row.join('')).join('\n');
}

// Generate multiple Gaussian distributions with dynamic properties and colors
let distributions = [
    { mean: 0, variance: 30, peak: 3, color: getGradientColor(0), symbols: ['*', '.', '+', '#'] },
    { mean: 50, variance: 20, peak: 3, color: getGradientColor(0.5), symbols: ['*', '.', '+', '#'] },
    { mean: -50, variance: 25, peak: 3, color: getGradientColor(1), symbols: ['*', '.', '+', '#'] }
];

// Function to update the distributions' properties dynamically with creative effects
function updateDistributions() {
    distributions.forEach((dist, index) => {
        // Create oscillating effects with dynamic changes
        dist.mean += Math.sin(Date.now() / (500 + index * 200)) * 10;
        dist.variance = 20 + Math.sin(Date.now() / (1000 + index * 300)) * 15;
        dist.peak = 3 + Math.sin(Date.now() / (1500 + index * 500)) * 2;
        dist.color = getGradientColor((Math.sin(Date.now() / 1000) + 1) / 2);
    });
}

function animateCreativeGaussian() {
    const animationElement = document.getElementById('animation');
    updateDistributions();
    animationElement.innerHTML = drawComplexGaussian(distributions);

    // Continue the animation
    setTimeout(animateCreativeGaussian, 120);
}

// Initialization
function ready() {
    term.echo(() => rainbow(render('Nil Ece Ö.')))
        .echo('\nWelcome to my personal webpage\n')
        .echo('<span class="command" style="color: blue;">about</span> | <span class="command" style="color: blue;">linkedin</span> | <span class="command" style="color: blue;">github</span> | <span class="command" style="color: blue;">mail</span> | <span class="command" style="color: blue;">github</span> | <span class="command" style="color: green;">nostr</span>', { raw: true })
        .resume();

    term.exec('about');

    term.on('click', '.command', function() {
        const command = $(this).text();
        term.exec(command);
    });
}

figlet.preloadFonts([FONT], ready);

// Start the animation
animateCreativeGaussian();