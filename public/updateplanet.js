function updatePlanet(id){
    $.ajax({
        url: '/planets/' + id,
        type: 'PUT',
        data: $('#update-planet').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
