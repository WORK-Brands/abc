jQuery(document).ready(function ($) {
	//final width --> this is the quick view image slider width
	//maxQuickWidth --> this is the max-width of the quick-view panel
	var sliderFinalWidth = 400,
		maxQuickWidth = 1200,
		bodyHeight = $('body').height();

	// DOM elements
	$qpOverlay = $('.qp-overlay');
	qpItems = $('.qp-item');

	// Functions
	// Quick view panel
	// Animate
	function animateQuickView(image, animationType) {
		//store some image data (width, top position, ...)
		//store window data to calculate quick view panel position
		var $parentListItem = image.parent('.qp-item'),
			group = $parentListItem.data('group'),
			$quickViewPanel = $('.qp-quick-view[data-group="' + group + '"]'),
			topSelected = image.offset().top - 80,
			leftSelected = image.offset().left,
			widthSelected = image.width(),
			heightSelected = image.height(),
			windowWidth = $(window).width(),
			windowHeight = $(window).height(),
			finalLeft = (windowWidth - sliderFinalWidth) / 2,
			finalHeight = $quickViewPanel.height(),
			finalTop = (windowHeight - finalHeight) / 2 + $(document).scrollTop() - 100,
			quickViewWidth = (windowWidth * 0.8 < maxQuickWidth) ? windowWidth * 0.8 : maxQuickWidth,
			quickViewLeft = (windowWidth - quickViewWidth) / 2;

		if (animationType == 'open') {
			//hide the image in the gallery
			$parentListItem.addClass('empty-box');
			//place the quick view over the image gallery and give it the dimension of the gallery image
			$quickViewPanel.css({
				"top": topSelected,
				"left": leftSelected,
				"width": widthSelected,
			}).velocity({
				//animate the quick view: animate its width and center it in the viewport
				//during this animation, only the slider image is visible
				'top': finalTop + 'px',
				'left': finalLeft + 'px',
				'width': sliderFinalWidth + 'px',
			}, 1000, [400, 20], function () {
				//animate the quick view: animate its width to the final value
				$quickViewPanel.addClass('animate-width').velocity({
					'left': quickViewLeft + 'px',
					'width': quickViewWidth + 'px',
				}, 300, 'ease', function () {
					//show quick view content
					$quickViewPanel.addClass('qp-add-content');
				});
			}).addClass('qp-is-visible');
		} else {
			//close the quick view reverting the animation
			$quickViewPanel.removeClass('qp-add-content').velocity({
				'top': finalTop + 'px',
				'left': finalLeft + 'px',
				'width': sliderFinalWidth + 'px',
			}, 300, 'ease', function () {
				$('.qp-overlay').removeClass('qp-is-visible');
				$quickViewPanel.removeClass('animate-width').velocity({
					"top": topSelected,
					"left": leftSelected,
					"width": widthSelected,
				}, 500, 'ease', function () {
					$quickViewPanel.removeClass('qp-is-visible');
					$parentListItem.removeClass('empty-box');
				});
			});
		}
	}

	// Open
	function openQuickView(trigger) {
		trigger.on('click', function (e) {
			var selectedImage = $(this).parent('.qp-item').children('img');

			$qpOverlay.addClass('qp-is-visible');

			animateQuickView(selectedImage, 'open');

			// fix the bottom white space
			$('body').css('overflowY', 'hidden');
		});
	}

	// Close
	function closeQuickView() {
		var close = $('.qp-close'),
				selectedImage = $('.empty-box').find('img');

		animateQuickView(selectedImage, 'close');

		// fix the bottom white space
		$('body').css('overflowY', 'scroll');
	}

	// Resize
	// center quick-view on window resize
	$(window).on('resize', function () {
		if ($('.qp-quick-view').hasClass('qp-is-visible')) {
			window.requestAnimationFrame(resizeQuickView);
		}
	});

	function resizeQuickView() {
		var quickViewLeft = ($(window).width() - $('.qp-quick-view').width()) / 2,
			quickViewTop = ($(window).height() - $('.qp-quick-view').height()) / 2;
		$('.qp-quick-view').css({
			"top": quickViewTop,
			"left": quickViewLeft,
		});
	}

	// Initiate
	// for every box with "qp-item" class, find and regroup the associate elements and assign the same behaviors.
	qpItems.each(function (index, el) {
		var group = $(el).data('group'),
			trigger = $(el).find('.qp-trigger'),
			$quickViewPanel = $('.qp-quick-view[data-group="' + group + '"]');
		$closeBtn = $quickViewPanel.find('.qp-close');

		openQuickView(trigger);

		$closeBtn.on('click', function (e) {
			closeQuickView();
		})
	});

	// Other controls

	// Use ESC key to exit quick view
	$(document).keyup(function (event) {
		//check if user has pressed 'Esc'
		if (event.which == '27') {
			closeQuickView();
		}
	});

	// Click on the blank space
	$('.qp-overlay').on('click', () => {
		closeQuickView();
	})

});
