const assignThumbURL = (illust, who) => {
	illust.urlThumb = `api/pixiv/illust/thumb?iid=${illust.iid}&time=${illust.time}&type=${illust.type}`;

	return illust;
};



export default assignThumbURL;
