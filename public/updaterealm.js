function updateRealm(id){
    $.ajax({
        url: '/realms/' + id,
        type: 'PUT',
        data: $('#update-realm').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
