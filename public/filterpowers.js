function filterPowerByChar() {
    //get the id of the selected homeworld from the filter dropdown
    var char_id = document.getElementById('character_filter').value
    //construct the URL and redirect to it
    window.location = '/powers/filter/' + parseInt(char_id)
}
