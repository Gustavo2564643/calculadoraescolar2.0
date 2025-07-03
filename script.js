let idioma = "pt";
let loopAtual = null;

const frases = {
  pt: ["Calculadora de Notas", "Média Escolar", "Fácil e Rápida"],
  en: ["Grade Calculator", "School Average", "Simple and Fast"]
};

function loopDigitarTexto(textos, elementoId, velocidade = 90, pausa = 1500) {
  const elemento = document.getElementById(elementoId);
  let textoIndex = 0;
  let charIndex = 0;
  let deletando = false;

  if (loopAtual) clearTimeout(loopAtual);

  function digitar() {
    const textoAtual = textos[textoIndex];
    if (!deletando) {
      elemento.textContent = textoAtual.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === textoAtual.length) {
        deletando = true;
        loopAtual = setTimeout(digitar, pausa);
        return;
      }
    } else {
      elemento.textContent = textoAtual.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deletando = false;
        textoIndex = (textoIndex + 1) % textos.length;
      }
    }
    loopAtual = setTimeout(digitar, velocidade);
  }

  digitar();
}

loopDigitarTexto(frases[idioma], "titulo-digitado");

function calcularMedia() {
  const notas = [1, 2, 3, 4].map(i => parseFloat(document.getElementById(`nota${i}`).value));
  const mediaMinima = parseFloat(document.getElementById("mediaMinima").value);
  const resultadoDiv = document.querySelector(".resultado");

  resultadoDiv.className = "resultado";
  resultadoDiv.textContent = "";

  if (notas.some(isNaN) || isNaN(mediaMinima)) return;

  const soma = notas.reduce((a, b) => a + b, 0);
  const media = (soma / 4).toFixed(2);

  resultadoDiv.textContent =
    (idioma === "pt" ? "Média: " : "Average: ") + media +
    (media >= mediaMinima ? " ✅" : " ❌");
}

["nota1", "nota2", "nota3", "nota4", "mediaMinima"].forEach(id => {
  document.getElementById(id).addEventListener("input", calcularMedia);
});

document.getElementById("trocarIdioma").addEventListener("click", () => {
  idioma = idioma === "pt" ? "en" : "pt";
  atualizarIdioma();
});

function atualizarIdioma() {
  document.getElementById("trocarIdioma").textContent =
    idioma === "pt" ? "🌐 English" : "🌐 Português";

  document.querySelector("label[for='mediaMinima']").textContent =
    idioma === "pt" ? "Média mínima:" : "Minimum grade:";

  ["nota1", "nota2", "nota3", "nota4"].forEach((id, i) => {
    document.getElementById(id).placeholder = idioma === "pt" ? `Nota ${i + 1}` : `Grade ${i + 1}`;
  });

  loopDigitarTexto(frases[idioma], "titulo-digitado");
  calcularMedia();
}

document.getElementById("limparTudo").addEventListener("click", () => {
  ["nota1", "nota2", "nota3", "nota4", "mediaMinima"].forEach(id => {
    document.getElementById(id).value = id === "mediaMinima" ? "7" : "";
  });
  document.querySelector(".resultado").textContent = "";
});
