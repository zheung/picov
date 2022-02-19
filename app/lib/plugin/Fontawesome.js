import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faSearch,
	faAngleLeft,
	faAngleRight,
	faAngleDoubleLeft,
	faAngleDoubleRight,
	faCompass,
	faBookOpen,
	faDownload,
	faHouseUser,
	faVideo,
	faUserEdit,
	faHome,
	faPaintBrush,
	faSave,
	faUserCheck,
	faUserPlus,
	faTimesCircle,
	faCheckCircle,
	faHdd,
	faSync,
	faStream,
	faBookmark,
	faImages,
} from '@fortawesome/free-solid-svg-icons';
// import { fas } from '@fortawesome/free-solid-svg-icons';
// import { far } from '@fortawesome/free-regular-svg-icons';
// import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export const install = function(app) {
	// library.add(fas);
	// library.add(far);
	library.add(faSearch);
	library.add(faAngleLeft);
	library.add(faAngleRight);
	library.add(faAngleDoubleLeft);
	library.add(faAngleDoubleRight);
	library.add(faCompass);
	library.add(faBookOpen);
	library.add(faDownload);
	library.add(faHouseUser);
	library.add(faVideo);
	library.add(faUserEdit);
	library.add(faHome);
	library.add(faPaintBrush);
	library.add(faSave);
	library.add(faUserCheck);
	library.add(faUserPlus);
	library.add(faTimesCircle);
	library.add(faCheckCircle);
	library.add(faHdd);
	library.add(faSync);
	library.add(faStream);
	library.add(faBookmark);
	library.add(faImages);


	app.component('Fas', FontAwesomeIcon);
};