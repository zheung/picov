import AS from 'assert';
import { resolve } from 'path';

import { copySync, ensureDirSync, moveSync } from 'fs-extra/esm';



/**
 * @typedef {Object} KeepIllustLocalParam
 * @property {string} file 文件名
 * @property {string} dir 目标目录
 * @property {boolean} isCopy
 * - `true` 复制文件
 * - `false` 移动文件
 */
/**
 * @callback KeepIllustLocalHandle
 * @param {KeepIllustLocalParam & import('../../lib/mare/parse-profile.mare.lib.js').HandleRaw} raw
 */


export const method = 'post';
export const parseProfile = true;
/** @type {KeepIllustLocalHandle} */
export const handle = ({ file, dir, isCopy, $profile }) => {
	AS(file, `无效~[文件]~{${file}}`);
	AS(dir, `无效~[文件夹]~{${dir}}`);


	ensureDirSync(dir);

	(isCopy ? copySync : moveSync)(
		resolve($profile.dir.illustPrepare, file),
		resolve(dir, file),
		{ overwrite: true },
	);
};
