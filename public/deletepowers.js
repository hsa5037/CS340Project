function deletePower(id){
    $.ajax({
        url: '/powers/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};