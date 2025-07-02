
let idioma = "pt";
let loopAtual = null;

const frases = {
  pt: ["Calculadora de Notas", "Boletim Interativo", "Confira sua Média", "Estude com Facilidade"],
  en: ["Grade Calculator", "Interactive Report", "Check Your Average", "Study Made Easy"]
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
  const nota1 = parseFloat(document.getElementById("nota1").value);
  const nota2 = parseFloat(document.getElementById("nota2").value);
  const nota3 = parseFloat(document.getElementById("nota3").value);
  const nota4 = parseFloat(document.getElementById("nota4").value);
  const mediaMinima = parseFloat(document.getElementById("mediaMinima").value);
  const resultadoDiv = document.querySelector(".resultado");

  resultadoDiv.classList.remove("aprovado", "recuperacao", "reprovado");

  if ([nota1, nota2, nota3, nota4, mediaMinima].some(isNaN)) {
    resultadoDiv.textContent = "";
    return;
  }

  const notas = [nota1, nota2, nota3, nota4];
  if (notas.some(nota => nota < 0 || nota > 10)) {
    resultadoDiv.textContent = idioma === "pt"
      ? "As notas devem estar entre 0 e 10."
      : "Grades must be between 0 and 10.";
    resultadoDiv.classList.add("reprovado");
    return;
  }

  const media = ((nota1 + nota2 + nota3 + nota4) / 4).toFixed(2);
  const mediaNum = parseFloat(media);

  resultadoDiv.textContent = (idioma === "pt" ? "Média: " : "Average: ") + mediaNum + " - ";

  if (mediaNum >= mediaMinima) {
    resultadoDiv.textContent += idioma === "pt" ? "Aprovado ✅" : "Passed ✅";
    resultadoDiv.classList.add("aprovado");
  } else if (mediaNum >= 5) {
    resultadoDiv.textContent += idioma === "pt" ? "Recuperação 🟡" : "Remedial 🟡";
    resultadoDiv.classList.add("recuperacao");
  } else {
    resultadoDiv.textContent += idioma === "pt" ? "Reprovado ❌" : "Failed ❌";
    resultadoDiv.classList.add("reprovado");
  }
}

// Cálculo em tempo real
["nota1", "nota2", "nota3", "nota4", "mediaMinima"].forEach(id => {
  document.getElementById(id).addEventListener("input", calcularMedia);
});

// Tecla Enter ativa cálculo
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    calcularMedia();
  }
});

document.getElementById("trocarIdioma").addEventListener("click", () => {
  idioma = idioma === "pt" ? "en" : "pt";
  atualizarIdioma();
});

function atualizarIdioma() {
  document.getElementById("trocarIdioma").textContent = idioma === "pt" ? "🌐 English" : "🌐 Português";

  document.querySelector("label[for='mediaMinima']").textContent =
    idioma === "pt" ? "Média mínima para aprovação:" : "Minimum grade to pass:";

  document.getElementById("limparTudo").textContent =
    idioma === "pt" ? "🔄 Limpar Tudo" : "🔄 Clear All";

  const placeholders = idioma === "pt"
    ? ["Nota 1", "Nota 2", "Nota 3", "Nota 4"]
    : ["Grade 1", "Grade 2", "Grade 3", "Grade 4"];

  ["nota1", "nota2", "nota3", "nota4"].forEach((id, i) => {
    document.getElementById(id).placeholder = placeholders[i];
  });

  calcularMedia();
  loopDigitarTexto(frases[idioma], "titulo-digitado");
}


document.getElementById("limparTudo").addEventListener("click", () => {
  ["nota1", "nota2", "nota3", "nota4", "mediaMinima"].forEach(id => {
    document.getElementById(id).value = id === "mediaMinima" ? "7" : "";
  });

  const resultadoDiv = document.querySelector(".resultado");
  resultadoDiv.textContent = "";
  resultadoDiv.classList.remove("aprovado", "recuperacao", "reprovado");
});
