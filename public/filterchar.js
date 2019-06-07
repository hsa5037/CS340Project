function filterCharByPlanet() {
    //get the id of the selected homeworld from the filter dropdown
    var planet_id = document.getElementById('planet_filter').value
    //construct the URL and redirect to it
    window.location = '/characters/filter/' + parseInt(planet_id)
}


