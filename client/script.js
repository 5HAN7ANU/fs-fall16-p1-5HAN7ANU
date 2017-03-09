document.addEventListener('DOMContentLoaded', function(){
    $('#chirpButton').attr('disabled',true);
    $('#chirpBox').focus();
    showChirps();

    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/api/users',
        contentType: 'application/json'
    }).then(function(data){
        var formControl = $('.form-control');
        for(var i = 0; i < data.length; i++){
            var formControlListItem = $('<option value="' + data[i].id + '"></option>');
            formControlListItem.text(data[i].name);
            formControl.append(formControlListItem);
        };                    
    });

    $('#chirpBox').keyup(function(e){
        if($(this).val().length != 0){
            $('#chirpButton').attr('disabled', false);
        }else{
            $('#chirpButton').attr('disabled', true);
        }
    });

    $('#chirpButton').click(function(){
        var chirpToSend = {
            message: $('#chirpBox').val(),
            user: $('#user-list').val()
        };

        $.ajax({
            method: 'POST',
            url: `http://localhost:3000/api/chirps`,
            contentType: 'application/json',
            data: JSON.stringify(chirpToSend)
        }).then(showChirps, console.log);

        $('#chirpBox').val('');
        $('#chirpButton').attr('disabled', true);
    });

    function showChirps(){
        $.ajax({
            method: 'GET',
            url: 'http://localhost:3000/api/chirps',
            contentType: 'application/json'
        }).then(function(data){
            $('.list-group-item').remove();
            for(var i = (data.length - 1); i >= 0; i--){
                var p = document.createElement('p');
                var chirp  = (data[i]);
                var link = document.createElement('a');
                link.setAttribute('href', 'http://localhost:3000/chirps/' + chirp.id + '');
                var chirpDiv = document.createElement('div');
                chirpDiv.className = 'list-group-item';
                chirpDiv.id = chirp.id;
                chirpDiv.innerHTML = chirp.timestamp + '// ' + chirp.name + ': ' + chirp.message;
                link.appendChild(chirpDiv);
                $('.list-group').append(link);
                $('.list-group').append(p);
            };
        }, console.log);
    };
});