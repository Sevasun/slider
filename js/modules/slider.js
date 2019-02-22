import merge from './common';

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

	this.settings = merge(options, defaultOptions);
	let body = document.querySelector('body');

	// this.sliderList = document.querySelectorAll(this.settings.slider);
	// this.sliderList = Array.prototype.slice.call(this.sliderList, 0);

	this.slider = document.querySelector(this.settings.slider);

	// this.sliderList.forEach(function(slider) {
		this.slideset = this.slider.querySelector(this.settings.slideset);
		this.slide = this.slider.querySelectorAll(this.settings.slide);
		this.prevBtn = this.slider.querySelector(this.settings.prevBtn);
		this.nextBtn = this.slider.querySelector(this.settings.nextBtn);
		this.step = this.settings.step;
		this.dragSense = this.settings.dragSense;
		this.pagination = this.settings.pagination;
		this.autoplay = this.settings.autoplay;
		this.autoplayDelay = this.settings.autoplayDelay;
		this.autoplaySpeed = this.settings.animationSpeed;
		this.loadMore = this.settings.loadMore;

		let movingX = 0;
		let startPosition = 0;
		let mouseDown = 0;

		let self = this;

		let i = 0,
			offset = 0,
			currentSlide = this.slide[i],
			galleryWidth = this.slider.offsetWidth,
			slideWidth = currentSlide.offsetWidth,
			diffWidth = +this.slide.length * +slideWidth - +galleryWidth;

		currentSlide.classList.add('current');

		runSlider();

		// pagination section
		function runSlider() {
			if (self.pagination) {
				// create pagination block
				self.pageList = createPagination(self.slider);

				// create pagination buttons
				for (let j = 0; j < self.slide.length; j++) {
					createPaginationButton(self.pageList, j);
				};

				self.paginationItem = self.pageList.querySelectorAll('li');
				self.currentPaginationItem = addPaginationClass(self.paginationItem, i);

				self.pageList.addEventListener('click', function(e) {
					if (e.target.className == "pagination-btn") {
						let clickedItem = e.target;
						let clickedLi = clickedItem.parentElement;
						for (let j = 0; j < self.paginationItem.length; j++) {
							if (self.paginationItem[j] === clickedLi) {
								i = j;
								self.move();
								self.currentPaginationItem.classList.remove('active');
								self.currentPaginationItem = addPaginationClass(self.paginationItem, i);
							}
						}
					}
				});
			};

			// autoplay function
			if (self.autoplay) {
				self.slideset.style = `transition-duration:${self.autoplaySpeed}ms`;
				setInterval(self.moveRight, self.autoplayDelay);
			};

			// nav buttons events
			self.nextBtn.addEventListener('click', (e) => {
				e.preventDefault();
				self.moveRight();
			});
			self.prevBtn.addEventListener('click', (e) => {
				e.preventDefault();
				self.moveLeft();
			});

			// slide moving function
			self.move = function() {
				currentSlide.classList.remove('current');

				if (i >= self.slide.length) {
					i = 0;
				} else if (i < 0) {
					i = self.slide.length - 1;
					offset = -1 * diffWidth;
				};

				if (slideWidth * i <= diffWidth + 1) {
					offset = -1 * slideWidth * i;
				} else {
					offset = -1 * diffWidth;
				};

				currentSlide = self.slide[i];
				currentSlide.classList.add('current');
				self.slideset.style.transform = `translateX(${offset}px)`;
				return currentSlide;
			};

			self.moveRight = function() {
				i = i + self.step;
				self.move();
				if (self.pagination) {
					self.currentPaginationItem.classList.remove('active');
					self.currentPaginationItem = addPaginationClass(self.paginationItem, i);
				}
			};

			self.moveLeft = function() {
				i = i - self.step;
				self.move();
				if (self.pagination) {
					self.currentPaginationItem.classList.remove('active');
					self.currentPaginationItem = addPaginationClass(self.paginationItem, i);
				}
			};

			//drag'n'drop events
			self.slideset.addEventListener('mousedown', function(e) {
				dragStart(e, e.clientX, this);
			});

			self.slideset.addEventListener('mousemove', function(e) {
				if (mouseDown) {
					dragMove(e, e.clientX, this);
				}
			});

			body.addEventListener('mouseup', function(e) {
				dragEnd(self.slideset);
			});

			self.slideset.addEventListener('touchstart', function(e) {
				dragStart(e, e.changedTouches[0].clientX, this);
			});

			self.slideset.addEventListener('touchmove', function(e) {
				if (mouseDown) {
					dragMove(e, e.changedTouches[0].clientX, this);
				}
			});

			self.slideset.addEventListener('touchend', function(e) {
				dragEnd(this);
			});

			// drag'n'drop functions
			function dragStart(event, eventCoord, target) {
				event.preventDefault();
				startPosition = eventCoord;
				mouseDown = 1;
				target.style.transitionDuration = '0ms';
			};
			
			function dragMove(event, eventCoord, target) {
				event.preventDefault();
				movingX = startPosition - eventCoord;
				offset -= movingX / 100;
				target.style.transform = `translateX(${offset}px)`;
			};

			function dragEnd(target) {
				target.style.removeProperty('transition-duration');

				if (slideWidth * i <= diffWidth + 1) {
					offset = -1 * slideWidth * i;
				} else {
					offset = -1 * diffWidth;
				};

				target.style.transform = `translateX(${self.offset}px)`;

				if (mouseDown) {
					if (movingX > +self.dragSense) {
						self.moveRight();
					} else if (movingX < -self.dragSense) {
						self.moveLeft();
					}
					mouseDown = 0;
				}
			};

			if(self.loadMore && self.slider.querySelector('.load-more')) {
				let loadMoreButton = self.slider.querySelector('.load-more');
				let loadMoreAddress = loadMoreButton.getAttribute('data-link');
	
				loadMoreButton.addEventListener('click', function() {
					getSlides(loadMoreAddress);
					this.setAttribute('disabled', 'disabled');
				});
			};
		};

		function getSlides(address) {
			let request = new XMLHttpRequest();
			request.open('GET', address);
			request.send();
			
			request.addEventListener('readystatechange', function() {
				if(request.readyState == 4 && request.status == 200) {
					let newSlides = request.responseText;
					self.slideset.insertAdjacentHTML('beforeend', newSlides);
					self.slide = self.slider.querySelectorAll(self.settings.slide);
					diffWidth = self.slide.length * slideWidth - galleryWidth;
					// TODO 
					//==== refactor this shit
					while(self.pageList.firstChild) {
						self.pageList.firstChild.remove();
					};
					// create pagination buttons
					for (let j = 0; j < self.slide.length; j++) {
						createPaginationButton(self.pageList, j);
					};

					self.paginationItem = self.pageList.querySelectorAll('li');
					self.currentPaginationItem = addPaginationClass(self.paginationItem, i);

					self.pageList.addEventListener('click', function(e) {
						if (e.target.className == "pagination-btn") {
							let clickedItem = e.target;
							let clickedLi = clickedItem.parentElement;
							for (let j = 0; j < self.paginationItem.length; j++) {
								if (self.paginationItem[j] === clickedLi) {
									i = j;
									self.move();
									self.currentPaginationItem.classList.remove('active');
									self.currentPaginationItem = addPaginationClass(self.paginationItem, i);
								}
							}
						}
					});
					//====
				}
			});
		};
	// });

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
};

export default Slider;