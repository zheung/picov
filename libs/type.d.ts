import moment from 'moment';

declare global {
	declare namespace Desire {
		declare namespace RoutMap {
			/** 前置中间件 */
			declare const before: Function[];
			/** 后置中间件 */
			declare const after: Function[];
			/** 路由处理函数 */
			declare const routs: Function[];
			/** WebSocket路由对象 */
			declare namespace wock {
				/** WebSocket前置中间件 */
				declare const before: Function[];
				/** WebSocket后置中间件 */
				declare const after: Function[];
				/** WebSocket路由处理对象 */
				declare const routs: Function[];
			};
		};

		declare namespace $ {
			/** 时间处理库`Moment` */
			declare const M = moment;
			/** 海港函数（启动应用） */
			declare function Harb(): void;

			/** 路由参数（由用户指定） */
			declare let RoutMap = Desire.RoutMap;
		};
	};
};