import { reactive } from 'vue';



class UserAdmin {
	state = {};
	iids = new Set();


	get who() { return this.profile?.name; }


	constructor(wock, profile, $post) {
		this.wock = wock;
		this.profile = profile;
		this.$post = $post;

		return reactive(this);
	}

	init() { return this; }


	followUser(uid) {
		return this.$post('pixiv/user/follow', { who: this.who, uid });
	}
}


export default UserAdmin;
