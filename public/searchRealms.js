function searchRealmsByName() {
    //get the first name 
    var search_string  = document.getElementById('search_string').value
    //construct the URL and redirect to it 
    window.location = '/realms/search/' + encodeURI(search_string)
    
}