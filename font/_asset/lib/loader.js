export default async function(type, time = 0) {
	if(!Vue.component(type)) {
		switch (type) {
			case 'platface': Vue.component(`${type}_${time}`, (await System.import('../../plat/Face')).default); break;

			case 'center': Vue.component(`${type}_${time}`, (await System.import('../../center')).default); break;
			case 'old': Vue.component(`${type}_${time}`, (await System.import('../../old')).default); break;

			case 'listFollow': Vue.component(`${type}_${time}`, (await System.import('../../listFollow')).default); break;
		}
	}
}