import FX from 'fs-extra';


const method = 'get';
const handle = () => {
	try {
		return FX.readJSONSync('package.json', 'utf8').version;
	}
	catch {
		throw Error('读取版本失败');
	}
};


export { method, handle };