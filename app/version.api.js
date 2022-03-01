import FX from 'fs-extra';


export const method = 'get';
export const handle = () => {
	try {
		return FX.readJSONSync('package.json', 'utf8').version;
	}
	catch {
		throw Error('读取版本失败');
	}
};