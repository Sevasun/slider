// init
document.addEventListener('DOMContentLoaded', function() {
	let slider = new Slider({
		// add settings form defaultOptions list
		slider: '.slider',
		pagination: true
	});

	let carousel = new Slider({
		slider: '.carousel',
		autoplay: true
	});
});

// prototype
function Slider(options) {
	//default options
	let defaultOptions = {
		slider: '.carousel',
		slideset: '.slideset',
		slide: '.slide',
		prevBtn: '.btn-prev',
		nextBtn: '.btn-next',
		autoplay: false,
		autoplayDelay: 5000,
		animationSpeed: 1000,
		pagination: false
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
	this.pagination = settings.pagination;

	let i = 0,
		offset = 0,
		currentSlide = context.slide[i],
		slideWidth = currentSlide.offsetWidth;

	currentSlide.classList.add('current');

	// slide moving function
	let move = function() {
		currentSlide.classList.remove('current');
		currentSlide = context.slide[i];
		currentSlide.classList.add('current');
		offset = -1 * slideWidth * i;
		context.slideset.style.transform = `translateX(${offset}px)`;
	};

	this.moveRight = function() {
		i++;
		if (i >= context.slide.length) {
			i = 0;
		};
		move();
	};

	this.moveLeft = function() {
		i--;
		console.log('i:' + i);
		if (i < 0) {
			i = context.slide.length - 1;
		};
		move();
	};

	// pagination section
	if (this.pagination) {
		// create pagination block
		let pageList = createPagination(context.slider);

		// create pagination buttons
		for (let j = 0; j < this.slide.length; j++) {
			createPaginationButton(pageList, j);
		};

		let paginationItem = pageList.querySelectorAll('li');
		let currentPaginationItem = paginationItem[i];
		currentPaginationItem.classList.add('active');

		// pagination buttons functionality
		for (let j = 0; j < paginationItem.length; j++) {
			let pageBtn = paginationItem[j].querySelector('.pagination-btn');
			pageBtn.addEventListener('click', function() {
				i = j;
				move();
				currentPaginationItem.classList.remove('active');
				currentPaginationItem = paginationItem[i];
				currentPaginationItem.classList.add('active');
			});
		};
	};

	// autoplay function
	if (this.autoplay) {
		context.slideset.style = `transition-duration:${this.autoplaySpeed}ms`;
		setInterval(context.moveRight, context.autoplayDelay);
	};

	// nav buttons events
	this.nextBtn.addEventListener('click', function(e) {
		e.preventDefault();
		context.moveRight();
	});
	this.prevBtn.addEventListener('click', function(e) {
		e.preventDefault();
		context.moveLeft();
	});
};

// common functions
function merge(obj1, obj2) {
	let newObj = {};
	for (let key in obj2) {
		if (!obj1.hasOwnProperty(key)) {
			obj1[key] = obj2[key];
		};
	};
	return obj1;
};

createPagination = function(holder) {
	let pageBlock = document.createElement('div');
	pageBlock.classList.add('pagination');
	let pageList = document.createElement('ul');
	pageList.classList.add('pagination-list');
	pageBlock = holder.appendChild(pageBlock);
	pageList = pageBlock.appendChild(pageList);
	return pageList;
};

createPaginationButton = function(list, counter) {
	let paginationLi = document.createElement('li');
	paginationLi = list.appendChild(paginationLi);
	let paginationButton = document.createElement('button');
	paginationButton.classList.add('pagination-btn');
	paginationButton.innerHTML = `<span class="number">${counter + 1}</span>`;
	paginationButton = paginationLi.appendChild(paginationButton);
}