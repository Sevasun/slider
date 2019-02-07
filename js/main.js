document.addEventListener('DOMContentLoaded', function() {

	let slider = new Slider({
		slider: '.slider',
		slideset: '.slideset',
		slide: '.slide'
	});

	let carousel = new Slider({
		slider: '.carousel',
		autoplay: true
	});
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

	let settings = merge(options, defaultOptions);

	let context = this;

	this.slider = document.querySelector(settings.slider);
	this.slideset = this.slider.querySelector(settings.slideset);
	this.slide = this.slideset.querySelectorAll(settings.slide);
	this.autoplay = settings.autoplay;
	this.autoplayDelay = settings.autoplayDelay;
	this.autoplaySpeed = settings.autoplaySpeed;
	this.prevBtn = this.slider.querySelector(settings.prevBtn);
	this.nextBtn = this.slider.querySelector(settings.nextBtn);
	this.pagination = this.slider.querySelector(settings.pagination);

	let i = 0,
		offset = 0,
		currentSlide = context.slide[i],
		slideWidth = currentSlide.offsetWidth;

	currentSlide.classList.add('current');

	let move = function() {
		currentSlide.classList.remove('current');
		currentSlide = context.slide[i];
		currentSlide.classList.add('current');
		context.slideset.style.transform = `translateX(${offset}px)`;
	};

	this.moveRight = function() {
		i++;
		if (i < context.slide.length) {
			offset -= slideWidth;
		} else {
			i = 0;
			offset = 0;
		};
		move();
	};

	this.moveLeft = function() {
		i--;
		if (i >= 0) {
			offset += slideWidth;
		} else {
			i = context.slide.length - 1;
			offset = -1 * slideWidth * (context.slide.length - 1);
		};
		move();
	};

	if (this.autoplay) {
		context.slideset.style = `transition-duration:${this.autoplaySpeed}ms`;
		setInterval(context.moveRight, context.autoplayDelay);
	};

	this.nextBtn.addEventListener('click', function(e) {
		e.preventDefault();
		context.moveRight();
	});
	this.prevBtn.addEventListener('click', this.moveLeft);
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