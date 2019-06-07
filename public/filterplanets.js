function filterPlanetByRealm() {
    //get the id of the selected homeworld from the filter dropdown
    var realm_id = document.getElementById('realm_filter').value
    //construct the URL and redirect to it
    window.location = '/planets/filter/' + parseInt(realm_id)
}
