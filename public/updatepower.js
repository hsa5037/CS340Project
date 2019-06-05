function updatePower(id){
    $.ajax({
        url: '/powers/' + id,
        type: 'PUT',
        data: $('#update-power').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
