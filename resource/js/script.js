$(window).on('load', function () {
    $('body').removeClass('.preload');
    $('#loader').delay(400).fadeOut('fast');
});

$(document).ready(function () {
    // Fetch Blog Posts from JSON
    function fetchBlogPosts(callback) {
        $.getJSON('./resource/data/blog-posts.json', function (data) {
            callback(data);
        }).fail(function () {
            console.error('Error loading blog posts');
            callback([]);
        });
    }

    // Render Blog Posts
    function renderBlogPosts(posts) {
        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Render Latest Blog Posts on index.html
        if ($('.latest-blog .post-grid').length) {
            $('.latest-blog .post-grid').empty();
            posts.slice(0, 6).forEach(post => {
                $('.latest-blog .post-grid').append(`
                    <div class="post-box">
                        <div class="post-img"><img src="${post.image}" alt="${post.title}" aria-label="${post.title}"></div>
                        <div class="post-wrapper">
                            <div class="post-category">${post.date}</div>
                            <a href="${post.link}" class="post-title">${post.title}</a>
                            <div class="post-content">
                                <p>${post.summary}</p>
                            </div>
                            <a href="${post.link}" class="post-read-more" aria-label="Read more about ${post.title}">Read More</a>
                        </div>
                    </div>
                `);
            });

            // Initialize Slick slider on mobile (≤768px)
            if ($(window).width() <= 768) {
                $('.latest-blog .post-grid').slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true,
                    infinite: true,
                    autoplay: true,
                    autoplaySpeed: 3000,
                    centerMode: true,
                    centerPadding: '20px',
                    mobileFirst: true
                });
            }
        }

        // Render Blog Posts on page-blog.html
        if ($('.blog-section').length) {
            $('.featured-post').empty();
            if (posts.length > 0) {
                $('.featured-post').append(`
                    <div class="post-box featured">
                        <div class="post-img"><img src="${posts[0].image}" alt="${posts[0].title}"></div>
                        <div class="post-wrapper">
                            <div class="post-category">${posts[0].date}</div>
                            <a href="${posts[0].link}" class="post-title">${posts[0].title}</a>
                            <div class="post-content">
                                <p>${posts[0].summary}</p>
                            </div>
                            <a href="${posts[0].link}" class="post-read-more" aria-label="Read more about ${posts[0].title}">Read More</a>
                        </div>
                    </div>
                `);
            }
            $('.blog-grid').empty();
            posts.slice(1).forEach(post => {
                $('.blog-grid').append(`
                    <div class="post-box col-md-6 col-lg-4 ${post.category}">
                        <div class="inner">
                            <div class="post-img"><img src="${post.image}" alt="${post.title}"></div>
                            <div class="post-wrapper">
                                <div class="post-category">${post.date}</div>
                                <a href="${post.link}" class="post-title">${post.title}</a>
                                <div class="post-content">
                                    <p>${post.summary}</p>
                                </div>
                                <a href="${post.link}" class="post-read-more" aria-label="Read more about ${post.title}">Read More</a>
                            </div>
                        </div>
                    </div>
                `);
            });
        }
    }

    // Handle window resize to initialize/destroy Slick slider
    $(window).on('resize', function () {
        if ($(window).width() <= 768) {
            if (!$('.latest-blog .post-grid').hasClass('slick-initialized')) {
                $('.latest-blog .post-grid').slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true,
                    infinite: true,
                    autoplay: true,
                    autoplaySpeed: 3000,
                    centerMode: true,
                    centerPadding: '20px',
                    mobileFirst: true
                });
            }
        } else {
            if ($('.latest-blog .post-grid').hasClass('slick-initialized')) {
                $('.latest-blog .post-grid').slick('unslick');
            }
        }
    });

    // Fetch and Render Blog Posts
    fetchBlogPosts(renderBlogPosts);

    // Category Filter
    $('.category-filter .filter-item').on('click', function (e) {
        e.preventDefault();
        $('.category-filter .filter-item').removeClass('active');
        $(this).addClass('active');
        const category = $(this).data('category');
        $('.blog-grid .post-box').each(function () {
            if (category === 'all' || $(this).hasClass(category)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // Search Functionality
    $('#blog-search').on('input', function () {
        const query = $(this).val().toLowerCase();
        fetchBlogPosts(function (posts) {
            const filteredPosts = posts.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.summary.toLowerCase().includes(query)
            );
            renderBlogPosts(filteredPosts);
        });
    });

    // Add "View More" button functionality
    $('.view-more .book-now-btn').on('click', function (e) {
        e.preventDefault();
        window.location.href = 'page-blog.html';
    });

    // Waypoint - nav sticky and scroll-top
    $('.services-section, .blog-section').waypoint(function (direction) {
        if (direction === 'down') {
            $('nav').addClass('nav-sticky');
            $('.scroll-top').css({
                'visibility': 'visible',
                'opacity': '1'
            });
        } else {
            $('nav').removeClass('nav-sticky');
            $('.scroll-top').css({
                'visibility': 'hidden',
                'opacity': '0'
            });
        }
    }, {
        offset: '0px'
    });

    // Search button
    $('.search-button').on('click', function () {
        $('.search-form').css({
            'opacity': '1',
            'visibility': 'visible'
        });
    });
    $('.close-search').on('click', function () {
        $('.search-form').css({
            'opacity': '0',
            'visibility': 'hidden'
        });
    });

    // Shop cart button
    $('.bag-button').on('mouseenter', function () {
        $('.shop-cart').css({
            'opacity': '1',
            'visibility': 'visible'
        });
    });
    $('.bag-button').on('click', function () {
        $('.shop-cart').css({
            'opacity': '0',
            'visibility': 'hidden'
        });
    });
    $('.shop-cart').on('mouseleave', function () {
        $('.shop-cart').css({
            'opacity': '0',
            'visibility': 'hidden'
        });
    });

    // Menu popup slide
    $('.slide-icon').on('click', function () {
        $('.menu-popup').css('width', '450px');
    });
    $('.menu-popup .close-icon').on('click', function () {
        $('.menu-popup').css('width', '0');
    });

    // Mobile navigation icon
    let windows = $(window);
    if (windows.width() < 1190) {
        $('.main-nav').attr('id', 'main-nav-mobile');
    }
    windows.resize(function () {
        let width = windows.width();
        if (width < 1190) {
            $('.main-nav').attr('id', 'main-nav-mobile');
        } else {
            $('.main-nav').attr('id', '');
        }
    });

    // Dropdown navigation
    var addDropdownIcon = function () {
        $('.menu-item-has-child').each(function () {
            let currentItem = $(this).find('.nav-link');
            let currentText = currentItem.text();
            currentItem.html(currentText + '<span class="icon-dropdown"><i class="fal fa-caret-down"></i></span>')
        });
    }
    if ($('.main-nav').attr('id') === 'main-nav-mobile') {
        addDropdownIcon();
    }
    windows.resize(function () {
        if (windows.width() < 1190) {
            addDropdownIcon();
        } else {
            $('.icon-dropdown').css('display', 'none');
        }
    });

    // Slide header
    $('.slide-item').each(function (index) {
        $(this).attr('id', index + 1);
    });
    $('.slide-dot li').each(function (index) {
        $(this).attr('id', index + 1);
    });

    var addIndexForPrevSlide = function () {
        let totalSlides = $('.slide-item').length;
        let currentIndex = $('.slide-item.active').attr('id');
        let Index = 1;
        if (parseInt(currentIndex) == 1) {
            Index = totalSlides;
        } else {
            Index = parseInt(currentIndex) - 1;
        }
        $('#prev-slide').text(Index + '/' + totalSlides);
    };

    var addIndexForNextSlide = function () {
        let totalSlides = $('.slide-item').length;
        let currentIndex = $('.slide-item.active').attr('id');
        let Index = 1;
        if (parseInt(currentIndex) == 3) {
            Index = 1;
        } else {
            Index = parseInt(currentIndex) + 1;
        }
        $('#next-slide').text(Index + '/' + totalSlides);
    };

    addIndexForPrevSlide();
    addIndexForNextSlide();

    var addAnimatedForSlideText = function () {
        let activeSlide = $('.slide-item.active .slide-text');
        activeSlide.find('h3').addClass('animated fadeInUp');
        activeSlide.find('h1').addClass('animated fadeInDown');
        activeSlide.find('p').addClass('animated fadeInUp');
        activeSlide.find('button').addClass('animated fadeInRight');
    };
    var removeAnimatedForSlideText = function () {
        let activeSlide = $('.slide-item.active .slide-text');
        activeSlide.find('h3').removeClass('animated fadeInUp');
        activeSlide.find('h1').removeClass('animated fadeInDown');
        activeSlide.find('p').removeClass('animated fadeInUp');
        activeSlide.find('button').removeClass('animated fadeInRight');
    };

    addAnimatedForSlideText();

    var toNextSlide = function () {
        let activeSlide = $('.slide-item.active');
        let nextSlide = activeSlide.next();
        let activeSlideDot = $('.slide-dot li.active');
        let nextSlideDot = activeSlideDot.next();

        if (nextSlide.length !== 0) {
            removeAnimatedForSlideText();
            activeSlide.addClass('fadeOut').one('webkitAnimationEnd', function () {
                $('.fadeOut').removeClass('fadeOut').removeClass('active');
            });

            nextSlide.addClass('fadeIn active').one('webkitAnimationEnd', function () {
                addAnimatedForSlideText();
                $('.fadeIn').removeClass('fadeIn');
                addIndexForPrevSlide();
                addIndexForNextSlide();
            });

            activeSlideDot.removeClass('active');
            nextSlideDot.addClass('active');
        } else {
            removeAnimatedForSlideText();
            activeSlide.addClass('fadeOut').one('webkitAnimationEnd', function () {
                $('.fadeOut').removeClass('fadeOut').removeClass('active');
            });
            $('.slide-item:first-child').addClass('fadeIn active').one('webkitAnimationEnd', function () {
                addAnimatedForSlideText();
                $('.fadeIn').removeClass('fadeIn');
                addIndexForPrevSlide();
                addIndexForNextSlide();
            });
            activeSlideDot.removeClass('active');
            $('.slide-dot li:first-child').addClass('active');
        }
    };

    var toPrevSlide = function () {
        let activeSlide = $('.slide-item.active');
        let prevSlide = activeSlide.prev();
        let activeSlideDot = $('.slide-dot li.active');
        let prevSlideDot = activeSlideDot.prev();
        if (prevSlide.length !== 0) {
            removeAnimatedForSlideText();
            activeSlide.addClass('fadeOut').one('webkitAnimationEnd', function () {
                $('.fadeOut').removeClass('fadeOut').removeClass('active');
            });
            prevSlide.addClass('fadeIn active').one('webkitAnimationEnd', function () {
                addAnimatedForSlideText();
                $('.fadeIn').removeClass('fadeIn');
                addIndexForPrevSlide();
                addIndexForNextSlide();
            });
            activeSlideDot.removeClass('active');
            prevSlideDot.addClass('active');
        } else {
            removeAnimatedForSlideText();
            activeSlide.addClass('fadeOut').one('webkitAnimationEnd', function () {
                $('.fadeOut').removeClass('fadeOut').removeClass('active');
            });
            $('.slide-item:last-child').addClass('fadeIn active').one('webkitAnimationEnd', function () {
                addAnimatedForSlideText();
                $('.fadeIn').removeClass('fadeIn');
                addIndexForPrevSlide();
                addIndexForNextSlide();
            });
            activeSlideDot.removeClass('active');
            $('.slide-dot li:last-child').addClass('active');
        }
    };

    var autoTurnSlide = function () {
        let idInterval = setInterval(() => {
            let rand = Math.random();
            if (rand < 0.5)
                toNextSlide();
            else
                toPrevSlide();
        }, 8000);
    };

    $('#next-slide').on('click', function () {
        toNextSlide();
    });

    $('#prev-slide').on('click', function () {
        toPrevSlide();
    });

    autoTurnSlide();

    $('.slide-dot li').on('click', function () {
        $('.slide-dot li.active').removeClass('active');
        $(this).addClass('active');
        let id = $(this).attr('id');
        let activeSlide = $('.slide-item.active');
        let nextSlide = null;
        $('.slide-item').each(function () {
            if ($(this).attr('id') === id)
                nextSlide = $(this);
        });

        removeAnimatedForSlideText();
        activeSlide.addClass('fadeOut').one('webkitAnimationEnd', function () {
            $('.fadeOut').removeClass('fadeOut').removeClass('active');
        });

        nextSlide.addClass('fadeIn active').one('webkitAnimationEnd', function () {
            addAnimatedForSlideText();
            $('.fadeIn').removeClass('fadeIn');
            addIndexForPrevSlide();
            addIndexForNextSlide();
        });
    });

    // Scroll Top
    $('a').on('click', function (event) {
        if ($(this).attr('href').startsWith('#')) {
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top
            }, 1000);
            event.preventDefault();
        }
    });

    // Embed video
    let videoEmbed = $('.video-embed');
    $('.play-btn').on('click', function () {
        videoEmbed.show(350);
        $('#overlay').css('display', 'block');
        $('.close-btn').show(350);
    });
    $('.about-section .close-btn').on('click', function () {
        videoEmbed.hide(350);
        $('#overlay').css('display', 'none');
        $('.close-btn').hide(350);
    });

    // Filter - Pricing Plan
    let activeFilter = $('.filter-item.active');
    var filterPricing = function () {
        $('.pricing-menu li').each(function () {
            let option = $('#filter-option').attr('data-id');
            let currentElem = $(this);
            if (currentElem.css('display') === 'none')
                currentElem.css('display', 'flex');
            if (currentElem.hasClass(option) === false && option !== 'all') {
                currentElem.addClass('quicksand-animate-on').one('webkitAnimationEnd', function () {
                    currentElem.removeClass('quicksand-animate-on');
                    currentElem.css('display', 'none');
                });
            }
            if (option === 'all') {
                currentElem.addClass('quicksand-animate-off').one('webkitAnimationEnd', function () {
                    currentElem.removeClass('quicksand-animate-off');
                });
            }
        });
    };

    $('.filter-item').on('click', function () {
        activeFilter.removeClass('active');
        $(this).addClass('active');
        activeFilter = $(this);
        $('#filter-option').attr('data-id', activeFilter.attr('data-id'));
        filterPricing();
    });

    // Collection section
    $('.collection').magnificPopup({
        type: 'image',
        delegate: 'a',
        fixedContentPos: false,
        gallery: {
            enabled: true
        },
        removalDelay: 300,
        mainClass: 'mfp-fade',
        zoom: {
            enabled: true,
            duration: 550,
            easing: 'ease-in-out',
            opener: function (openerElement) {
                return openerElement.is('img') ? openerElement : openerElement.find('img');
            }
        }
    });

    // Detect mouse direction
    var direction = '';
    var oldX = 0;
    var oldY = 0;
    var mousemovemethod = function (e) {
        if (e.pageX > oldX && e.pageY == oldY) {
            direction = 'left-right';
        }
        else if (e.pageX == oldX && e.pageY > oldY) {
            direction = 'top-bottom';
        }
        else if (e.pageX == oldX && e.pageY < oldY) {
            direction = 'bottom-top';
        }
        else if (e.pageX < oldX && e.pageY == oldY) {
            direction = 'right-left';
        }
        oldX = e.pageX;
        oldY = e.pageY;
    };
    document.addEventListener('mousemove', mousemovemethod);

    $('.collect-item').on('mouseenter', function () {
        let active = $(this);
        let currentDirec;
        if (typeof currentDirec == 'undefined') {
            currentDirec = direction;
            document.removeEventListener('mousemove mousedown', mousemovemethod);
        }
        active.addClass('appear-' + currentDirec);
        active.find('.plus-icon').show(150);
        document.addEventListener('mousemove', mousemovemethod);
        active.on('mouseleave', function () {
            active.find('.plus-icon').hide(150);
            active.addClass('disappear-' + currentDirec).one('webkitAnimationEnd', function () {
                active.removeClass('appear-' + currentDirec);
                active.removeClass('disappear-' + currentDirec);
            });
        });
    });

    // Slick slider team
    $('.team-item').clone().addClass('clone').appendTo('.team-slider');
    $('.team-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 1000,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }, {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
    $('.team-slider').slick('refresh');

    // Maps section
    $('.maps .submit-btn').on('click', function () {
        validateForm('.maps');
    });
});