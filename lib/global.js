import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import './hack.js';

import Config from '@nuogz/poseidon';
import Logger from '@nuogz/hades';
import Postgre from './Postgres.js';


process.title = 'picov';
// eslint-disable-next-line no-unused-vars, no-debugger
process.on('unhandledRejection', (error, promise) => { G.fatal('进程', '未处理的拒绝', error); debugger; });


export const dirLib = dirname(fileURLToPath(import.meta.url));
export const dirProject = resolve(dirLib, '..');

export const dirConfig = resolve(dirProject, 'config');
export const dirLog = resolve(dirProject, 'log');

export const C = new Config('$db', dirConfig);
export const G = new Logger(C.log.name, C.log.level, dirLog, C.log.option);
export const DB = await new Postgre(C.$db);