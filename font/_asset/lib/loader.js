export default async function(type, time = 0) {
	if(!Vue.component(type)) {
		switch (type) {
			case 'listFollow': Vue.component(`${type}_${time}`, (await import('../../listFollow')).default); break;
			case 'listSearch': Vue.component(`${type}_${time}`, (await import('../../listSearch')).default); break;
			case 'listAuthor': Vue.component(`${type}_${time}`, (await import('../../listAuthor')).default); break;
			case 'listNumber': Vue.component(`${type}_${time}`, (await import('../../listNumber')).default); break;
			case 'viewIllust': Vue.component(`${type}_${time}`, (await import('../../viewIllust')).default); break;
		}
	}
}