document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('idCardCanvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = 'FN_ID_Card.png';   // Ensure this is the correct path to your background image

    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        updateIDCard(); 
    };

    image.onerror = function() {
        console.error("Failed to load background image");
    };

    const uploadImageInput = document.getElementById('uploadImage');
    const imageEditorModal = document.getElementById('imageEditorModal');
    let croppieInstance = null;

    uploadImageInput.addEventListener('change', function(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                if (!croppieInstance) {
                    croppieInstance = new Croppie(document.getElementById('croppieContainer'), {
                        viewport: { width: 200, height: 200, type: 'square' },
                        boundary: { width: 300, height: 300 },
                        enableOrientation: true,
                        showZoomer: true,
                        enableExif: true
                    });
                }
                croppieInstance.bind({ url: e.target.result });
                imageEditorModal.style.display = 'flex';
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    document.getElementById('cropImageBtn').addEventListener('click', function() {
        croppieInstance.result({ type: 'canvas', size: 'viewport' }).then(function(croppedImage) {
            userImage = new Image();
            userImage.src = croppedImage;
            userImage.onload = updateIDCard;
            imageEditorModal.style.display = 'none';
        });
    });

    document.getElementById('idCardForm').addEventListener('input', updateIDCard);

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    }

    function updateIDCard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        ctx.font = "16px 'Minecraftia'";
        ctx.fillStyle = "black";

        const name = document.getElementById('name').value;
        const birthYear = document.getElementById('birthYear').value;
        const gender = document.getElementById('gender').value;
        const province = document.getElementById('province').value;
        const element = document.getElementById('element').value;
        const rank = document.getElementById('rank').value;
        const affinities = document.getElementById('affinities').value;
        const branches = document.getElementById('branches').value;
        const mcUsername = document.getElementById('mcUsername').value;
        const minorOrAdult = document.getElementById('minorOrAdult').value;
        const cardId = document.getElementById('cardId').value;

        wrapText(ctx, name, 100, 123, 190, 18);
        wrapText(ctx, birthYear, 145, 145, 190, 18);
        wrapText(ctx, gender, 120, 170, 190, 18);
        wrapText(ctx, province, 140, 190, 190, 18);
        wrapText(ctx, element, 130, 265, 190, 18);
        wrapText(ctx, rank, 320, 265, 190, 18);
        wrapText(ctx, affinities, 140, 290, 190, 18);
        wrapText(ctx, branches, 360, 290, 120, 18);
        wrapText(ctx, mcUsername, 180, 375, 190, 18);
        wrapText(ctx, minorOrAdult, 195, 403, 190, 18);
        wrapText(ctx, cardId, 145, 587, 190, 18);

        if (userImage) {
            ctx.drawImage(userImage, 243, 53, 170, 165); // Adjust these values as needed
        }
    }

    document.getElementById('downloadBtn').addEventListener('click', function() {
        updateIDCard();
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'FN_ID_Card.png';
        link.click();
    });
});
