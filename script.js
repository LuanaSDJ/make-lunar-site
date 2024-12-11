const sugestoesDiv = document.getElementById('sugestoes');
const consultarBtn = document.getElementById('consultar-btn');
const resultadoDiv = document.getElementById('resultado');

document.getElementById('cep').addEventListener('input', async function (event) {
  const cep = event.target.value;

  if (cep.length >= 3) {
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
      const data = await response.json();

      sugestoesDiv.innerHTML = '';
      const p = document.createElement('p');
      p.textContent = `${data.cep} - ${data.city}, ${data.state}`;
      p.addEventListener('click', () => {
        document.getElementById('cep').value = data.cep;
        sugestoesDiv.style.display = 'none';
      });
      sugestoesDiv.appendChild(p);

      sugestoesDiv.style.display = 'block';
    } catch (error) {
      sugestoesDiv.style.display = 'none';
    }
  } else {
    sugestoesDiv.style.display = 'none';
  }
});

document.getElementById('cep').addEventListener('input', function () {
  const cep = document.getElementById('cep').value;
  const cepValido = /^[0-9]{5}-?[0-9]{3}$/.test(cep);

  if (cepValido) {
    consultarBtn.classList.add('valid');
    consultarBtn.classList.remove('invalid');
  } else {
    consultarBtn.classList.add('invalid');
    consultarBtn.classList.remove('valid');
  }
});

document.getElementById('cep-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const cep = document.getElementById('cep').value;

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
    const data = await response.json();

    // Verifica se o CEP é da região de entrega gratuita (exemplo: Juazeiro - BA e Petrolina - PE)
    if (
      (data.city === 'Juazeiro' && data.state === 'BA') ||
      (data.city === 'Petrolina' && data.state === 'PE')
    ) {
      resultadoDiv.textContent = `Entrega gratuita disponível para: ${data.street}, ${data.neighborhood}, ${data.city} - ${data.state}`;
    } else {
      // Caso contrário, exibe o valor do frete
      resultadoDiv.textContent = `Frete para sua região: R$18,00. Endereço: ${data.street}, ${data.neighborhood}, ${data.city} - ${data.state}`;
    }
  } catch (error) {
    // Em caso de erro, exibe a mensagem de erro
    resultadoDiv.textContent = "Erro ao buscar o CEP. Verifique e tente novamente.";
  }
});


