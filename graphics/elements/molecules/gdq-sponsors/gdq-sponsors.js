/* global GdqBreakLoop */
(function () {
	'use strict';

	const DISPLAY_DURATION = 45;
	const EMPTY_OBJ = {};

	class GdqSponsors extends GdqBreakLoop {
		static get is() {
			return 'gdq-sponsors';
		}

		ready() {
			this.itemIdField = 'sum';
			this.noAutoLoop = true;
			super.ready();

			let sponsors;
			const layoutName = window.location.pathname.split('/').pop();
			switch (layoutName) {
				case ('widescreen_1.html'):
				case ('gba_1.html'):
					sponsors = nodecg.Replicant('assets:sponsors-widescreen_1');
					break;
				default:
					sponsors = nodecg.Replicant('assets:sponsors-standard_1');
					break;
			}

			Polymer.RenderStatus.beforeNextRender(this, () => {
				sponsors.on('change', newVal => {
					this.availableItems = newVal;

					// If no sponsor is showing yet, show the first sponsor immediately
					if (!this.currentItem && newVal.length > 0) {
						this.currentItem = newVal[0];
						this.$.image.$svg.image.load(newVal[0].url);
					}
				});

				this._loop();
			});
		}

		show() {
			const tl = new TimelineLite();

			tl.call(() => {
				// Clear all content.
				this.$.image.$svg.image.load('');
			}, null, null, '+=0.03');

			tl.to(this, 0.334, {
				opacity: 1,
				ease: Power1.easeIn
			});

			tl.call(() => {
				// Re-start the loop once we've finished entering.
				this._loop();
			});

			return tl;
		}

		hide() {
			const tl = new TimelineLite();

			tl.call(() => {
				tl.pause();
				if (this.$.image.exiting) {
					this.$.image.addEventListener('exited', () => {
						this._killLoop();
						tl.resume();
					}, {once: true, passive: true});
				} else if (this.$.image.entering) {
					this.$.image.addEventListener('entered', () => {
						this._killLoop();
						this.$.image.exit({
							onComplete: () => {
								tl.resume();
							}
						});
					}, {once: true, passive: true});
				} else {
					this._killLoop();
					this.$.image.exit({
						onComplete: () => {
							tl.resume();
						}
					});
				}
			}, null, null, '+=0.1');

			tl.to(this, 0.334, {
				opacity: 0,
				ease: Power1.easeOut
			});

			return tl;
		}

		resize() {
			this.$.image.resize();
		}

		_showItem(sponsorAsset) {
			const tl = new TimelineLite();

			tl.addLabel('exit');

			tl.add(this.$.image.exit({
				onComplete: () => {
					const newSrc = sponsorAsset.url;
					tl.pause();
					this.$.image.$svg.image.load(newSrc).loaded(() => {
						tl.resume();
					}).error(error => {
						nodecg.log.error('Failed to load sponsor image:', error);
						TweenLite.set(this.$.image, {opacity: 0});
						tl.clear();
						this._loop();
					});
				}
			}), 'exit');

			tl.addLabel('enter');
			tl.set(this.$.image, {opacity: 1});
			tl.add(this.$.image.enter(), 'enter+=0.1');

			// Give the prize some time to show.
			tl.to(EMPTY_OBJ, DISPLAY_DURATION, EMPTY_OBJ);

			return tl;
		}
	}

	customElements.define(GdqSponsors.is, GdqSponsors);
})();
