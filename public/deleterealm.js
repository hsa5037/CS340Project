function deleterealm(id){
    $.ajax({
        url: '/realm/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};