module.exports = async (q) => {
	return E.picov.F.get(`https://i.pximg.net/c/150x150/img-master/img/${q.time}/${q.iid}${~~q.ugoira ? '' : '_p0'}_master1200.jpg`, 2);
};