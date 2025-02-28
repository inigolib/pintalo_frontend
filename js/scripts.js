document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const uploadButton = document.getElementById("uploadButton");
    const convertButton = document.getElementById("convertButton");
    const downloadButton = document.getElementById("downloadButton");
    const previewImage = document.getElementById("previewImage");

    let uploadedImage = null; // Guardará la imagen seleccionada
    let processedImageURL = null; // URL de la imagen convertida

    //Evento al hacer clic en "Seleccionar Foto"
    uploadButton.addEventListener("click", () => {
        fileInput.click(); // Abre el explorador de archivos
    });

    //Evento cuando se selecciona una imagen
    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];

        if (file) {
            uploadedImage = file;
            const reader = new FileReader();

            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
                convertButton.style.display = "inline-block";
            };

            reader.readAsDataURL(file);
        }
    });

    //Evento al hacer clic en "Convertir"
    convertButton.addEventListener("click", async () => {
        if (!uploadedImage) return;

        const formData = new FormData();
        formData.append("file", 'data:image/jpg;base64,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');
        console.log('envio todo')
        const response = await fetch("http://127.0.0.1:5000/convert", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            processedImageURL = data.image_url;

            previewImage.src = processedImageURL; // Mostrar imagen procesada
            downloadButton.style.display = "inline-block"; // Mostrar botón de descargar
        }
    });

    // 📌 4️⃣ Evento al hacer clic en "Descargar"
    downloadButton.addEventListener("click", () => {
        if (processedImageURL) {
            const a = document.createElement("a");
            a.href = processedImageURL;
            a.download = "imagen_bn.jpg";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });
});