import FX from 'fs-extra';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';


export const dirLib = dirname(fileURLToPath(import.meta.url));
export const dirProject = resolve(dirLib, '..');

export const dirConfig = resolve(dirProject, 'config');
export const dirLog = resolve(dirProject, 'log');

export const dirCache = resolve(dirProject, 'cache');
export const dirCacheThumb = resolve(dirCache, 'thumb');


FX.ensureDirSync(dirCacheThumb);