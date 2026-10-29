document.getElementById('copyright-year').textContent = new Date().getFullYear();
$(function() {
    'use strict';
	
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Keep the body offset pinned to the FULL (unshrunk) header height so
    // content never jumps when .header-shrink toggles on scroll
    function syncHeaderOffset() {
        var $header = $('#header');
        var wasShrunk = $header.hasClass('header-shrink');
        $header.removeClass('header-shrink');
        $('body').css('padding-top', $header.outerHeight() + 4);
        if (wasShrunk) { $header.addClass('header-shrink'); }
    }
    syncHeaderOffset();
    $(window).resize(syncHeaderOffset);

    // Navigation smooth scrolling + active state on click
    $('.nav a').click(function(e) {
        $('#navbar-menu li').removeClass('active');
        $(this).parent().addClass('active');
        var $target = $(this.hash);
        if ($target.length) {
            var scrollTo = $target.offset().top - 80;
            if (prefersReducedMotion) {
                $('html,body').scrollTop(scrollTo);
            } else {
                $('html,body').animate({ scrollTop: scrollTo }, 500);
            }
            e.preventDefault();

            // Close the mobile menu after tapping a nav link (Bootstrap 5)
            if ($(window).width() < 768 && window.bootstrap && window.bootstrap.Collapse) {
                var menuEl = document.getElementById('navbar-menu');
                if (menuEl && menuEl.classList.contains('show')) {
                    window.bootstrap.Collapse.getOrCreateInstance(menuEl).hide();
                }
            }
        }
    });

    // Scroll to top button
    $('#scroll-top').click(function() {
        if (prefersReducedMotion) {
            $('html,body').scrollTop(0);
        } else {
            $('html,body').animate({ scrollTop: 0 }, 500);
        }
        return false;
    });

    //Portfolio
    $('.tiles .view a img').each(function() {
        var boxWidth = $(this).width(),
            boxHeight = $(this).height(),
            scaledHeight = (boxHeight < 180) ? 200 : boxHeight,
            scaledWidth = boxWidth;
        (boxWidth > boxHeight) ? $(this).parent().width(parseInt(boxWidth * 180 / scaledHeight)) : $(this).parent().width(parseInt(180 / scaledHeight * boxWidth));

    });

    //Filters
    $('#filters > .filter_button').click(function() {
        var thisFilter = $(this).attr('data-filter');
        $('#filters .filter_button').removeClass('filter_current');
        $(this).addClass('filter_current');
        $('.tiles .portfolio_item').show();
        $('.tiles .portfolio_item').not(thisFilter).hide();
        return false;
    });


    //form submit
    //Contact form
    $('form.contact-form').on('submit', function(e) {
        e.preventDefault();
        var $form = $(this);
        var spamChk = $('#spamChk').val();
        if (spamChk != '7') {
            return false;
        }
        if (!$form[0].checkValidity()) {
            $form[0].reportValidity();
            return false;
        }
        var $btn = $('#sendFeedback');
        $btn.prop('disabled', true).text('Sending...');
        $.ajax({
            type: "POST",
            url: "contact.php",
            //process to mail
            data: $form.serialize(),
            success: function(msg) {
                $form.hide();
                $("#thanks").html(msg).show();
                $("#thanks")[0].scrollIntoView({ behavior: "smooth", block: "center" });
            },
            error: function() {
                $("#thanks").html('<p class="alert alert-danger">Your message couldn\'t be delivered. Please email <a href="mailto:ggindia@graphicguru.in">ggindia@graphicguru.in</a> or message <a href="https://wa.me/919849180563">WhatsApp</a>.</p>').show();
                $btn.prop('disabled', false).text('Send message');
            }
        });
        return false;
    });

    // Animate the skill progress bars once when they scroll into view
    function animateSkillBars() {
        var viewBottom = $(window).scrollTop() + $(window).height();
        $('.skill-items .progress-bar').each(function() {
            var $bar = $(this);
            if ($bar.data('animated')) return;
            if (viewBottom > $bar.offset().top + 40) {
                var width = parseInt($bar.data('width'), 10) || 0;
                if (prefersReducedMotion) {
                    $bar.css('width', width + '%').data('animated', true);
                } else {
                    $bar.animate({ width: width + '%' }, 1200).data('animated', true);
                }
            }
        });
    }

    // Scroll behaviour: shrink header, highlight the section in the nav, show scroll-to-top
    $(window).on('scroll', function() {
        var scrollPos = $(window).scrollTop();

        animateSkillBars();

        // 1. Shrink the header when scrolled down, restore it at the top
        // (body offset stays pinned to full height above, so no resync here)
        var shrink = scrollPos > 60;
        if ($('#header').hasClass('header-shrink') !== shrink) {
            $('#header').toggleClass('header-shrink', shrink);
        }

        // 2. Scrollspy - highlight the nav item matching the section in view
        if (scrollPos < 10) {
            $('#navbar-menu li').removeClass('active');
            $('#navbar-menu li:first').addClass('active');
        } else {
            var spyOffset = 100;
            $('.navbar-nav>li>a').each(function() {
                var $section = $(this.hash);
                if ($section.length && (scrollPos + spyOffset) >= $section.offset().top) {
                    $('.navbar-nav>li').removeClass('active');
                    $(this).parent().addClass('active');
                }
            });
        }

        // 3. Scroll-to-top button visibility
        if (scrollPos > 150) {
            $('#scroll-top').show();
        } else {
            $('#scroll-top').hide();
        }
    });

    // Kick off the progress bars on first paint (in case the section is already visible)
    animateSkillBars();

	function runCounter(el) {
                var target = parseInt(el.getAttribute('data-gg-count'), 10) || 0;
                if (reduceMotion || !('IntersectionObserver' in window)) {
                    el.textContent = target;
                    return;
                }
                var duration = 1600;
                var start = null;
                function step(ts) {
                    if (!start) start = ts;
                    var progress = Math.min((ts - start) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                }
                window.requestAnimationFrame(step);
            }

            if ('IntersectionObserver' in window) {
                var seen = new WeakSet();
                var counterObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting && !seen.has(entry.target)) {
                            seen.add(entry.target);
                            runCounter(entry.target);
                            counterObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.4 });
                document.querySelectorAll('.gg-counter').forEach(function (el) { counterObserver.observe(el); });

                // Reveal-on-scroll for .gg-reveal blocks
                var revealObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('gg-in');
                            revealObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
                document.querySelectorAll('.gg-reveal').forEach(function (el) { revealObserver.observe(el); });
            } else {
                document.querySelectorAll('.gg-counter').forEach(function (el) { el.textContent = el.getAttribute('data-gg-count'); });
                document.querySelectorAll('.gg-reveal').forEach(function (el) { el.classList.add('gg-in'); });
            }

});
