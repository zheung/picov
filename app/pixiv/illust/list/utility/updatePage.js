export default function updatePage(paramsPre, step_) {
	const step = ~~step_;

	if(step > 0 || step < 0 && paramsPre.page + step > 0) {
		paramsPre.page += step;
	}

	return paramsPre;
}