function updateChar(id){
    $.ajax({
        url: '/characters/' + id,
        type: 'PUT',
        data: $('#update-character').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
