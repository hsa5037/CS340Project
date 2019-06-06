function deleteRealm(id){
    $.ajax({
        url: '/realms/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};