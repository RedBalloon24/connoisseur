// find post edit form
let postEditForm = document.getElementById('postEditForm');
// add submit listener to post edit form
postEditForm.addEventListener('submit', (event) => {
    // find number of uploaded images
    let imageUploads = document.getElementById('imageUpload').files.length;
    // find total number of existing images
    let existingImgs = document.querySelectorAll('.imageDeleteCheckbox').length;
    // find number of potential deletions
    let imgDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
    // find out if form can be submitted or not
    let newTotal = exispostEditFormtingImgs - imgDeletions + imageUploads;
    if(newTotal > 4) {
        event.preventDefault();
        let removalAmount = newTotal - 4
        alert(`You must remove at least ${removalAmount} more image${removalAmount === 1 ? '' : 's'}!!`);
    }
})
