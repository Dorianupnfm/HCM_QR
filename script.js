const QR_CODE_WIDTH = 200;
const QR_CODE_HEIGHT = 200;
const DOWNLOAD_CANVAS_WIDTH = 1080;
const DOWNLOAD_CANVAS_HEIGHT = 1920;

function generateQRCode() {
    const fuelType = document.getElementById("fuel-type").value;
    const comment = document.getElementById("comment").value;
    const amountForQR = parseFloat(document.getElementById("amount").value);

    if (amountForQR > currentAmount) {
        currentAmount -= amountForQR;
        document.getElementById("current-amount").innerHTML = `<span style="color: red">-$${Math.abs(currentAmount).toFixed(2)}</span>`;
    } else {
        currentAmount -= amountForQR;
        document.getElementById("current-amount").innerHTML = `$${currentAmount.toFixed(2)}`;
    }

    const qrData = `https://example.com/qr?amount=${amountForQR}&fuelType=${fuelType}&comment=${comment}`;
    const qrCode = new QRCode(document.getElementById("qr-code"), {
        text: qrData,
        width: QR_CODE_WIDTH,
        height: QR_CODE_HEIGHT,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.H
    });

    document.getElementById("download-link").style.display = "block";
}


function downloadQR() {
    const qrCanvas = document.getElementById("qr-code").getElementsByTagName("canvas")[0];
    const downloadCanvas = document.createElement("canvas");
    downloadCanvas.width = 1080;
    downloadCanvas.height = 1500;
    const downloadCtx = downloadCanvas.getContext("2d");

    // Establecemos el fondo blanco con un borde gris claro
    downloadCtx.fillStyle = "#fff";
    downloadCtx.strokeStyle = "#ddd";
    downloadCtx.lineWidth = 2;
    downloadCtx.fillRect(0, 0, 1080, 1500);
    downloadCtx.strokeRect(1, 1, 1078, 1498);

    // Agregamos el título con un estilo más atractivo
    downloadCtx.font = "bold 48px Arial";
    downloadCtx.textAlign = "center";
    downloadCtx.textBaseline = "top";
    downloadCtx.fillStyle = "#333";
    downloadCtx.fillText("BASE AEREA HCM", 540, 40);

    // Centramos el QR code (doble de tamaño) con un borde blanco
    const qrX = (1080 - 400) / 2;
    const qrY = 100;
    downloadCtx.strokeStyle = "#fff";
    downloadCtx.lineWidth = 4;
    downloadCtx.strokeRect(qrX - 2, qrY - 2, 400 + 4, 400 + 4);
    downloadCtx.drawImage(qrCanvas, qrX, qrY, 400, 400);

    // Obtenemos los datos ingresados por el usuario
    const amount = document.getElementById("amount").value;
    const fuelType = document.getElementById("fuel-type").value;
    const comment = document.getElementById("comment").value;

    // Agregamos los datos al documento descargado en una tabla
    const tableX = 100;
    const tableY = 550;
    downloadCtx.font = "24px Arial";
    downloadCtx.textAlign = "left";
    downloadCtx.textBaseline = "top";
    downloadCtx.fillStyle = "#666";
    downloadCtx.fillText("Datos del pago:", tableX, tableY);
    downloadCtx.fillText("-------------------------------", tableX, tableY + 30);

    const tableData = [
        ["Monto:", amount],
        ["Tipo:", fuelType],
        ["Comentario:", comment]
    ];

    for (let i = 0; i < tableData.length; i++) {
        downloadCtx.fillText(tableData[i][0], tableX, tableY + 60 + i * 30);
        downloadCtx.fillText(tableData[i][1], tableX + 200, tableY + 60 + i * 30);
    }

    // Agregamos el pie de página con un estilo más atractivo
    const date = new Date();
    const dateString = date.toLocaleDateString() + " " + date.toLocaleTimeString();
    downloadCtx.font = "18px Arial";
    downloadCtx.textAlign = "center";
    downloadCtx.textBaseline = "bottom";
    downloadCtx.fillStyle = "#666";
    downloadCtx.fillText(dateString, 540, 1480);

    const qrImage = downloadCanvas.toDataURL("image/png");
    const downloadLink = document.getElementById("download-link");
    downloadLink.href = qrImage;
    downloadLink.download = "qr_code.png";
}



let currentAmount = 0.00;

document.getElementById("reload-button").addEventListener("click", showReloadForm);
document.getElementById("confirm-button").addEventListener("click", confirmReload);

function showReloadForm() {
    document.querySelector(".amount-section").style.display = "block";
}

function confirmReload() {
    const newAmount = document.getElementById("new-amount").value;
    if (newAmount > 0) {
        currentAmount += parseFloat(newAmount);
        document.getElementById("current-amount").innerHTML = currentAmount.toFixed(2);
        document.querySelector(".amount-section").style.display = "none";
    } else {
        alert("Ingrese un monto válido");
    }
}



function isValidAmount(amount) {
    return amount > 0 && !isNaN(amount);
}

document.getElementById("generate-qr-button").addEventListener("click", generateQRCode);
document.getElementById("download-link").addEventListener("click", downloadQR);