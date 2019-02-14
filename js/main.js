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
		dragSense: 100,
		autoplay: false,
		autoplayDelay: 5000,
		animationSpeed: 1000,
		pagination: false,
		loadMore: false
	};

	let settings = merge(options, defaultOptions);
	let body = document.querySelector('body');

	this.sliderList = document.querySelectorAll(settings.slider);
	this.sliderList = Array.prototype.slice.call(this.sliderList, 0);

	this.sliderList.forEach(function(slider) {
		let context = this;
		let slideset = slider.querySelector(settings.slideset);
		let slide = slider.querySelectorAll(settings.slide);
		let prevBtn = slider.querySelector(settings.prevBtn);
		let nextBtn = slider.querySelector(settings.nextBtn);
		let step = settings.step;
		let dragSense = settings.dragSense;
		let pagination = settings.pagination;
		let autoplay = settings.autoplay;
		let autoplayDelay = settings.autoplayDelay;
		let autoplaySpeed = settings.animationSpeed;
		let loadMore = settings.loadMore;

		let movingX = 0;
		let startPosition = 0;
		let mouseDown = 0;

		let i = 0,
			offset = 0,
			currentSlide = slide[i],
			galleryWidth = slider.offsetWidth,
			slideWidth = currentSlide.offsetWidth,
			diffWidth = slide.length * slideWidth - galleryWidth;

		currentSlide.classList.add('current');

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
		});
		prevBtn.addEventListener('click', function(e) {
			e.preventDefault();
			moveLeft();
		});

		//drag'n'drop events
		slideset.addEventListener('mousedown', function(e) {
			dragStart(e, e.clientX, slideset);
		});

		slideset.addEventListener('mousemove', function(e) {
			if (mouseDown) {
				dragMove(e, e.clientX, slideset);
			}
		});

		body.addEventListener('mouseup', function(e) {
			dragEnd(slideset);
		});

		slideset.addEventListener('touchstart', function(e) {
			dragStart(e, e.changedTouches[0].clientX, slideset);
		});

		slideset.addEventListener('touchmove', function(e) {
			if (mouseDown) {
				dragMove(e, e.changedTouches[0].clientX, slideset);
			}
		});

		slideset.addEventListener('touchend', function(e) {
			dragEnd(slideset);
		});

		if(loadMore && slider.querySelector('.load-more')) {
			let loadMoreButton = slider.querySelector('.load-more');
			let loadMoreAddress = loadMoreButton.getAttribute('data-link');

			loadMoreButton.addEventListener('click', function() {
				getSlides(loadMoreAddress);
				this.setAttribute('disabled', 'disabled');
			});
		};

		function getSlides(address) {
			let request = new XMLHttpRequest();
			request.open('GET', address);
			request.send();

			request.addEventListener('readystatechange', function() {
				if(request.readyState == 4 && request.status == 200) {
					let newSlides = request.responseText;
					slideset.insertAdjacentHTML('beforeend', newSlides);
					slide = slider.querySelectorAll(settings.slide);
					diffWidth = slide.length * slideWidth - galleryWidth;
				}
			})
		}

		// slide moving function
		function move() {
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

		function moveRight() {
			i = i + step;
			move();
			if (pagination) {
				currentPaginationItem.classList.remove('active');
				currentPaginationItem = addPaginationClass(paginationItem, i);
			}
		};

		function moveLeft() {
			i = i - step;
			move();
			if (pagination) {
				currentPaginationItem.classList.remove('active');
				currentPaginationItem = addPaginationClass(paginationItem, i);
			}
		};

		// drag'n'drop functions
		function dragStart(event, eventCoord, target) {
			event.preventDefault();
			startPosition = eventCoord;
			mouseDown = 1;
			target.style.transitionDuration = '0ms';
		}
		
		function dragMove(event, eventCoord, target) {
			event.preventDefault();
			movingX = startPosition - eventCoord;
			offset -= movingX / 100;
			target.style.transform = `translateX(${offset}px)`;
		}

		function dragEnd(target) {
			target.style.removeProperty('transition-duration');

			if (slideWidth * i <= diffWidth + 1) {
				offset = -1 * slideWidth * i;
			} else {
				offset = -1 * diffWidth;
			};

			target.style.transform = `translateX(${offset}px)`;

			if (mouseDown) {
				if (movingX > +dragSense) {
					moveRight();
				} else if (movingX < -dragSense) {
					moveLeft();
				}
				mouseDown = 0;
			}
		}
	});

	function createPagination(holder) {
		let pageBlock = document.createElement('div');
		pageBlock.classList.add('pagination');
		let pageList = document.createElement('ul');
		pageList.classList.add('pagination-list');
		pageBlock = holder.appendChild(pageBlock);
		pageList = pageBlock.appendChild(pageList);
		return pageList;
	};

	function createPaginationButton(list, counter) {
		let paginationLi = document.createElement('li');
		paginationLi = list.appendChild(paginationLi);
		let paginationButton = document.createElement('button');
		paginationButton.classList.add('pagination-btn');
		paginationButton.innerHTML = `<span class="number">${counter + 1}</span>`;
		paginationButton = paginationLi.appendChild(paginationButton);
	};

	function addPaginationClass(item, i) {
		let currentItem = item[i];
		currentItem.classList.add('active');
		return currentItem;
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
};
