/* eslint-env browser */
(function () {
	'use strict';

	const preloadedImages = new Set();
	const preloaderPromises = new Map();

	window.gdqUtils = {
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
		}
	};
})();
