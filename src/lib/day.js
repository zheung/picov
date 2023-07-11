import Day from 'dayjs';

import DayUTCPlugin from 'dayjs/plugin/utc.js';
import DayCustomParseFormatPlugin from 'dayjs/plugin/customParseFormat.js';

import 'dayjs/locale/zh-cn.js';



Day.extend(DayUTCPlugin);
Day.extend(DayCustomParseFormatPlugin);

Day.locale('zh-cn');

Day.prototype.defaultFormat = 'YYYY-MM-DD HH:mm:ss';
Day.prototype.formatRaw = Day.prototype.format;
Day.prototype.format = function(formatStr = this.defaultFormat) { return this.formatRaw(formatStr || this.defaultFormat); };



export default Day;
