import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
	faHome,
	faSearch
} from '@fortawesome/free-solid-svg-icons';

// import {
// } from '@fortawesome/free-regular-svg-icons';

// import {
// } from '@fortawesome/free-brands-svg-icons';

library.add(
	faHome,
	faSearch
);

export default function({ Vue }) { Vue.component('Fa', FontAwesomeIcon); }