
$(document).ready(function() { 
// $(function () {
    
    /* Tags function */
    
    var // all variables
        wrapperTags = $('.tags .wrapper-tags'),
        viewTags    = $('.tags .wrapper-tags .view-tags'),
        inputTag    = $('.tags .wrapper-tags .input-tag'),
        btnAddTags  = $('.tags .add-tags'),
        alertErrorInAdd     = $('.show-all-tags .alert-danger'),
        showTagsWhenResult  = $('.show-all-tags .show-tags'),
        showCountCharactersTag = $('.tags .show-count-all .count-character-tag'),
        showCountTags = $('.tags .show-count-all .count-tags'),
        maxCharactersLengthTag  = 20,
        maxLengthTags  = 10,
        tags = ['fingourment', 'frappeco'],
        addTag      = (textTag) => {
            var newTag = '<span class="tag" data-tag="'+ textTag +'">' + textTag + '<i class="fa fa-close"></i></span>';
            inputTag.before(newTag);
        },
        removeTag = function (textTag, animateRemove = 'hard') {
            var indexTag = tags.indexOf(textTag);
            tags.splice(indexTag, 1);
            if (animateRemove === 'hard') {
                viewTags.find('.tag[data-tag="' + textTag + '"]').remove();
                inputTag.focus();
            } else if ('slideLeft') {
                viewTags.find('.tag[data-tag="' + textTag + '"]').animate({
                    'width': 0,
                    'padding': 0,
                    'margin': 0
                }, 300, function () { 
                    $(this).remove();
                    inputTag.focus();
                });
            }
            showCountTags.find('span').html(maxLengthTags - tags.length);
        };

    showCountCharactersTag.find('span').html(maxCharactersLengthTag);
    showCountTags.find('span').html(maxLengthTags - tags.length);
    /* Start set dimentions */
    
    var hiddenDiv = $('.hiddendiv').first(); // this element in hidden by display: none in file css
    if (!hiddenDiv.length) {
        hiddenDiv = $('<div class="hiddendiv"></div>');
        $('body').prepend(hiddenDiv);
    }
    
    function autoWidth(myInput) {
        var fontFamily = myInput.css('font-family'),
            fontSize = myInput.css('font-size');
        
        if (fontSize) { hiddenDiv.css('font-size', fontSize); }
        if (fontFamily) { hiddenDiv.css('font-family', fontFamily); }
        
        hiddenDiv.text(myInput.val().trim());
        myInput.width(hiddenDiv.width());
    }
    /* End set dimentions */
    
    /* Show All error */
    var loopShowError    = true;
    function showError(type) {
        var duration = 3000;
        if (loopShowError === true) {
            $('.tags .show-error' + '.' + type).slideDown(200).delay(duration).slideUp(200);
            loopShowError = false;
            setTimeout(() => {
                loopShowError = true;
            }, duration);
        }
    }
    /* trigger functions */
    
    inputTag.each(function () {
        autoWidth($(this));    
    });
    
    // remove comma and space
    inputTag.on('input', function () {
        autoWidth($(this));
        $(this).val($(this).val().trim().replace(/\s|,/, ''));
        var value = $(this).val(),
            diffrentChars = maxCharactersLengthTag - value.length;
        // show count characters left
        if (diffrentChars > 0) {
            showCountCharactersTag.find('span').html(diffrentChars);
        } else {
            showCountCharactersTag.find('span').html(0);
        }
        
        if (value.length > maxCharactersLengthTag) {
            showCountCharactersTag.addClass('max');
        } else {
            showCountCharactersTag.removeClass('max');
        }
    });
    
    var numRepaierRemoveTag = 1;
    inputTag.on('keydown', function (e) { numRepaierRemoveTag = $(this).val() == '' ? 0 : 1; });
        
    // add tag and validation
    inputTag.on('keyup', function (e) {
        var key = e.keyCode || e.which,
            currentVal  = $(this).val().trim().replace(/\s|,/, ''),
            condationKey = key === 32 || key === 13 || key === 188,
            patternTag  = /^[A-Za-z0-9ء-ي_]+$/g,
            x = 1;
        $(this).val(currentVal);
        
        if (currentVal.charCodeAt(0) > 1500) {   
            condationKey = key === 32 || key === 13;
        } else {
            condationKey = key === 32 || key === 13 || key === 188;
        }
        
        /* Add tag */
        // check on press if enter or space or comma for add tag
        if (condationKey) {
            if (currentVal == '') {
                showError('length');
            } else if (/^_/.test(currentVal)) {
                showError('startChar');
            } else if (tags.length == maxLengthTags) {
                showError('lengthTags');
            } else if (!patternTag.test(currentVal)) {
                showError('validChar');
            } else if (currentVal.length > maxCharactersLengthTag) {
                showError('length');
            } else {
                if (currentVal.charAt(currentVal.length - 1) == '_') {
                    currentVal = currentVal.replace(currentVal.charAt(currentVal.length - 1), '');
                }       
                if (tags.indexOf(currentVal) != -1) {
                    showError('already');
                } else {
                    $('.tags .show-error').css('display', 'none');
                    tags.push(currentVal);
                    inputTag.val('');
                    addTag(currentVal);
                    showCountCharactersTag.find('span').html(maxCharactersLengthTag);
                    showCountTags.find('span').html(maxLengthTags - tags.length);
                }
            }
            // remove tag when press on delete or backspace    
        } else if (key === 8 || key === 46) {
            if (numRepaierRemoveTag === 0) {
                var lastTag = tags[tags.length - 1];
                removeTag(lastTag);
                inputTag.val(lastTag);
            }
        }
    });
    
    
    // Remove tag by click in btn remove (x)
    viewTags.on('click', '.tag i', function (e) {
        var textTag = $(this).parent().attr('data-tag');
        removeTag(textTag, 'slideLeft');
    });
    
    // add Focus on input when click anything in wrapper tags
    inputTag.focus();
    wrapperTags.on('click', function () {
        inputTag.focus();
    });
    viewTags.on('click', '.tag', function (e) {
        e.stopPropagation();
    });
    inputTag.focus(function () {
        wrapperTags.addClass('focus');
        alertErrorInAdd.slideUp(200);
    }).blur(function () {
        wrapperTags.removeClass('focus');
    });
})