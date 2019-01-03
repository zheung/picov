

import initBus from '../lib/bus';
import initComp from '../lib/comp';

import Loader from './loader';

import initConnect from './connect';

import initWock from './wock';

export default function() {
	window.L = (0 || console).log;

	initBus();
	initComp();
	initConnect();
	initWock();

	return {
		Loader
	};
}