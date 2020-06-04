// add click listener for clearing of distance values from search field
const clear = document.getElementById('clear-distance');

clear.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('location').value ='';
    document.querySelector('input[type=radio]:checked').checked = false;
})


// add click listener for clearing of rating from search field
$('.clear-rating').click(function() {
    $(this).siblings('.input-no-rate').click();
});