import initFontawesome from './fontawesome';

import moment from 'moment';
moment.locale('zh-cn');

export default function() {
	window.moment = moment;

	initFontawesome();
}