




import HomeLogin from '../../_home/Login';
import HomeTop from '../../_home/Top';
import HomeLeft from '../../_home/Left';
import HomeNavi from '../../_home/Navi';

// 普通组件
import Combo from '../../_comp/Frame/Combo';
import ComboBoxer from '../../_comp/Frame/Combo/ComboBoxer';
import Timer from '../../_comp/Frame/Timer';
import TimerBoxer from '../../_comp/Frame/Timer/TimerBoxer';

import Menus from '../../_comp/Frame/Menus';

import Alert from '../../_comp/Frame/Alert';
import Checker from '../../_comp/Frame/Checker';
import Empty from '../../_comp/Frame/Empty';
import Filect from '../../_comp/Frame/Filect';
import Grid from '../../_comp/Frame/Grid';
import Labler from '../../_comp/Frame/Labler';
import Masker from '../../_comp/Frame/Masker';
import Scroll from '../../_comp/Frame/Scroll';
import Texter from '../../_comp/Frame/Texter';
import TxArea from '../../_comp/Frame/TxArea';
import Winer from '../../_comp/Frame/Winer';

import sPanel from '../../_comp/Style/Panel';
import sButton from '../../_comp/Style/Button';
import sTopbar from '../../_comp/Style/Topbar';

import pPager from '../../_comp/Picov/Pager';
import pThumb from '../../_comp/Picov/Thumb';

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
	Vue.component('sButton', sButton);
	Vue.component('sTopbar', sTopbar);

	Vue.component('pPager', pPager);
	Vue.component('pThumb', pThumb);
}