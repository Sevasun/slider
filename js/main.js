import AjaxTabs from './modules/ajaxtabs';
import Slider from './modules/slider';

// init
document.addEventListener('DOMContentLoaded', function() {
	new Slider({
		// add settings form defaultOptions list
		slider: '.slider',
		pagination: true,
		loadMore: true
	});

	new Slider({
		slider: '.gallery',
		pagination: true,
		autoplay: true,
		step: 2
	});

	new AjaxTabs({
		tabLinkHolder: ".tabset",
		activeOnLoad: true
	});
});
