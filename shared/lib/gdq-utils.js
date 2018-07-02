/* eslint-env browser */
(function (root, factory) { // eslint-disable-line wrap-iife
	if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.gdqUtils = factory();
	}
}(typeof self === 'undefined' ? this : self, () => {
	'use strict';

	const GAME_SCENE_NAME_REGEX = /^(Standard|Widescreen|GBA|Gameboy|3DS|DS|LttP|OoT|Mario)/;

	const preloadedImages = new Set();
	const preloaderPromises = new Map();

	const gdqUtils = {
		/**
		 * Preloads an image.
		 * @param {string} src - The URL of the new image to load.
		 * @returns {Promise} - A promise that is resolved if the load succeeds, and rejected it the load fails.
		 */
		preloadImage(src) {
			if (preloadedImages.has(src)) {
				return Promise.resolve();
			}

			if (preloaderPromises.has(src)) {
				return preloaderPromises.get(src);
			}

			const preloadPromise = new Promise((resolve, reject) => {
				if (!src) {
					resolve();
					return;
				}

				const preloader = document.createElement('img');
				preloader.style.position = 'absolute';
				preloader.style.bottom = '0';
				preloader.style.left = '0';
				preloader.style.width = '1px';
				preloader.style.height = '1px';
				preloader.style.opacity = '0.01';

				const listeners = {
					load: null,
					error: null
				};

				listeners.load = function (event) {
					event.target.removeEventListener('error', listeners.error);
					event.target.removeEventListener('load', listeners.load);
					preloadedImages.add(src);
					resolve();
				};

				listeners.error = function (event) {
					event.target.removeEventListener('error', listeners.error);
					event.target.removeEventListener('load', listeners.load);
					reject(new Error(`Image failed to load: ${src}`));
				};

				preloader.addEventListener('load', listeners.load);
				preloader.addEventListener('error', listeners.error);

				preloader.src = src;
			});

			preloaderPromises.set(src, preloadPromise);
			return preloadPromise;
		},

		isGameScene(sceneName) {
			if (!sceneName) {
				return false;
			}

			return Boolean(sceneName.match(GAME_SCENE_NAME_REGEX));
		}
	};

	return gdqUtils;
}));
