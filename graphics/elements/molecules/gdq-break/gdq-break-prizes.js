/* global GdqBreakLoop */
(function () {
	'use strict';

	const EMPTY_OBJ = {};
	const DISPLAY_DURATION = nodecg.bundleConfig.displayDuration;

	const currentPrizes = nodecg.Replicant('currentPrizes');

	/**
	 * @customElement
	 * @polymer
	 */
	class GdqBreakPrizes extends GdqBreakLoop {
		static get is() {
			return 'gdq-break-prizes';
		}

		static get properties() {
			return {
				importPath: String // https://github.com/Polymer/polymer-linter/issues/71
			};
		}

		ready() {
			super.ready();

			currentPrizes.on('change', newVal => {
				this.availableItems = newVal;
			});
		}

		/**
		 * Plays the entrance animation and kicks off the infinite loop of
		 * showing all available prizes, one at a time.
		 * @returns {TimelineLite} - A GSAP TimelineLite instance.
		 */
		show() {
			const tl = new TimelineLite();

			tl.call(() => {
				// Clear all content.
				this.$['info-description-text'].innerText = '';
				this.$['info-minimumBid-text'].innerText = '';
				this.$.provider.innerText = '';
				this.$['photo-actual'].$svg.image.load('');
			}, null, null, '+=0.03');

			tl.addLabel('start');

			tl.to(this.$['photo-actual'].$svg.bgRect.node, 1.5, {
				drawSVG: '100%',
				ease: Power2.easeOut
			}, 'start');

			tl.to(this.$.info, 1, {
				x: '0%',
				ease: Power2.easeOut
			}, 'start+=0.5');

			tl.to(this.$['photo-label'], 0.5, {
				opacity: 1,
				x: 0,
				ease: Sine.easeOut
			}, 'start+=1');

			tl.to(this.$['photo-actual'].$svg.bgRect.node, 0.5, {
				'fill-opacity': 0.25,
				ease: Sine.easeOut
			}, 'start+=1');

			tl.call(() => {
				// Re-start the loop once we've finished entering.
				this._loop();
			});

			return tl;
		}

		/**
		 * Plays the exit animation and kills the current loop of prize displaying.
		 * This animation has a variable length due to it needing to wait for the current
		 * loop to be at a good stopping point before beginning the exit animation.
		 * @returns {TimelineLite} - A GSAP TimelineLite instance.
		 */
		hide() {
			const tl = new TimelineLite();

			let handledCall = false; // GSAP likes to run .calls again when you .resume
			tl.call(() => {
				if (handledCall) {
					return;
				}
				handledCall = true;

				tl.pause();
				if (this.$['photo-actual'].exiting) {
					this.$['photo-actual'].addEventListener('exited', () => {
						this._killLoop();
						tl.resume();
					}, {once: true, passive: true});
				} else if (this.$['photo-actual'].entering) {
					this.$['photo-actual'].addEventListener('entered', () => {
						this._killLoop();
						this.$['photo-actual'].exit({
							onComplete: () => {
								tl.resume();
							}
						});
					}, {once: true, passive: true});
				} else {
					this._killLoop();
					this.$['photo-actual'].exit({
						onComplete: () => {
							tl.resume();
						}
					});
				}
			}, null, null, '+=0.1');

			tl.addLabel('start', '+=0.5');

			tl.call(() => {
				this.currentItem = null;
			}, null, null, 'start');

			tl.to(this.$['photo-actual'].$svg.bgRect.node, 0.5, {
				'fill-opacity': 0,
				ease: Sine.easeIn
			}, 'start');

			tl.to(this.$['photo-label'], 0.5, {
				opacity: 0,
				x: -50,
				ease: Sine.easeIn
			}, 'start');

			tl.to(this.$.info, 1, {
				x: '-100%',
				ease: Power2.easeIn
			}, 'start');

			tl.to(this.$['photo-actual'].$svg.bgRect.node, 1.5, {
				drawSVG: '0%',
				ease: Power2.easeIn
			}, 'start');

			return tl;
		}

		_showItem(prize) {
			let useFallbackImage = !prize.image.trim();
			let changingProvider = true;
			let changingMinimumBid = true;
			const tl = new TimelineLite();
			const minimumBidText = prize.sumdonations ?
				`${prize.minimumbid} in Total Donations` :
				`${prize.minimumbid} Single Donation`;

			tl.call(() => {
				tl.pause();
				gdqUtils.preloadImage(prize.image).then(() => {
					tl.resume();
				}).catch(() => {
					nodecg.log.error(`Image "${prize.image}" failed to load for prize #${prize.id}.`);
					useFallbackImage = true;
					tl.resume();
				});
			}, null, null, '+=0.03');

			tl.addLabel('exit');

			tl.add(this.$['photo-actual'].exit({
				onComplete: () => {
					const newSrc = useFallbackImage ? this.$['photo-actual'].fallbackSrc : prize.image;
					tl.pause();
					this.$['photo-actual'].$svg.image.load(newSrc).loaded(() => {
						tl.resume();
					}).error(error => {
						nodecg.log.error(error);
						this.$['photo-actual'].$svg.image.load(this.$['photo-actual'].fallbackSrc);
						tl.resume();
					});
				}
			}), 'exit');

			tl.call(() => {
				if (!this.$.provider.innerText && !this.$['info-description-text'].innerText) {
					return;
				}

				changingProvider = false;
				if (this.$.provider.innerText.trim() !== prize.provided) {
					changingProvider = true;
					TweenLite.to(this.$.provider, 0.5, {
						opacity: 0,
						ease: Sine.easeInOut
					});
				}

				changingMinimumBid = false;
				if (this.$['info-minimumBid-text'].innerText.trim() !== minimumBidText) {
					changingMinimumBid = true;
					TweenLite.to(this.$['info-minimumBid-text'], 0.5, {opacity: 0, ease: Sine.easeInOut});
				}

				TweenLite.to(this.$['info-description-text'], 0.5, {
					opacity: 0,
					ease: Sine.easeInOut
				});
			}, null, null, 'exit+=0.1');

			tl.addLabel('enter');

			tl.call(() => {
				if (!changingProvider) {
					return;
				}

				this.$.provider.innerText = prize.provided;
				TypeAnims.type(this.$.provider);
				TweenLite.set(this.$.provider, {opacity: 1});
			}, null, null, 'enter+=0.03');

			tl.add(this.$['photo-actual'].enter(), 'enter+=0.1');

			tl.call(() => {
				this.$['info-description-text'].innerText = prize.description;
				TypeAnims.type(this.$['info-description-text']);
				TweenLite.set(this.$['info-description-text'], {opacity: 1});
			}, null, null, 'enter+=0.2');

			tl.call(() => {
				if (!changingMinimumBid) {
					return;
				}

				this.$['info-minimumBid-text'].innerText = minimumBidText;
				TypeAnims.type(this.$['info-minimumBid-text']);
				TweenLite.set(this.$['info-minimumBid-text'], {opacity: 1});
			}, null, null, 'enter+=0.3');

			// Give the prize some time to show.
			tl.to(EMPTY_OBJ, DISPLAY_DURATION, EMPTY_OBJ);

			return tl;
		}

		_resetState() {
			this.$['photo-actual'].exiting = false;
		}
	}

	customElements.define(GdqBreakPrizes.is, GdqBreakPrizes);
})();
