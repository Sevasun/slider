import AjaxTabs from './modules/ajaxtabs';
import Slider from './modules/slider';

// init
document.addEventListener('DOMContentLoaded', function() {
	// sliderInit();
	galleryInit();
	tabsInit();
});

function sliderInit() {
	let slider = new Slider({
		// add settings form defaultOptions list
		slider: '.slider',
		pagination: true,
		loadMore: true
	});
	return slider;
};

function galleryInit() {
	let gallery = new Slider({
		slider: '.gallery',
		pagination: true,
		autoplay: true,
		step: 2
	});
	return gallery;
};

function tabsInit() {
	let tabs = new AjaxTabs({
		tabLinkHolder: ".tabset",
		activeOnLoad: true
	});
	return tabs;
}

export default sliderInit;
