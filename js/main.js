document.addEventListener('DOMContentLoaded', function() {

	let slider = new Slider({
		slider: '.slider',
		slideset: '.slideset',
		slide: '.slide',
		prevBtn: '.btn-prev',
		nextBtn: '.btn-next',
		autoplay: true,
		autoplayDelay: 5000,
		animationSpeed: 1000,
		pagination: '.pagination'
	});

	slider.moveRight();
});

function Slider(options) {
	let defaultOptions = {
		slider: '.carousel',
		slideset: '.slideset',
		slide: '.slide',
		prevBtn: '.btn-prev',
		nextBtn: '.btn-next',
		autoplay: false,
		autoplayDelay: 5000,
		animationSpeed: 1000,
		pagination: '.pagination'
	};

	let context = this;

	let settings = merge(options, defaultOptions);

	this.slider = document.querySelector(settings.slider);
	this.slideset = context.slider.querySelector(settings.slideset);
	this.slide = context.slideset.querySelectorAll(settings.slide);
	this.autoplay = settings.autoplay;
	this.autoplayDelay = settings.autoplayDelay;
	this.autoplaySpeed = settings.autoplaySpeed;
	this.prevBtn = context.slider.querySelector(settings.prevBtn);
	this.nextBtn = context.slider.querySelector(settings.nextBtn);
	this.pagination = context.slider.querySelector(settings.pagination);

	let i = 0,
		offset = 0,
		currentSlide = context.slide[i],
		slideWidth = currentSlide.offsetWidth;

	currentSlide.classList.add('current');

	let move = function() {
		currentSlide.classList.remove('current');
		currentSlide = context.slide[i];
		currentSlide.classList.add('current');
		context.slideset.style.transform = 'translateX(${offset});';
	};

	this.moveRight = function() {
		i++;
		console.log(i);
		if (i < context.slide.length) {
			offset -= slideWidth;
		} else {
			i = 0;
			offset = 0;
		};
		currentSlide.classList.remove('current');
		currentSlide = context.slide[i];
		currentSlide.classList.add('current');
		context.slideset.style = "margin-left:" + offset;
		console.log(context.slideset.style.marginLeft);
		// context.slideset.style = "margin-left:10px"
	};

	this.moveLeft = function() {
		i--;
		if (i >= 0) {
			offset += slideWidth;
		} else {
			i = context.slide.length - 1;
			offset = -1 * slideWidth * (context.slide.length - 1);
		};
		move;
	};
};

function merge(obj1, obj2) {
	let newObj = {};

	for (let key in obj2) {
		if (!obj1.hasOwnProperty(key)) {
			obj1[key] = obj2[key];
		};
	};
	return obj1;
};