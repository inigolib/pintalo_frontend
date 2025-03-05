document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const uploadButton = document.getElementById("uploadButton");
    const convertButton = document.getElementById("convertButton");
    const downloadButton = document.getElementById("downloadButton");
    const previewImage = document.getElementById("previewImage");

    let uploadedImage = null; // Guardará la imagen seleccionada
    let processedImageURL = null; // URL de la imagen convertida

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result); // Devuelve el Base64
            reader.onerror = (error) => reject(error);
        });
    };

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
        const base64String = await fileToBase64(uploadedImage);
        console.log(base64String)

        const formData = new FormData();
        formData.append("file", base64String);
        console.log('envio todo')
        const response = await fetch("http://ec2-3-70-99-38.eu-central-1.compute.amazonaws.com:5000/convert", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            const imgSrc = `data:image/png;base64,${data.image_base64}`;

            previewImage.src = imgSrc; // Mostrar imagen procesada
            downloadButton.style.display = "inline-block"; // Mostrar botón de descargar
        }
    });

    // 📌 4️⃣ Evento al hacer clic en "Descargar"

    downloadButton.addEventListener("click", function() {

      const nombreArchivo = 'processed_image.png';
        // Hacemos una solicitud fetch al servidor para descargar el archivo
    // URL de la ruta Flask que sirve el archivo procesado
      const url = `http://ec2-3-70-99-38.eu-central-1.compute.amazonaws.com:5000/download?file=${encodeURIComponent(nombreArchivo)}`;

    // Hacemos una solicitud fetch al servidor para descargar el archivo
      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.blob();  // Convertimos la respuesta a un Blob (archivo)
          } else {
            throw new Error('No se pudo descargar el archivo');
          }
        })
        .then(blob => {
          // Creamos un enlace dinámico para iniciar la descarga
          const objectUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = objectUrl;
          a.download = nombreArchivo;  // Usamos el nombre del archivo pasado
          document.body.appendChild(a);
          a.click();  // Disparamos el clic en el enlace, lo que inicia la descarga
          window.URL.revokeObjectURL(objectUrl);  // Liberamos el objeto URL para evitar fugas de memoria
        })
        .catch(error => {
          console.error('Error al descargar el archivo:', error);
        });
    });;
  })