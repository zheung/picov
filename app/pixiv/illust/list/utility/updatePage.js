const updatePage = (info, step) => {
	const pagePreNew = ~~info.pagePre + ~~step;

	info.pagePre = pagePreNew > 0 ? pagePreNew : info.pagePre;

	return info;
};


export default updatePage;