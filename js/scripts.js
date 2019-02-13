$(function(){
	initSlider();
});

function initSlider() {
	jQuery('.slider').slider({
		slider: ".slider",
		slideset: '.slideset',
		slide: '.slide',
		prevBtn: '.buttons .btn-prev',
		nextBtn: '.buttons .btn-next',
		animationSpeed: 500
	});

	jQuery('.carousel').slider({
		slider: ".slider",
		slideset: '.slideset',
		slide: '.slide',
		prevBtn: '.buttons .btn-prev',
		nextBtn: '.buttons .btn-next',
		animationSpeed: 500
	});
}

(function($) {
	$.fn.slider = function(options) {
		this.options = $.extend({
			slideset: '.slideset',
			slide: '.slide',
			prevBtn: '.carousel .btn-prev',
			nextBtn: '.carousel .btn-next',
			autoplay: false,
			autoplayDelay: 5000,
			animationSpeed: 1000,
			pagination: '.pagination'
		}, options);

		let context = this;

		let slider = $(context);

		$(context).each(function() {
			let slideset = $(context).find(options.slideset);
			let slide = $(context).find(options.slide);
			let prevBtn = $(context).find(options.prevBtn);
			let nextBtn = $(context).find(options.nextBtn);
			let i = 0;
			let offset = 0;
			let currentSlide = slide.eq(i);
			let slideWidth = currentSlide.outerWidth();
			let autoplay = options.autoplay;
			let autoplayDelay = options.autoplayDelay;
			let animationSpeed = options.animationSpeed;
			let pagination = $(options.pagination);
			let slideLengthMinus = slide.length - 1;
			let controlWidth = slideWidth * slide.length;

			currentSlide.addClass('current');

			//methods
			let moveRight = function() {
				i++;
				if (i < slide.length) {
					offset -= slideWidth;
					currentSlide.removeClass('current');
					currentSlide = slide.eq(i).addClass('current');
					slideset.animate({
						marginLeft: offset
					}, animationSpeed);
				} else {
					i = 0;
					offset = 0;
					currentSlide.removeClass('current');
					currentSlide = slide.eq(i).addClass('current');
					slideset.animate({
						marginLeft: offset
					}, animationSpeed);
				};
			};

			let moveLeft = function() {
				i--;
				if (i >= 0) {
					offset += slideWidth;
					currentSlide.removeClass('current');
					currentSlide = slide.eq(i).addClass('current');
					slideset.animate({
						marginLeft: offset
					}, animationSpeed);
				} else {
					i = slideLengthMinus;
					offset = -1 * slideWidth * slideLengthMinus;
					currentSlide.removeClass('current');
					currentSlide = slide.eq(i).addClass('current');
					slideset.animate({
						marginLeft: offset
					}, animationSpeed);
				};
			};

			// events
			prevBtn.on('click', moveLeft);
			nextBtn.on('click', moveRight);

			if (autoplay) {
				setInterval(moveRight, autoplayDelay);
			}
		});

		return this;
	}
})(jQuery);
