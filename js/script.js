var items = [];

function openQRCamera(node) {
    var reader = new FileReader();
    reader.onload = function() {
        node.value = "";
        qrcode.callback = function(res) {
            if(res instanceof Error) {
                alert("No QR code found.");
            } else {
                document.getElementById('serial').value = res;
            }
        };
        qrcode.decode(reader.result);
    };
    reader.readAsDataURL(node.files[0]);
}

function showQRIntro() {
    return confirm("Use your camera to take a picture of a QR code.");
}

$(document).ready(function() {
    $('#serial').on('focus',function() {
        openQRCamera(document.getElementById('qr'));
    });

    $('.btn-add').on('click', function() {
        $('#serials-list').append($('<li>').text($('#serial').val()));
        items.concat([$('#serial').val()]);
    });

    $('button[data-message], input[type="radio"]').on('click', function() {
        $.ajax({
            url: 'https://hooks.zapier.com/hooks/catch/3118175/adg003/',
            method: 'POST',
            dataType: 'json',
            data:
                {
                    serials: items
                    timestamp: Date.now(),
                    message: $(this).data('message')
                }
        }).done(function(data) {
            console.log('sent!');
            codnsole.log(data);
        });
        return 0;
    });
});