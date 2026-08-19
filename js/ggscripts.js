$(function() {
    'use strict';

    // Keep the body offset in sync with the fixed header height
    function syncHeaderOffset() {
        $('body').css('padding-top', $('#header').outerHeight() + 4);
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
            $('html,body').animate({ scrollTop: scrollTo }, 500);
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
        $('html,body').animate({ scrollTop: 0 }, 500);
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
    $("#sendFeedback").click(function() {
        var spamChk = $('#spamChk').val();
        if (spamChk == '7') {
            $.ajax({
                type: "POST",
                url: "contact.php",
                //process to mail
                data: $('form.contact-form').serialize(),
                success: function(msg) {
                    $("#thanks").html(msg);
                    //hide button and show thank you
                    $('.modal-header, form.contact-form, .modal-footer').hide();
                    setTimeout(function() {
                        $('#contactForm').modal('hide');
                    }, 2000);
                    //hide popup  
                },
                error: function() {
                    $("#thanks").html("Your message isn't delivered!");
                }
            });
        }
    });

    // Animate the skill progress bars once when they scroll into view
    function animateSkillBars() {
        var viewBottom = $(window).scrollTop() + $(window).height();
        $('.skill-items .progress-bar').each(function() {
            var $bar = $(this);
            if ($bar.data('animated')) return;
            if (viewBottom > $bar.offset().top + 40) {
                var width = parseInt($bar.data('width'), 10) || 0;
                $bar.animate({ width: width + '%' }, 1200).data('animated', true);
            }
        });
    }

    // Scroll behaviour: shrink header, highlight the section in the nav, show scroll-to-top
    $(window).on('scroll', function() {
        var scrollPos = $(window).scrollTop();

        animateSkillBars();

        // 1. Shrink the header when scrolled down, restore it at the top
        var shrink = scrollPos > 60;
        if ($('#header').hasClass('header-shrink') !== shrink) {
            $('#header').toggleClass('header-shrink', shrink);
            syncHeaderOffset();
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

});
