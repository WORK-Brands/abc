jQuery(document).ready(function () {
	var intro = $('.sb1-intro-block'),
		header = $('.cd-nav'),
		// projectsContainer = $('.sb1-projects-wrapper'),
		// projectsContainers = $('.sb1-projects-wrapper'),
		// projectsSlider = projectsContainer.children('.sb1-slider'),
		projectsSliders = $('.sb1-slider'),
		singleProjectContent = $('.sb1-project-content'),
		sliderNav = $('.sb1-slider-navigation');

	// console.log(projectsSliders);

	var resizing = false;
	var scrollTop = 0;
	var bodyHeight = $('body').height();

	// Slider Functions
	// Select projectsContainer
	function projectsContainer(group) {
		var projectsContainer = $('.sb1-projects-wrapper[data-group="' + group + '"]');
		return projectsContainer;
	}
	// Select projectsSlider
	function projectsSlider(group) {
		var projectsSlider = $('.sb1-projects-wrapper[data-group="' + group + '"]').find('.sb1-slider');
		return projectsSlider;
	}

	// Close
	function closeSlider() {
		intro.removeClass('projects-visible');
		header.removeClass('projects-visible');

		$('.sb1-projects-wrapper').each(function(index, el) {
			$(el).removeClass('projects-visible');
		});

		// Reset
		//  fix the bottom white space
		$('html, body').animate({
			scrollTop: scrollTop + 'px'
		}, 800);
	}

	// Show
	function showSlider(group) {

		scrollTop = $('html, body').scrollTop();
		intro.addClass('projects-visible');
		header.addClass('projects-visible');
		projectsContainer(group).addClass('projects-visible');
		//animate single project - entrance animation
		setTimeout(function () {
			showProjectPreview(projectsSlider(group).children('li').eq(0));
		}, 200);

		$('.qp-overlay').addClass('qp-is-visible');
		$('.sb1-intro-block').addClass('projects-visible');
		// fix the bottom white space
		$('html, body').animate({
			scrollTop: "0"
		}, 800);
		$('body').css('overflowY', 'hidden');
	}


	// Use Browse Competitive Analysis button to open slider
	header.find('a[data-action="show-projects"]').on('click', function (event) {
		var group = $(this).data('group');
		if (intro.hasClass('projects-visible')) {
			//close slider
			closeSlider();
			$('.qp-overlay').removeClass('qp-is-visible');
			$('body').css('overflowY', 'scroll');
		} else {
			//show slider
			showSlider(group);
		}
	});

	// Close the slider when close the dropdown menu
	$('ul.cd-primary-nav li a').on('click', function () {
		if ($(this).hasClass('selected')) {
			closeSlider();
			$('.qp-overlay').removeClass('qp-is-visible');
			$('body').css('overflowY', 'scroll');
		}
	});

	//show the projects slider if user clicks the show-projects button
	intro.on('click', 'a[data-action="show-projects"]', function (event) {
		var group = $(this).parents('.qp-quick-view').data('group');
		//show slider
		if (!intro.hasClass('projects-visible')) {
			showSlider(group);
		}

	});

	intro.on('click', function (event) {
		if (intro.hasClass('projects-visible') && !$(event.target).is('a[data-action="show-projects"]')) {
			closeSlider();
		}
	});

	//go to next/pre slide - clicking on the next/prev arrow
	sliderNav.on('click', '.next', function () {
		group = $(this).parents('.sb1-projects-wrapper').data('group');
		nextSides(projectsSlider(group));
	});
	sliderNav.on('click', '.prev', function () {
		group = $(this).parents('.sb1-projects-wrapper').data('group');
		prevSides(projectsSlider(group));
	});

	//go to next/pre slide - keyboard navigation
	$(document).keyup(function (event) {
		var mq = checkMQ();
		if (event.which == '37' && intro.hasClass('projects-visible') && !(sliderNav.find('.prev').hasClass('inactive')) && (mq == 'desktop')) {
			prevSides(projectsSlider);
		} else if (event.which == '39' && intro.hasClass('projects-visible') && !(sliderNav.find('.next').hasClass('inactive')) && (mq == 'desktop')) {
			nextSides(projectsSlider);
		} else if (event.which == '27' && singleProjectContent.hasClass('is-visible')) {
			singleProjectContent.removeClass('is-visible');
		}
	});

	projectsSliders.each(function (index, projectsSlider) {

		$(projectsSlider).on('swipeleft', function () {
			var mq = checkMQ();
			if (!(sliderNav.find('.next').hasClass('inactive')) && (mq == 'desktop')) nextSides(projectsSlider);
		});

		$(projectsSlider).on('swiperight', function () {
			var mq = checkMQ();
			if (!(sliderNav.find('.prev').hasClass('inactive')) && (mq == 'desktop')) prevSides(projectsSlider);
		});

	});

	function showProjectPreview(project) {
		if (project.length > 0) {
			setTimeout(function () {
				project.addClass('slides-in');
				showProjectPreview(project.next());
			}, 50);
		}
	}

	function checkMQ() {
		//check if mobile or desktop device
		return window.getComputedStyle(document.querySelector('.sb1-projects-wrapper'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
	}

	function setSliderContainer() {
		projectsSliders.each(function (index, projectsSlider) {
			var mq = checkMQ();
			if (mq == 'desktop') {
				var slides = $(projectsSlider).children('li'),
					slideWidth = slides.eq(0).width(),
					marginLeft = Number($(projectsSlider).children('li').eq(1).css('margin-left').replace('px', '')),
					sliderWidth = (slideWidth + marginLeft) * (slides.length + 1) + 'px',
					slideCurrentIndex = $(projectsSlider).children('li.current').index();
				$(projectsSlider).css('width', sliderWidth);
				(slideCurrentIndex !== 0) && setTranslateValue($(projectsSlider), (slideCurrentIndex * (slideWidth + marginLeft) + 'px'));
			} else {
				$(projectsSlider).css('width', '');
				setTranslateValue($(projectsSlider), 0);
			}
			resizing = false;

		});

	}

	function nextSides(slider) {
		var actual = slider.children('.current'),
			index = actual.index(),
			following = actual.nextAll('li').length,
			width = actual.width(),
			marginLeft = Number(slider.children('li').eq(1).css('margin-left').replace('px', ''));

		index = (following > 4) ? index + 3 : index + following - 2;
		//calculate the translate value of the slider container
		translate = index * (width + marginLeft) + 'px';

		slider.addClass('next');
		setTranslateValue(slider, translate);
		slider.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
			updateSlider('next', actual, slider, following);
		});

		if ($('.no-csstransitions').length > 0) updateSlider('next', actual, slider, following);
	}

	function prevSides(slider) {
		var actual = slider.children('.previous'),
			index = actual.index(),
			width = actual.width(),
			marginLeft = Number(slider.children('li').eq(1).css('margin-left').replace('px', ''));

		translate = index * (width + marginLeft) + 'px';

		slider.addClass('prev');
		setTranslateValue(slider, translate);
		slider.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
			updateSlider('prev', actual, slider);
		});

		if ($('.no-csstransitions').length > 0) updateSlider('prev', actual, slider);
	}

	function updateSlider(direction, actual, slider, numerFollowing) {

		group = slider.parents('.sb1-projects-wrapper').data('group');
		console.log(slider);

		if (direction == 'next') {

			slider.removeClass('next').find('.previous').removeClass('previous');
			actual.removeClass('current');
			if (numerFollowing > 4) {
				actual.addClass('previous').next('li').next('li').next('li').addClass('current');
			} else if (numerFollowing == 4) {
				actual.next('li').next('li').addClass('current').prev('li').prev('li').addClass('previous');
			} else {
				actual.next('li').addClass('current').end().addClass('previous');
			}
		} else {

			slider.removeClass('prev').find('.current').removeClass('current');
			actual.removeClass('previous').addClass('current');
			if (actual.prevAll('li').length > 2) {
				actual.prev('li').prev('li').prev('li').addClass('previous');
			} else {
				(!slider.children('li').eq(0).hasClass('current')) && slider.children('li').eq(0).addClass('previous');
			}
		}

		updateNavigation(group);
	}

	function updateNavigation(group) {
		//update visibility of next/prev buttons according to the visible slides
		var current = projectsContainer(group).find('li.current');
		(current.is(':first-child')) ? sliderNav.find('.prev').addClass('inactive'): sliderNav.find('.prev').removeClass('inactive');
		(current.nextAll('li').length < 3) ? sliderNav.find('.next').addClass('inactive'): sliderNav.find('.next').removeClass('inactive');
	}

	function setTranslateValue(item, translate) {
		item.css({
			'-moz-transform': 'translateX(-' + translate + ')',
			'-webkit-transform': 'translateX(-' + translate + ')',
			'-ms-transform': 'translateX(-' + translate + ')',
			'-o-transform': 'translateX(-' + translate + ')',
			'transform': 'translateX(-' + translate + ')',
		});
	}

	//if on desktop - set a width for the projectsSlider element
	setSliderContainer();

	$(window).on('resize', function () {
		//on resize - update projectsSlider width and translate value
		if (!resizing) {
			(!window.requestAnimationFrame) ? setSliderContainer(): window.requestAnimationFrame(setSliderContainer);
			resizing = true;
		}
	});
});
