// init
document.addEventListener('DOMContentLoaded', function() {
	new Slider({
		// add settings form defaultOptions list
		slider: '.slider',
		pagination: true
	});

	new Slider({
		slider: '.gallery',
		pagination: true,
		autoplay: true,
		step: 2
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
		step: 1,
		autoplay: false,
		autoplayDelay: 5000,
		animationSpeed: 1000,
		pagination: false
	};

	let settings = merge(options, defaultOptions);

	this.sliderList = document.querySelectorAll(settings.slider);
	this.sliderList = Array.prototype.slice.call(this.sliderList, 0);

	this.sliderList.forEach(function(slider) {
		let context = this;
		let slideset = slider.querySelector(settings.slideset);
		let slide = slider.querySelectorAll(settings.slide);
		let prevBtn = slider.querySelector(settings.prevBtn);
		let nextBtn = slider.querySelector(settings.nextBtn);
		let step = settings.step;
		let pagination = settings.pagination;
		let autoplay = settings.autoplay;
		let autoplayDelay = settings.autoplayDelay;
		let autoplaySpeed = settings.animationSpeed;

		let i = 0,
			offset = 0,
			currentSlide = slide[i],
			galleryWidth = slider.offsetWidth,
			slideWidth = currentSlide.offsetWidth,
			diffWidth = slide.length * slideWidth - galleryWidth;

		currentSlide.classList.add('current');

		// slide moving function
		let move = function() {
			currentSlide.classList.remove('current');

			if (i >= slide.length) {
				i = 0;
			};

			if (i < 0) {
				i = slide.length - 1;
				offset = -1 * diffWidth;
			};

			if (slideWidth * i <= diffWidth + 1) {
				offset = -1 * slideWidth * i;
			} else {
				offset = -1 * diffWidth;
			};

			currentSlide = slide[i];
			currentSlide.classList.add('current');
			slideset.style.transform = `translateX(${offset}px)`;
			return currentSlide;
		};

		let moveRight = function() {
			i = i + step;
			move();
			if (pagination) {
				currentPaginationItem.classList.remove('active');
				currentPaginationItem = addPaginationClass(paginationItem, i);
			}
		};

		let moveLeft = function() {
			i = i - step;
			move();
			if (pagination) {
				currentPaginationItem.classList.remove('active');
				currentPaginationItem = addPaginationClass(paginationItem, i);
			}
		};

		// pagination section
		if (pagination) {
			// create pagination block
			let pageList = createPagination(slider);

			// create pagination buttons
			for (let j = 0; j < slide.length; j++) {
				createPaginationButton(pageList, j);
			};

			var paginationItem = pageList.querySelectorAll('li');
			var currentPaginationItem = addPaginationClass(paginationItem, i);

			// pagination buttons functionality
			// for (let j = 0; j < paginationItem.length; j++) {
			// 	let pageBtn = paginationItem[j].querySelector('.pagination-btn');
			// 	pageBtn.addEventListener('click', function() {
			// 		i = j;
			// 		move();
			// 		currentPaginationItem.classList.remove('active');
			// 		currentPaginationItem = addPaginationClass(paginationItem, i);
			// 	});
			// };
			pageList.addEventListener('click', function(e) {
				if (e.target.className == "pagination-btn") {
					let clickedItem = e.target;
					let clickedLi = clickedItem.parentElement;
					for (let j = 0; j < paginationItem.length; j++) {
						if (paginationItem[j] === clickedLi) {
							i = j;
							move();
							currentPaginationItem.classList.remove('active');
							currentPaginationItem = addPaginationClass(paginationItem, i);
						}
					}
				}
			});
		};

		// autoplay function
		if (autoplay) {
			slideset.style = `transition-duration:${autoplaySpeed}ms`;
			setInterval(moveRight, autoplayDelay);

		};

		// nav buttons events
		nextBtn.addEventListener('click', function(e) {
			e.preventDefault();
			moveRight();
			// if (pagination) {
			// 	currentPaginationItem.classList.remove('active');
			// 	currentPaginationItem = addPaginationClass(paginationItem, i);
			// }
		});
		prevBtn.addEventListener('click', function(e) {
			e.preventDefault();
			moveLeft();
			// if (pagination) {
			// 	currentPaginationItem.classList.remove('active');
			// 	currentPaginationItem = addPaginationClass(paginationItem, i);
			// }
		});
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

addPaginationClass = function(item, i) {
	let currentItem = item[i];
	currentItem.classList.add('active');
	return currentItem;
}