function updateChar(id){
    $.ajax({
        url: '/characters/' + id,
        type: 'PUT',
        data: $('#update-char').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
