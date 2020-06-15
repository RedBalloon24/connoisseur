// add click listener for clearing of rating from edit/new form
$('.clear-rating').click(function() {
    $(this).siblings('.input-no-rate').click();
});