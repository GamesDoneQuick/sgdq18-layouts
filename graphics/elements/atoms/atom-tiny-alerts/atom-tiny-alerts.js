/* global Random */
(function () {
	'use strict';

	/**
	 * @customElement
	 * @polymer
	 */
	class AtomTinyAlerts extends Polymer.Element {
		static get is() {
			return 'atom-tiny-alerts';
		}

		static get properties() {
			return {};
		}

		addAlert({text, textColor = 'black', backgroundColor = 'white', holdDuration = 0.067}) {
			const div = document.createElement('div');
			div.classList.add('alert');
			div.innerText = text;
			div.style.color = textColor;
			div.style.backgroundColor = backgroundColor;

			this.shadowRoot.appendChild(div);
			div.style.left = `${randomInt(0, this.clientWidth - div.clientWidth)}px`;
			div.style.bottom = `${randomInt(2, 8)}px`;

			const tl = new TimelineLite();

			tl.to(div, 0.1834, {
				clipPath: 'inset(0 0%)',
				ease: Power1.easeIn
			});

			tl.addLabel('exit', holdDuration);
			tl.to(div, 0.934, {
				y: -21,
				ease: Power1.easeIn
			}, 'exit');
			tl.to(div, 0.5167, {
				opacity: 0,
				ease: Power1.easeIn
			}, 'exit+=0.4167');

			tl.call(() => {
				div.remove();
			});
		}
	}

	customElements.define(AtomTinyAlerts.is, AtomTinyAlerts);

	/**
	 * Generates a random integer.
	 * @param {Number} min - The minimum number, inclusive.
	 * @param {Number} max - The maximmum number, inclusive.
	 * @returns {Number} - A random number between min and max, inclusive.
	 */
	function randomInt(min, max) {
		return Random.integer(min, max)(Random.engines.browserCrypto);
	}
})();
