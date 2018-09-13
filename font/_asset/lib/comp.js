




import HomeLogin from '../../_home/Login';
import HomeTop from '../../_home/Top';
import HomeLeft from '../../_home/Left';
import HomeNavi from '../../_home/Navi';

// 普通组件
import Combo from '../../_comp/Combo';
import ComboBoxer from '../../_comp/Combo/ComboBoxer';
import Timer from '../../_comp/Timer';
import TimerBoxer from '../../_comp/Timer/TimerBoxer';

import Menus from '../../_comp/Menus';

import Alert from '../../_comp/Alert';
import Checker from '../../_comp/Checker';
import Empty from '../../_comp/Empty';
import Filect from '../../_comp/Filect';
import Grid from '../../_comp/Grid';
import Labler from '../../_comp/Labler';
import Masker from '../../_comp/Masker';
import Scroll from '../../_comp/Scroll';
import Texter from '../../_comp/Texter';
import TxArea from '../../_comp/TxArea';
import Winer from '../../_comp/Winer';

import sPanel from '../../_comp/Style/Panel';

export default function() {
	Vue.component('empty', Empty);
	Vue.component('masker', Masker);
	Vue.component('winer', Winer);
	Vue.component('alert', Alert);

	Vue.component('comboBoxer', ComboBoxer);
	Vue.component('timerBoxer', TimerBoxer);
	Vue.component('menus', Menus);

	Vue.component('homeLogin', HomeLogin);
	Vue.component('homeTop', HomeTop);
	Vue.component('homeLeft', HomeLeft);
	Vue.component('homeNavi', HomeNavi);

	Vue.component('Timer', Timer);
	Vue.component('Combo', Combo);
	Vue.component('Timer', Timer);
	Vue.component('Checker', Checker);
	Vue.component('Filect', Filect);
	Vue.component('Grid', Grid);
	Vue.component('Labler', Labler);
	Vue.component('Scroll', Scroll);
	Vue.component('Texter', Texter);
	Vue.component('TxArea', TxArea);

	Vue.component('sPanel', sPanel);
}