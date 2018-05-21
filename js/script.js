/*function openQRCamera(node) {
    var reader = new FileReader();
    reader.onload = function() {
        node.value = "";
        qrcode.callback = function(res) {
            if(res instanceof Error) {
                alert("No QR code found.");
            } else {
                node.parentNode.previousElementSibling.value = res;
            }
        };
        qrcode.decode(reader.result);
    };
    reader.readAsDataURL(node.files[0]);
}

function showQRIntro() {
    return confirm("Use your camera to take a picture of a QR code.");
}
*/
let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
scanner.addListener('scan', function (content) {
    console.log(content);
});

Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
        scanner.start(cameras[0]);
    } else {
        console.error('No cameras found.');
    }
}).catch(function (e) {
    console.error(e);
});

$(document).ready(function() {
    $('#serial').on('focus',function() {
        openQRCamera(document.getElementById('qr'));
    });

    $('.qrcode-text-btn').click(function() {
        openQRCamera(document.getElementById('qr'));
    });

    $('button[data-message], input[type="radio"]').on('click', function() {
        $.ajax({
                url: 'https://hooks.zapier.com/hooks/catch/3118175/adg003/',
                method: 'POST',
                dataType: 'json',
                data:
                {
                    serial: $('#serial').val(),
                    timestamp: Date.now(),
                    message: $(this).data('message')
                }
            }).done(function(data) {
                console.log('sent!');
                console.log(data);
            });
        return 0;
    });
});