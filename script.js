const ghosts = [
	{ name: "Spirit", evidence: ["EMF Level 5", "Spirit Box", "Ghost Writing"], huntSanity: 50 },
	{ name: "Wraith", evidence: ["EMF Level 5", "Spirit Box", "D.O.T.S Projector"], huntSanity: 50 },
	{ name: "Phantom", evidence: ["Spirit Box", "Fingerprints", "D.O.T.S Projector"], huntSanity: 50 },
	{ name: "Poltergeist", evidence: ["Spirit Box", "Fingerprints", "Ghost Writing"], huntSanity: 50 },
	{ name: "Banshee", evidence: ["Fingerprints", "Ghost Orb", "D.O.T.S Projector"], huntSanity: 50 },
	{ name: "Jinn", evidence: ["EMF Level 5", "Fingerprints", "Freezing Temperatures"], huntSanity: 50 },
	{ name: "Mare", evidence: ["Spirit Box", "Ghost Orb", "Ghost Writing"], huntSanity: { light: 60, dark: 40 } },
	{ name: "Revenant", evidence: ["Ghost Orb", "Ghost Writing", "Freezing Temperatures"], huntSanity: 50 },
	{ name: "Shade", evidence: ["EMF Level 5", "Ghost Writing", "Freezing Temperatures"], huntSanity: 35 },
	{ name: "Demon", evidence: ["Fingerprints", "Ghost Writing", "Freezing Temperatures"], huntSanity: 70 },
	{ name: "Yurei", evidence: ["Ghost Orb", "Freezing Temperatures", "D.O.T.S Projector"], huntSanity: 50 },
	{ name: "Oni", evidence: ["EMF Level 5", "Freezing Temperatures", "D.O.T.S Projector"], huntSanity: 50 },
	{ name: "Yokai", evidence: ["Spirit Box", "Ghost Orb", "D.O.T.S Projector"], huntSanity: { voice: 80, quiet: 50 } },
	{ name: "Hantu", evidence: ["Fingerprints", "Ghost Orb", "Freezing Temperatures"], huntSanity: 50 },
	{ name: "Goryo", evidence: ["EMF Level 5", "Fingerprints", "D.O.T.S Projector"], huntSanity: 50 },
	{ name: "Myling", evidence: ["EMF Level 5", "Fingerprints", "Ghost Writing"], huntSanity: 50 },
	{ name: "Onryo", evidence: ["Spirit Box", "Ghost Orb", "Freezing Temperatures"], huntSanity: 50 },
	{ name: "The Twins", evidence: ["EMF Level 5", "Spirit Box", "Freezing Temperatures"], huntSanity: 50 },
	{ name: "Raiju", evidence: ["EMF Level 5", "Ghost Orb", "D.O.T.S Projector"], huntSanity: 50 },
	{ name: "Obake", evidence: ["EMF Level 5", "Fingerprints", "Ghost Orb"], huntSanity: 50 },
	{ name: "The Mimic", evidence: ["Spirit Box", "Fingerprints", "Freezing Temperatures"], huntSanity: "Dynamic" },
	{ name: "Moroi", evidence: ["Spirit Box", "Ghost Writing", "Freezing Temperatures"], huntSanity: "Dynamic" },
	{ name: "Deogen", evidence: ["Spirit Box", "Ghost Writing", "D.O.T.S Projector"], huntSanity: 40 },
	{ name: "Thaye", evidence: ["Ghost Orb", "Ghost Writing", "D.O.T.S Projector"], huntSanity: "Dynamic" }
];

const allEvidence = [
	"EMF Level 5", "Spirit Box", "Fingerprints", "Ghost Orb",
	"Ghost Writing", "Freezing Temperatures", "D.O.T.S Projector"
];

let includedEvidence = [];
let excludedEvidence = [];
const MAX_EVIDENCE = 3;

let airballEvent = false;
let noLightOff = false;
let noSpeedIncrease = false;

let huntSanity = null;
let currentSanity = null;

function initializeEvidenceList() {
	const evidenceList = document.getElementById('evidence-list');
	allEvidence.forEach(evidence => {
		const evidenceItem = document.createElement('div');
		evidenceItem.className = 'evidence-item';
		evidenceItem.textContent = evidence;
		evidenceItem.addEventListener('click', () => toggleEvidence(evidence, evidenceItem));
		evidenceList.appendChild(evidenceItem);
	});
}

function initializeGhostList() {
	const ghostList = document.getElementById('ghost-list');
	ghosts.forEach(ghost => {
		const ghostItem = document.createElement('div');
		ghostItem.className = 'ghost-item possible';
		ghostItem.textContent = ghost.name;
		ghostList.appendChild(ghostItem);
	});
}

function toggleEvidence(evidence, element) {
	if (includedEvidence.includes(evidence)) {
		includedEvidence = includedEvidence.filter(e => e !== evidence);
		excludedEvidence.push(evidence);
		element.classList.remove('included');
		element.classList.add('excluded');
	} else if (excludedEvidence.includes(evidence)) {
		excludedEvidence = excludedEvidence.filter(e => e !== evidence);
		element.classList.remove('excluded');
	} else {
		if (includedEvidence.length < MAX_EVIDENCE) {
			includedEvidence.push(evidence);
			element.classList.add('included');
		} else {
			alert(`You can only select up to ${MAX_EVIDENCE} pieces of evidence.`);
			return;
		}
	}
	updateGhosts();
}

function updateGhosts() {
	const ghostItems = document.querySelectorAll('.ghost-item');
	ghostItems.forEach((ghostItem, index) => {
		const ghost = ghosts[index];
		const hasAllIncludedEvidence = includedEvidence.every(e => ghost.evidence.includes(e));
		const hasNoExcludedEvidence = !excludedEvidence.some(e => ghost.evidence.includes(e));
		let isPossible = hasAllIncludedEvidence && hasNoExcludedEvidence;

		if (airballEvent && ghost.name === "Oni") {
			isPossible = false;
		}

		if (noLightOff && ghost.name === "Mare") {
			isPossible = false;
		}

		if (noSpeedIncrease && ["Deogen", "Hantu", "Thaye", "Revenant"].includes(ghost.name)) {
			isPossible = false;
		}

		if (huntSanity !== null) {
			if (typeof ghost.huntSanity === 'number') {
				isPossible = isPossible && (huntSanity <= ghost.huntSanity);
			} else if (typeof ghost.huntSanity === 'object') {
				// For Mare and Yokai
				const minSanity = Math.min(...Object.values(ghost.huntSanity));
				isPossible = isPossible && (huntSanity <= minSanity);
			} else if (ghost.huntSanity === "Dynamic") {
				// For Mimic, Moroi, and Thaye, we can't exclude based on hunt sanity
				isPossible = isPossible;
			}
		}

		if (currentSanity !== null) {
			if (ghost.name === "Demon" && currentSanity > 70) {
				isPossible = false;
			} else if (ghost.name === "Mare") {
				if (currentSanity > 60) {
					isPossible = false;
				}
			} else if (ghost.name === "Yokai") {
				if (currentSanity > 80) {
					isPossible = false;
				}
			} else if (currentSanity > 50) {
				isPossible = false;
			}
		}

		if (isPossible) {
			ghostItem.classList.remove('impossible');
			ghostItem.classList.add('possible');
		} else {
			ghostItem.classList.remove('possible');
			ghostItem.classList.add('impossible');
		}
	});
}

function initializeBehaviorOptions() {
	const airballCheckbox = document.getElementById('airball-event');
	const noLightOffCheckbox = document.getElementById('no-light-off');
	const noSpeedIncreaseCheckbox = document.getElementById('no-speed-increase');
	const huntSanityInput = document.getElementById('hunt-sanity-input');
	const currentSanityInput = document.getElementById('current-sanity-input');

	airballCheckbox.addEventListener('change', (e) => {
		airballEvent = e.target.checked;
		updateGhosts();
	});

	noLightOffCheckbox.addEventListener('change', (e) => {
		noLightOff = e.target.checked;
		updateGhosts();
	});

	noSpeedIncreaseCheckbox.addEventListener('change', (e) => {
		noSpeedIncrease = e.target.checked;
		updateGhosts();
	});

	huntSanityInput.addEventListener('input', (e) => {
		huntSanity = e.target.value ? parseInt(e.target.value) : null;
		updateGhosts();
	});

	currentSanityInput.addEventListener('input', (e) => {
		currentSanity = e.target.value ? parseInt(e.target.value) : null;
		updateGhosts();
	});
}

document.addEventListener('DOMContentLoaded', () => {
	initializeEvidenceList();
	initializeGhostList();
	initializeBehaviorOptions();
});