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


// add click listener for clearing of wine type from search field
const clearType = document.getElementById('clear-type');

clearType.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('input[name=type]').value ='';
    document.querySelector('input[type=radio]:checked').checked = false;
})

// sidebar filter open and close functions
function openNav() {
    document.getElementById("mySidebar").style.width = "280px";
    document.getElementById("main").style.marginLeft = "250px";

}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}