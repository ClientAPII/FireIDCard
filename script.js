document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('idCardCanvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = 'FN_ID_Card.png';

    let userImage = null;

    image.onload = function() {
        console.log("Background image loaded");
        canvas.width = image.width;
        canvas.height = image.height;
        updateIDCard();
    };

    image.onerror = function() {
        console.error("Failed to load background image");
    };

    const form = document.getElementById('idCardForm');
    form.addEventListener('input', updateIDCard);

    document.getElementById('uploadImage').addEventListener('change', function(event) {
        const reader = new FileReader();
        reader.onload = function(event) {
            userImage = new Image();
            userImage.src = event.target.result;
            userImage.onload = function() {
                console.log("User image loaded");
                updateIDCard();
            };
            userImage.onerror = function() {
                console.error("Failed to load user image");
            };
        };
        reader.readAsDataURL(event.target.files[0]);
    });

    function updateIDCard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);

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

        ctx.fillText(name, 100, 123);
        ctx.fillText(birthYear, 145, 145);
        ctx.fillText(gender, 120, 170);
        ctx.fillText(province, 140, 190);
        ctx.fillText(element, 130, 265);
        ctx.fillText(rank, 320, 265);
        ctx.fillText(affinities, 140, 290);
        ctx.fillText(branches, 360, 290);
        ctx.fillText(mcUsername, 180, 375);
        ctx.fillText(minorOrAdult, 195, 403);
        ctx.fillText(cardId, 145, 587);

        if (userImage) {
            ctx.drawImage(userImage, 243, 53, 170, 165);
        }

        console.log("ID card updated");
    }

    document.getElementById('downloadBtn').addEventListener('click', function() {
        // Ensure the canvas is updated before downloading
        updateIDCard();

        // Create a new 'a' element
        const link = document.createElement('a');

        // Convert the canvas content to an image (png format)
        link.href = canvas.toDataURL('image/png');

        // Set the download attribute of the link
        link.download = 'FN_ID_Card.png';

        // Simulate a click on the link
        link.click();

        console.log("Download initiated");
    });
});
