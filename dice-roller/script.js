/*
 * Yahtzee Dice Roller — random numbers and the read-only result fields.
 *
 * AI use: Claude (Opus 5) wrote this file, including the Math.random() dice rolls, the
 * Yahtzee combination detection in describeRoll(), and the start-up handshake that falls
 * back to the flat CSS dice when dice3d.js cannot load; reviewed and edited by hand.
 *
 * Owns the random numbers and the read-only result fields. The 3D tumble is
 * optional: if dice3d.js (Three.js + Rapier) loads, it plays the roll; if it
 * cannot load, the flat CSS dice are used instead and everything still works.
 */

'use strict';

var NUMBER_OF_DICE = 5;
var SIDES_PER_DIE = 6;
var LOAD_TIMEOUT_MS = 9000;
var ROLL_TIMEOUT_MS = 12000;

var rollCount = 0;
var renderer3d = null;
var isRolling = false;
var bootTimer = null;
var watchdog = null;

/* Pip layout for the flat CSS dice, using CSS grid position classes. */
var PIP_LAYOUTS = {
	1: ['p-mc'],
	2: ['p-tl', 'p-br'],
	3: ['p-tl', 'p-mc', 'p-br'],
	4: ['p-tl', 'p-tr', 'p-bl', 'p-br'],
	5: ['p-tl', 'p-tr', 'p-mc', 'p-bl', 'p-br'],
	6: ['p-tl', 'p-tr', 'p-ml', 'p-mr', 'p-bl', 'p-br']
};

/**
 * Returns a random whole number from 1 through SIDES_PER_DIE.
 */
function rollOneDie() {
	return Math.floor(Math.random() * SIDES_PER_DIE) + 1;
}

/**
 * Draws the pips for one of the flat fallback dice.
 */
function drawFace(faceElement, value) {
	faceElement.innerHTML = '';
	PIP_LAYOUTS[value].forEach(function (positionClass) {
		var pip = document.createElement('span');
		pip.className = 'pip ' + positionClass;
		faceElement.appendChild(pip);
	});

	faceElement.classList.remove('rolling');
	void faceElement.offsetWidth;
	faceElement.classList.add('rolling');
}

/**
 * Describes any notable Yahtzee combination in the current roll.
 */
function describeRoll(values) {
	var counts = {};
	values.forEach(function (value) {
		counts[value] = (counts[value] || 0) + 1;
	});

	var tallies = Object.keys(counts).map(function (key) {
		return counts[key];
	}).sort(function (a, b) {
		return b - a;
	});

	var sorted = values.slice().sort(function (a, b) {
		return a - b;
	}).join('');

	if (tallies[0] === 5) {
		return 'YAHTZEE! All five dice match.';
	}
	if (tallies[0] === 4) {
		return 'Four of a kind!';
	}
	if (tallies[0] === 3 && tallies[1] === 2) {
		return 'Full house!';
	}
	if (sorted === '12345' || sorted === '23456') {
		return 'Large straight!';
	}
	if (tallies[0] === 3) {
		return 'Three of a kind.';
	}
	return '';
}

/**
 * Shows a line under the dice. `isResult` marks a named Yahtzee combination, which is
 * the only case that earns the badge treatment; progress messages stay plain.
 */
function setCallout(text, isResult) {
	var callout = document.getElementById('callout');
	callout.textContent = text || '\u00A0';
	callout.classList.toggle('has-result', Boolean(isResult) && Boolean(text));
}

function setBusy(busy) {
	var button = document.getElementById('rollButton');
	button.disabled = busy;
	button.textContent = busy ? 'Rolling\u2026' : 'Roll Dice';
	if (!busy) {
		button.focus();
	}
}

/**
 * Writes one number into its read-only field and replays the highlight animation.
 * Removing the class and reading offsetWidth forces the restart.
 */
function flashValue(field, value) {
	field.value = value;
	field.classList.remove('updated');
	void field.offsetWidth;
	field.classList.add('updated');
}

/**
 * Writes the finished roll into the read-only fields.
 */
function reveal(values) {
	var total = 0;

	values.forEach(function (value, i) {
		total += value;
		flashValue(document.getElementById('die' + (i + 1)), value);
	});

	rollCount += 1;
	flashValue(document.getElementById('total'), total);
	flashValue(document.getElementById('highest'), Math.max.apply(null, values));
	flashValue(document.getElementById('rollCount'), rollCount);
	setCallout(describeRoll(values), true);
}

/**
 * Rolls all five dice. The numbers are decided here, up front; the 3D scene
 * is told which faces it has to land on.
 */
function rollDice() {
	if (isRolling) {
		return;
	}

	var values = [];
	for (var i = 0; i < NUMBER_OF_DICE; i++) {
		values.push(rollOneDie());
	}

	if (renderer3d) {
		isRolling = true;
		setBusy(true);
		setCallout('Rolling\u2026');
		var finish = function () {
			if (!isRolling) {
				return;
			}
			window.clearTimeout(watchdog);
			watchdog = null;
			isRolling = false;
			setBusy(false);
			reveal(values);
		};

		/* The animation is driven by requestAnimationFrame, which browsers pause
			 in a hidden tab. This guarantees the result still appears. */
		watchdog = window.setTimeout(finish, ROLL_TIMEOUT_MS);
		renderer3d.roll(values, finish);
		return;
	}

	values.forEach(function (value, index) {
		drawFace(document.getElementById('face' + (index + 1)), value);
	});
	reveal(values);
}

/* ------------------------------------------------- start-up coordination */

function supportsModules() {
	return 'noModule' in HTMLScriptElement.prototype;
}

/**
 * Called from <body onload>. Rolls straight away on browsers that cannot run
 * the 3D module; otherwise waits briefly for Three.js and Rapier to arrive so
 * the first roll is the animated one.
 */
function startApp() {
	if (!supportsModules()) {
		rollDice();
		return;
	}

	setCallout('Loading 3D dice\u2026');
	bootTimer = window.setTimeout(function () {
		bootTimer = null;
		fallbackTo2D();
	}, LOAD_TIMEOUT_MS);
}

/** The 3D renderer is ready - take it over and roll. */
function use3D(api) {
	if (bootTimer) {
		window.clearTimeout(bootTimer);
		bootTimer = null;
	}
	renderer3d = api;
	window.DiceApp.renderer3d = api;   /* handy for debugging in the console */
	rollDice();
}

/** Three.js or Rapier could not load: use the flat CSS dice. */
function fallbackTo2D() {
	if (bootTimer) {
		window.clearTimeout(bootTimer);
		bootTimer = null;
	}
	if (renderer3d) {
		return;
	}
	document.body.classList.remove('has-3d');
	var stage = document.getElementById('stage');
	if (stage) {
		stage.hidden = true;
	}
	rollDice();
}

window.DiceApp = {
	use3D: use3D,
	fallbackTo2D: fallbackTo2D
};
