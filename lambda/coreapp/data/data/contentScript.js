$(document).ready(function () {
    $(document).bind('clientScript.Loaded', function () {
        $('.lessonReview').unbind('click');
        $('.lessonReview').bind('click', function (event) {
            var clickedItem = $(this);
            var reviewId = clickedItem.attr('id');
            var dialogId = reviewId.replace('review', 'lesson');
            $('#' + dialogId).modal('toggle');
            $('#' + dialogId).modal('show');
        });
    });    
});