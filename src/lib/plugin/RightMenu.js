import { MouseMenuDirective } from '@howdyjs/mouse-menu';


export const install = function(app) {
	app.directive('menu', MouseMenuDirective);
};