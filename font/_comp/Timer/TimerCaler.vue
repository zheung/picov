<template>
	<div class="compCalendar">
		<div class="naviBox">
			<div @click="move(-1, 'year')" class="navi trans"><Fas class="rightButton" :icon="['fas', 'angle-double-left']" /></div>
			<div @click="move(-1, 'month')" class="navi trans"><Fas class="rightButton" :icon="['fas', 'angle-left']" /></div>
			<div class="sel">{{mentShow.format('YYYY')}}</div>
			<div class="sel">{{mentShow.format('MM')}}</div>
			<div @click="move(1, 'month')" class="navi trans"><Fas class="rightButton" :icon="['fas', 'angle-right']" /></div>
			<div @click="move(1, 'year')" class="navi trans"><Fas class="rightButton" :icon="['fas', 'angle-double-right']" /></div>
		</div>
		<div class="naviBox timerBox" v-if="!onlydate">
			<input class="inline timer" v-model="hour" type="number" min="0" max="23" @input="onInputTime" @focus="focus" @blur="blur" />
			: <input class="inline timer" v-model="minute" type="number" min="0" max="59" @input="onInputTime" @focus="focus" @blur="blur" />
			: <input class="inline timer" v-model="second" type="number" min="0" max="59" @input="onInputTime" @focus="focus" @blur="blur" />
		</div>
		<hr>
		<div class="nodeBox head" v-for="(head, hid) of heads" :key="`cal-head-${hid}`">
			{{head}}
		</div>
		<template v-for="(node, nid) of nodes">
			<div :key="`cal-node-${nid}`" class="nodeBox trans"
				:class="{ outMonth: node.outMonth, outRange: node.outRange, selected: node.selected }"
				@click="onSelect(node)"
			>
				{{node.day}}
			</div>
		</template>

	</div>
</template>

<script>
	export default {
		props: {
			time: { default: function() { return moment().format('YYYY-MM-DD 00:00:00'); }},
			begin: {},
			end: {},

			focus: {},
			blur: {},

			onlydate: {},
		},
		data: function() {
			return {
				begin_: (this.begin && !(this.begin instanceof moment)) ? moment(this.begin, 'YYYY-MM-DD') : this.begin,
				end_: (this.end && !(this.end instanceof moment)) ? moment(this.end, 'YYYY-MM-DD') : this.end,

				timeShow: this.time,
				timeNow: this.time,

				heads: [ '日', '一', '二', '三', '四','五', '六' ],

				hour: 0,
				minute: 0,
				second: 0,
			};
		},
		methods: {
			onSelect: function(node) {
				if(!node.outRange) {
					if(this.onlydate) {
						this.timeNow = node.date;
					}
					else {
						this.timeNow = `${node.date} ${`00${this.hour}`.slice(-2)}:${`00${this.minute}`.slice(-2)}:${`00${this.second}`.slice(-2)}`;
					}

					this.$emit('input', this.timeNow);
				}
			},
			onInputTime: function() {
				if(this.onlydate) {
					this.timeNow = this.ment.format('YYYY-MM-DD');
				}
				else {
					this.timeNow = `${this.ment.format('YYYY-MM-DD')} ${`00${this.hour}`.slice(-2)}:${`00${this.minute}`.slice(-2)}:${`00${this.second}`.slice(-2)}`;
				}

				this.$emit('input', this.timeNow);
			},
			clickToggle: function(type) {
				let sub = this;

				return function(value) {
					sub.toggle[type] = ~~value;
				};
			},
			move: function(step, type) {
				let now = this.mentShow.clone().add(step, type);

				if(this.begin_ && (~~now.format('YYYYMM') - ~~this.begin_.format('YYYYMM'))<0) { return; }
				if(this.end_ && (~~now.format('YYYYMM') - ~~this.end_.format('YYYYMM'))>0) { return; }

				this.timeShow = now.format('YYYY-MM-DD HH:mm:ss');
			}
		},
		watch: {
			time: function(time) {
				let t = moment(time);
				this.timeShow = this.time;
				this.timeNow = this.time;
				this.hour = t.hour();
				this.minute = t.minute();
				this.second = t.second();
			}
		},

		computed: {
			ment: function () {
				return moment(this.timeNow, 'YYYY-MM-DD HH:mm:ss');
			},
			mentShow: function () {
				return moment(this.timeShow, 'YYYY-MM-DD HH:mm:ss');
			},
			nodes: function() {
				let ment = this.ment;
				let mentNow = this.mentShow;

				let first = mentNow.clone().startOf('month');
				let last = mentNow.clone().endOf('month');

				let cursor = mentNow.clone().startOf('month').add(1, 'hours');

				let nodes = [];

				while(cursor.isBetween(first, last)) {
					nodes.push({
						day: ~~cursor.format('DD'),
						date: cursor.format('YYYY-MM-DD'),
						outRange: !!(this.begin_ && cursor.isBefore(this.begin_)) || !!(this.end_ && cursor.isAfter(this.end_)),
						outMonth: false,
						selected: ment.isSame(cursor, 'date')
					});

					cursor.add(1, 'days');
				}

				let weekday = first.weekday();
				cursor = first.clone();

				while(weekday-- > -7) {
					cursor = cursor.subtract(1, 'day');

					nodes.unshift({
						day: ~~cursor.format('DD'),
						date: cursor.format('YYYY-MM-DD'),
						outRange: !!(this.begin_ && cursor.isBefore(this.begin_)) || !!(this.end_ && cursor.isAfter(this.end_)),
						outMonth: true,
						selected: ment.isSame(cursor, 'date')
					});
				}

				weekday = last.weekday();
				cursor = last.clone();

				let tail = nodes.length > 42 ? 5 : 12;

				while(weekday++ <= tail) {
					cursor = cursor.add(1, 'day');

					nodes.push({
						day: ~~cursor.format('DD'),
						date: cursor.format('YYYY-MM-DD'),
						outRange: !!(this.begin_ && cursor.isBefore(this.begin_)) || !!(this.end_ && cursor.isAfter(this.end_)),
						outMonth: true,
						selected: ment.isSame(cursor, 'date')
					});
				}

				let i = 0;

				for(let node of nodes) {
					node.line = parseInt((i++ / 7)+1);
				}

				return nodes;
			}
		}
	};
</script>

<style scoped>
	.nodeBox {
		display: inline-block;

		width: 25px;
		height: 25px;

		border: 1px solid transparent;

		line-height: 25px;
		text-align: center;
	}
	.nodeBox.outMonth {
		color: #b3b3b3;
	}
	.nodeBox.outMonth:hover {
		color: inherit;
	}
	.nodeBox.outRange, .nodeBox.outRange:hover {
		color: snow;
		cursor: auto;
	}

	.nodeBox.selected {
		background: #1faaf1;
		color: snow;
	}
	.nodeBox:not(.selected):not(.head):not(.outRange):hover, .naviBox>.navi:hover {
		background: #f1f1f1;
		color: #1faaf1;
	}

	.naviBox {
		text-align: center;
	}
	.naviBox>div {
		display: inline-block;
		vertical-align: top;

		font-size: 14px;
		text-align: center;

		padding: 5px;
	}

	.naviBox>.navi {
		border-radius: 3px;
	}

	.timerBox {
		line-height: 24px;
		cursor: default;
		color: #495051;
	}

	.timer {
		width: 40px;
		border-radius: 3px;
		border: 1px solid lightgrey;
		font-size: 12px;
		height: 20px;
		text-align: center;
		line-height: 4px;
		vertical-align: middle;
		padding: 0px;
		position: relative;
		top: -1px;
		background: snow;
		color: #495051;
		outline: none;
	}
</style>