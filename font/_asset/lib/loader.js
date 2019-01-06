export default async function(type, time = 0) {
	if(!Vue.component(type)) {
		switch (type) {
			case 'listFollow': Vue.component(`${type}_${time}`, (await System.import('../../listFollow')).default); break;
			case 'listSearch': Vue.component(`${type}_${time}`, (await System.import('../../listSearch')).default); break;
			case 'listAuthor': Vue.component(`${type}_${time}`, (await System.import('../../listAuthor')).default); break;
		}
	}
}