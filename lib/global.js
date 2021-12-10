import { resolve } from 'path';

import FX from 'fs-extra';

import Config from '@nuogz/poseidon';
import Logger from '@nuogz/hades';

import { dirCacheLarge, dirCacheThumb, dirConfig, dirLog, dirProject } from './global.dir.js';
import Postgres from './PostgreSQL.js';

import './hack.js';


// 处理未捕获的异常Promise
process.on('unhandledRejection', (error, promise) => { G.fatal('进程', '未处理的拒绝', error); });

// 包信息
export const P = FX.readJSONSync(resolve(dirProject, 'package.json'));


const env = process.env;

// 配置
export const C = new Config(env.WM_CONFIG_TYPE ?? '$db', dirConfig);

// 日志
const optionLogger = {
	name: env.WM_LOGGER_NAME ?? C.log?.name ?? P.name,
	level: env.WM_LOGGER_LEVEL ?? C.log?.level,
	dir: env.WM_LOGGER_DIR ?? dirLog,
	option: C.log?.option
};
export const G = new Logger(optionLogger.name, optionLogger.level, optionLogger.dir, optionLogger.option);

// 进场标题
process.title = P.name;

// 数据库
export const DB = env.WM_GLOBAL_DB !== 'none' ? await new Postgres(C.$db) : null;


FX.ensureDirSync(dirCacheThumb);
FX.ensureDirSync(dirCacheLarge);
FX.ensureDirSync(C.path.save);