/*
 * Dog Breed Slideshow
 *
 * AI use: Claude (Opus 5) wrote this file following the fetch / promise / async-await
 * approach taught in Brad Schiff's tutorial "Dogs, JavaScript & An API"; the structure and
 * error-handling pattern are his, reviewed and edited by hand.
 */

'use strict';

const breedListUrl = 'https://dog.ceo/api/breeds/list/all';
const breedImagesUrlPrefix = 'https://dog.ceo/api/breed/';
const breedImagesUrlSuffix = '/images';

let breedImageUrls = [];
let currentImageIndex = 0;

const breedSelect = document.getElementById('breedSelect');
/*
 * Built here rather than in the markup: an <img> must carry a non-empty src to be valid
 * HTML, and there is no image to point at until a breed has been chosen.
 */
const breedImage = document.createElement('img');
breedImage.id = 'breedImage';
breedImage.alt = '';
breedImage.hidden = true;
document.getElementById('viewer').appendChild(breedImage);
const statusMessage = document.getElementById('statusMessage');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');

/*
 * The two endpoints wrap their payload differently: the breed list returns an object keyed by
 * breed name, while the images endpoint returns a plain array of URLs. Both arrive under the
 * same "message" property, so each response has to be read on its own terms.
 */

async function loadBreedList() {
	try {
		const response = await fetch(breedListUrl);
		if (!response.ok) {
			throw new Error('Breed list request failed with status ' + response.status);
		}

		const data = await response.json();
		const breedNames = Object.keys(data.message).sort();

		breedSelect.innerHTML = '';
		breedSelect.appendChild(createOption('', 'Select a breed…'));
		breedNames.forEach(function (breedName) {
			breedSelect.appendChild(createOption(breedName, capitalize(breedName)));
		});

		statusMessage.textContent = 'Choose a breed to begin.';
	} catch (error) {
		console.error(error);
		breedSelect.innerHTML = '';
		breedSelect.appendChild(createOption('', 'Breeds unavailable'));
		statusMessage.textContent =
			'Couldn’t load the breed list. Check your connection and reload.';
	}
}

async function loadBreedImages(breedName) {
	setControlsEnabled(false);
	breedImage.hidden = true;
	statusMessage.textContent = 'Loading photos…';

	try {
		const response = await fetch(breedImagesUrlPrefix + breedName + breedImagesUrlSuffix);
		if (!response.ok) {
			throw new Error('Image request failed with status ' + response.status);
		}

		const data = await response.json();
		breedImageUrls = data.message;
		currentImageIndex = 0;

		if (breedImageUrls.length === 0) {
			statusMessage.textContent = 'No photos were returned for that breed.';
			return;
		}

		showCurrentImage();
		setControlsEnabled(true);
	} catch (error) {
		console.error(error);
		breedImageUrls = [];
		statusMessage.textContent = 'Couldn’t load photos for that breed. Please try again.';
	}
}

function showCurrentImage() {
	const breedName = breedSelect.value;

	breedImage.src = breedImageUrls[currentImageIndex];
	breedImage.alt = 'Photo of a ' + breedName;
	breedImage.hidden = false;

	statusMessage.textContent = 'Image ' + (currentImageIndex + 1) + ' of ' +
		breedImageUrls.length + ' — ' + capitalize(breedName);
}

function showNextImage() {
	currentImageIndex = (currentImageIndex + 1) % breedImageUrls.length;
	showCurrentImage();
}

function showPreviousImage() {
	currentImageIndex = currentImageIndex === 0 ? breedImageUrls.length - 1 : currentImageIndex - 1;
	showCurrentImage();
}

function createOption(optionValue, optionLabel) {
	const option = document.createElement('option');
	option.value = optionValue;
	option.textContent = optionLabel;
	return option;
}

/* Breed names arrive from the API in lower case, so they are capitalized for display only. */
function capitalize(breedName) {
	return breedName.charAt(0).toUpperCase() + breedName.slice(1);
}

function setControlsEnabled(isEnabled) {
	previousButton.disabled = !isEnabled;
	nextButton.disabled = !isEnabled;
}

breedSelect.addEventListener('change', function () {
	if (breedSelect.value === '') {
		breedImage.hidden = true;
		setControlsEnabled(false);
		statusMessage.textContent = 'Choose a breed to begin.';
		return;
	}

	loadBreedImages(breedSelect.value);
});

previousButton.addEventListener('click', showPreviousImage);
nextButton.addEventListener('click', showNextImage);

loadBreedList();
