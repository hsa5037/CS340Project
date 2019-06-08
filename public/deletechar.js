function deleteChar(id){
    $.ajax({
        url: '/characters/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};


function deleteCharPow(pid, cid){
  $.ajax({
      url: '/powers/cid/' + cid + '/pow/' + pid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};