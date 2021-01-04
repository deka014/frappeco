 $(window).on('load', function(){
            $.instagramFeed({
                'username': 'frappeco',
                'container': "#instagram",
                'display_profile': true,
                'display_biography': true,
                'display_gallery': true,
                'display_captions': false,
                'callback': null,
                'styling': true,
                'items': 9,
                'items_per_row': 3,
                'margin': 1,
                'lazy_load': true,
                'on_error': console.error
            });
        });