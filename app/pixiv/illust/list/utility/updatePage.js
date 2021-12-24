const updatePage = (info, step_) => {
	const step = ~~step_;

	if(step > 0 || step < 0 && info.pagePre + step > 0) {
		info.pagePre += step;
	}

	return info;
};


export default updatePage;