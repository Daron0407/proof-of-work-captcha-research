
import { benchmarks } from "./benchmark.js";

const template = document.querySelector("#benchmark-template");
const form = document.querySelector("#benchmark-form");
const functionSelect = document.querySelector("#function-select");
const nonceInput = document.querySelector("#nonce-input");
const resultsContainer = document.querySelector("#benchmarks");

function generateNonce(length = 16) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(
    bytes,
    byte => byte.toString(16).padStart(2, "0")
  ).join("");
}

function formatTime(milliseconds) {
  return `${milliseconds.toFixed(3)} ms`;
}

function getConfig() {
  return {
    nonce: nonceInput.value,
    difficulty: Number(document.querySelector("#difficulty-input").value),
    prefixLen: Number(document.querySelector("#prefix-len-input").value),
    depth: Number(document.querySelector("#depth-input").value),
  };
}

function populateFunctionSelect() {
  for (const benchmark of benchmarks) {
    const option = document.createElement("option");
    option.value = benchmark.id;
    option.textContent = benchmark.name;
    functionSelect.appendChild(option);
  }
}

function createBenchmarkCard(benchmark, config, testNumber) {
  const card = template.content.firstElementChild.cloneNode(true);

  card.querySelector(".benchmark-label").textContent =
    `Test #${testNumber}`;

  card.querySelector(".benchmark-name").textContent = benchmark.name;
  card.querySelector(".benchmark-description").textContent =
    benchmark.description;

  const parameters = card.querySelector(".test-parameters");

  for (const [name, value] of Object.entries(config)) {
    const chip = document.createElement("span");
    chip.className = "parameter-chip";
    chip.textContent = `${name}: ${value}`;
    parameters.appendChild(chip);
  }

  const button = card.querySelector(".run-button");
  const timer = card.querySelector(".timer-value");
  const status = card.querySelector(".status-badge");

  async function run() {
    button.disabled = true;
    card.classList.remove("finished");
    card.classList.add("running");
    status.textContent = "Obliczanie…";
    timer.textContent = "—";

    // Pozwól przeglądarce wyświetlić spinner przed obliczeniami.
    await new Promise(requestAnimationFrame);

    const start = performance.now();

    try {
      const result = await benchmark.run({ ...config });
      const elapsed = performance.now() - start;

      timer.textContent = formatTime(elapsed);
      status.textContent = "Gotowe";
      card.classList.remove("running");
      card.classList.add("finished");

      console.log("Benchmark:", benchmark.name, {
        config,
        result,
        elapsed,
      });
    } catch (error) {
      console.error(`Błąd benchmarku ${benchmark.name}:`, error);
      timer.textContent = "Błąd";
      status.textContent = "Błąd";
      card.classList.remove("running");
    } finally {
      button.disabled = false;
    }
  }

  button.addEventListener("click", run);

  return { card, run };
}

let testCounter = 0;

form.addEventListener("submit", async event => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const config = getConfig();
  const selectedId = functionSelect.value;
  const benchmark = benchmarks.find(item => item.id === selectedId);

  if (!benchmark) {
    alert("Nie znaleziono wybranego testu.");
    return;
  }

  testCounter++;

  const test = createBenchmarkCard(benchmark, config, testCounter);

  // Najnowszy test pojawia się na początku listy.
  resultsContainer.prepend(test.card);

  await test.run();
});

const runAllButton = document.querySelector("#run-all-button");

runAllButton.addEventListener("click", async () => {
  if (!form.reportValidity()) return;

  const config = getConfig();

  runAllButton.disabled = true;

  try {
    const tests = benchmarks.map(benchmark => {
      testCounter++;

      const test = createBenchmarkCard(
        benchmark,
        config,
        testCounter
      );

      resultsContainer.prepend(test.card);

      return test;
    });

    // Uruchom wszystkie testy równolegle.
    await Promise.all(tests.map(test => test.run()));
  } finally {
    runAllButton.disabled = false;
  }
});

document.querySelector("#random-nonce-button").addEventListener("click", () => {
  nonceInput.value = generateNonce();
});

nonceInput.value = generateNonce();
populateFunctionSelect();
