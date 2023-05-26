// Seleciona os elementos do DOM
const contentDiv = document.getElementById('content');

// Variáveis para armazenar o elemento de vídeo e a stream
let videoElement;

// Variável para armazenar o ID do setInterval
let scannerInterval;

// Função para iniciar o scanner de QR code
function startScanner() {
  // Verifica se o scanner já está em execução
  if (scannerInterval) {
    return;
  }

  // Verifica se a API de MediaDevices é suportada pelo navegador
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('O scanner de QR code não é suportado neste navegador.');
    return;
  }

  // Inicia o acesso à câmera
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (str) {
      stream = str;
      videoElement = document.createElement('video'); // Cria o elemento de vídeo
      videoElement.id = 'videoElement'; // Define o ID do elemento
      videoElement.width = 400; // Define a largura do elemento
      videoElement.height = 400; // Define a altura do elemento
      videoElement.classList.add('camera-element');
      contentDiv.appendChild(videoElement); // Adiciona o elemento ao DOM

      videoElement.srcObject = stream;
      videoElement.play();

      // Define um intervalo para ler continuamente o vídeo
      scannerInterval = setInterval(scanQRCode, 100);
    })
    .catch(function (error) {
      alert('Ocorreu um erro ao acessar a câmera: ' + error);
    });
}

// Função para parar o scanner de QR code
function stopScanner() {
  if (scannerInterval) {
    clearInterval(scannerInterval);
  }
  if (stream) {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }
  contentDiv.removeChild(videoElement); // Remove o elemento de vídeo do DOM
  scannerInterval = null;
  stream = null;
}

// Função para decodificar o QR code
function scanQRCode() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Define a largura e altura do canvas para corresponder ao vídeo
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  // Desenha o quadro atual do vídeo no canvas
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Extrai os dados do QR code do canvas
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);

  // Verifica se um QR code foi encontrado
  if (code) {
    // Obtém o conteúdo do QR code
    const qrContent = code.data;

    // Redireciona o usuário para a nova página com base no conteúdo do QR code
    window.location.href = qrContent;

    // Pare o scanner após encontrar um QR code (opcional)
    stopScanner();
  }
}

