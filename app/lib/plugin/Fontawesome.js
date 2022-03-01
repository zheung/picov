import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faAngleDoubleLeft,
	faAngleDoubleRight,
	faAngleLeft,
	faAngleRight,
	faBookmark,
	faBookOpen,
	faCheckCircle,
	faCompass,
	faDownload,
	faHdd,
	faHome,
	faHouseUser,
	faImages,
	faPaintBrush,
	faSave,
	faSearch,
	faStream,
	faSync,
	faTimesCircle,
	faUser,
	faUserCheck,
	faUserEdit,
	faUserPlus,
	faVideo,
} from '@fortawesome/free-solid-svg-icons';
// import { fas } from '@fortawesome/free-solid-svg-icons';
// import { far } from '@fortawesome/free-regular-svg-icons';
// import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export const install = function(app) {
	// library.add(fas);
	// library.add(far);


	library.add(faAngleDoubleLeft);
	library.add(faAngleDoubleRight);
	library.add(faAngleLeft);
	library.add(faAngleRight);
	library.add(faBookmark);
	library.add(faBookOpen);
	library.add(faCheckCircle);
	library.add(faCompass);
	library.add(faDownload);
	library.add(faHdd);
	library.add(faHome);
	library.add(faHouseUser);
	library.add(faImages);
	library.add(faPaintBrush);
	library.add(faSave);
	library.add(faSearch);
	library.add(faStream);
	library.add(faSync);
	library.add(faTimesCircle);
	library.add(faUser);
	library.add(faUserCheck);
	library.add(faUserEdit);
	library.add(faUserPlus);
	library.add(faVideo);


	app.component('Fas', FontAwesomeIcon);
};