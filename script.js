document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('idCardCanvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = 'FN_ID_Card.png';

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

    document.getElementById('copyBtn').addEventListener('click', function() {
        updateIDCard();
        canvas.toBlob(function(blob) {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(
                function() { console.log('Image copied to clipboard'); },
                function(err) { console.error('Error copying image: ', err); }
            );
        });
    });
    

    document.getElementById('idCardForm').addEventListener('input', updateIDCard);

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        let words = text.split(' ');
        let line = '';
        let lines = [];

        words.forEach((word) => {
            let testLine = line + word + ' ';
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;

            if (testWidth > maxWidth && line !== '') {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        });

        lines.push(line.trim());  
        return lines;
    }

    function updateIDCard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        ctx.font = "14px 'Minecraftia'";
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

        const nameMaxWidth = 145;
        const nameX = 100;
        const nameY = 123;
        const lineHeight = 18;

        // Wrap text for 'name'
        const nameLines = wrapText(ctx, name, nameX, nameY, nameMaxWidth, lineHeight);
        const nameHeight = nameLines.length * lineHeight;

        let adjustedNameY = nameY;
        if (nameLines.length > 1) {
            adjustedNameY = nameY - ((nameLines.length - 1) * lineHeight);
        }

        nameLines.forEach((line, index) => {
            ctx.fillText(line, nameX, adjustedNameY + (index * lineHeight));
        });

        ctx.fillText(birthYear, 145, 145);
        ctx.fillText(gender, 120, 170);
        ctx.fillText(province, 140, 190);
        ctx.fillText(element, 130, 265);
        ctx.fillText(rank, 320, 265);

        // affinities
        const affinitiesMaxWidth = 115;
        const affinitiesX = 140;
        const affinitiesY = 290;
        const affinitiesLines = wrapText(ctx, affinities, affinitiesX, affinitiesY, affinitiesMaxWidth, lineHeight);
        affinitiesLines.forEach((line, index) => {
            ctx.fillText(line, affinitiesX, affinitiesY + (index * lineHeight));
        });

        // Branches
        const branchesMaxWidth = 105;
        const branchesX = 360;
        const branchesY = 290;
        const branchesLines = wrapText(ctx, branches, branchesX, branchesY, branchesMaxWidth, lineHeight);
        branchesLines.forEach((line, index) => {
            ctx.fillText(line, branchesX, branchesY + (index * lineHeight));
        });

        ctx.fillText(mcUsername, 180, 375);
        ctx.fillText(minorOrAdult, 195, 403);
        ctx.fillText(cardId, 145, 587);

        if (userImage) {
            ctx.drawImage(userImage, 243, 53, 170, 165);
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
