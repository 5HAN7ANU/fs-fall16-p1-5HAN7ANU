document.addEventListener('DOMContentLoaded', function(){
    var wlpArray = window.location.pathname.split('/');
    var chirpId = wlpArray[wlpArray.length - 1];
    console.log('chirpId: ' + chirpId);

    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/api/chirps/' + chirpId,
        contentType: 'application/json'
    }).then(function(data){
        console.log(data);
        var chirp = data;
        var chirpDiv = document.createElement('div');
        chirpDiv.className = 'list-group-item';
        chirpDiv.id = chirp.id;
        chirpDiv.innerHTML = chirp.timestamp + '// ' + chirp.name + ': ' + chirp.message;
        $('.list-group').append(chirpDiv);
    });

    $('#editButton').click(function(){
        window.location.href = 'http://localhost:3000/chirps/' + chirpId + '/update';
    });

    $('#deleteButton').click(function(){
        var sure = confirm('Are you sure you want to delete this chirp?');

        if(sure){
            $.ajax({
            method: 'DELETE',
            url: 'http://localhost:3000/api/chirps/' + chirpId,
            contentType: 'text/html'
            }).then(function(){
                console.log('Chirp deleted!');
                window.location.href = 'http://localhost:3000/chirps'
            });
        };
    });
});