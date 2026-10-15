
import { solveChallenge } from "./functions.js";
import init, { solve_challenge } from "./pkg/rust_wasm_benchmark.js";


const wasmReady = init();

export const benchmarks = [
  {
    id: "challenge-js",
    name: "Challenge — SHA-256 biblioteczne",
    description: "Rozwiązywanie wyzwania z własną implementacją SHA-256.",
    run: ({ nonce, difficulty, prefixLen, depth }) =>
      solveChallenge(nonce, difficulty, prefixLen, depth),
  },
  {
    id: "challenge-wasm",
    name: "Challenge — WebAssembly",
    description: "Rozwiązywanie wyzwania za pomocą modułu WebAssembly.",
    run: async ({ nonce, difficulty, prefixLen, depth }) => {
      await wasmReady;

      return solve_challenge(
        nonce,
        BigInt(difficulty),
        prefixLen,
        depth
      );
    },
  }
];
