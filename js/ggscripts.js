$(function() {
    'use strict';
    $('body').css('padding-top', $('#header').outerHeight());
    $(window).resize(function() { $('body').css('padding-top', $('#header').outerHeight()); });

    //Navigation Scrolling
    $('.nav a').click(function(e) {
        $('#navbar-menu li').removeClass('active');
        $(this).parent().addClass('active');
        var $scroll = $(this.hash).offset().top;
        $scroll = $scroll - 80;
        $('html,body').animate({
            scrollTop: $scroll
        }, 500);
        e.preventDefault();
    });

    // Scroll to top button	
    $('#scroll-top').click(function() {
        $('html,body').animate({
            scrollTop: 0,
        }, 500);
        return false;
    });

    //Portfolio
    $('.tiles .view a img').each(function() {
        var boxWidth = $(this).width(),
            boxHeight = $(this).height(),
            scaledHeight = (boxHeight < 180) ? 200 : boxHeight,
            scaledWidth = boxWidth;
        (boxWidth > boxHeight) ? $(this).parent().width(parseInt(boxWidth * 180 / scaledHeight)): $(this).parent().width(parseInt(180 / scaledHeight * boxWidth));

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
                url: "../contact.php",
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
                    $("#thanks").html("Your message isn't deliverd!");
                }
            });
        }
    });

});
//Scrolling function 
$(window).scroll(function() {

    if ($(window).scrollTop() > 150) {
        $('#scroll-top').show();
    } else {
        $('#scroll-top').hide();
        $('#navbar-menu li:first').addClass('active');
    }

    var scrollPos = $(window).scrollTop();
    $('.navbar-nav>li>a').each(function() {
        var currLink = $(this.hash);
        var $target = parseInt($(currLink).offset().top);
        console.log(currLink);
        if (scrollPos >= $target) {
            $('.navbar-nav>li').removeClass("active");
            currLink.parent().addClass("active");
        } else {
            currLink.parent().removeClass("active");
        }
    });
});

var googleMap = document.getElementById("map_canvas");
var myCenter = new google.maps.LatLng(17.504245, 78.389667);
//map Longitude and Latitude   
//Google Maps initialization
function initialize() {

    //Map Options    
    var mapProp = {
        center: myCenter,
        zoom: 12,
        disableDefaultUI: false
    };
    map = new google.maps.Map(googleMap, mapProp);

    var contentString = '<div class="well" style="background-color:transparent;border:0;"><div id="info-div"><h4><strong>Graphicguru India</strong></h4>' + '<h5 class="text-book"><i class="fa fa-map-marker">&nbsp; </i>Hyderabad, INDIA </h5></div>' + '<ul class="social list-inline"><li class="email" data-toggle="tooltip" data-placement="top" title="Send us your request"><a href="#contactForm" data-toggle="modal"><i class="fa fa-envelope"></i></a></li><li class="twitter"><a href="https://twitter.com/dvinodeluru" target="_blank"><i class="fa fa-twitter"></i></a></li><li class="google-plus"><a href="https://plus.google.com/116799622992799001973/about" target="_blank"><i class="fa fa-google-plus"></i></a></li><li class="linkedin"><a href="http://in.linkedin.com/in/dvinodeluru" target="_blank"><i class="fa fa-linkedin"></i></a></li></ul></div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        disableAutoPan: false,
        pixelOffset: new google.maps.Size(0, 0)

    });
    var marker = new google.maps.Marker({
        position: myCenter,
        map: map

    });
    google.maps.event.addListener(map, 'tilesloaded', function() {

        // map.panTo(marker.getPosition());
        // infowindow.setContent(contentString);
        // map.setCenter(myCenter);
        infowindow.open(map, marker);

    });
    google.maps.event.addListener(infowindow, 'domready', function() {
        $(".gm-style-iw").next("div").hide();
    });

}
google.maps.event.addDomListener(window, 'load', initialize);