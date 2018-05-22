'use strict';

let context: any;

export function get() {
	return context;
}

export function set(ctx: any) {
	context = ctx;
}
