document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  document.getElementById('formResponse').innerText = "Mensagem enviada com sucesso!";
  this.reset();
});
