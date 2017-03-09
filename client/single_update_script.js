document.addEventListener('DOMContentLoaded', function(){
    var wlpArray = window.location.pathname.split('/');
    var chirpId = wlpArray[wlpArray.length - 2];
    console.log('chirpId: ' + chirpId);

    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/api/chirps/' + chirpId,
        contentType: 'application/json'
    }).then(function(data){
        console.log('data: ' + data);
        var chirp = data;
        $('#chirpBox').val(chirp.message);
        $('#userButton').text(chirp.name);
    });

    $('#updateButton').click(function(){
        var chirpMessage = {
            message: $('#chirpBox').val()
        };

        $.ajax({
            method: 'PUT',
            url: 'http://localhost:3000/api/chirps/' + chirpId,
            contentType: 'application/json',
            data: JSON.stringify(chirpMessage)
        }).then(function(data){
            window.location.href = 'http://localhost:3000/chirps/' + chirpId;
        });
    });
});