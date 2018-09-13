export default function(bus, x) {
	x.alert = async function(text, title = '提示', btnText) {
		let aConf = X.comp('alert');

		aConf.text = text;
		aConf.title = title;
		aConf.btnText1 = btnText;

		return new Promise(function(resolve) {
			aConf.waiter = resolve;
			aConf.show = true;
		});

	};

	x.quest = async function(text, title = '提示') {
		let aConf = X.comp('alert');

		aConf.mode = 'quest';

		aConf.text = text;
		aConf.title = title;
		aConf.btnText1 = '是';
		aConf.btnText2 = '否';

		return new Promise(function(resolve) {
			aConf.waiter = resolve;
			aConf.show = true;
		});
	};
}