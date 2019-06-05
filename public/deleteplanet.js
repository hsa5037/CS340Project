function deletePlanet(id){
    $.ajax({
        url: '/planets/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};