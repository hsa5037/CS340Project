function filterWeaponsByChar() {
    //get the id of the selected homeworld from the filter dropdown
    var char_id = document.getElementById('weapon_filter').value
    //construct the URL and redirect to it
    window.location = '/weapons/filter/' + parseInt(char_id)
}
