
import { cryptoSolveChallenge } from "./functions/crypto_solve.js";
import { implementationSolveChallenge } from "./functions/implementation_solve.js";
import init, { solve_challenge } from "./pkg/rust_wasm_benchmark.js";

const wasmReady = init();

export const benchmarks = [
  {
    id: "challenge-library-js",
    name: "Challenge — SHA-256 biblioteczne",
    description: "Rozwiązywanie wyzwania implementacją SHA-256 z bilbioteki Crypto.",
    run: ({ nonce, difficulty, prefixLen, depth }) =>
      cryptoSolveChallenge(nonce, difficulty, prefixLen, depth),
  },
  {
    id: "challenge-implementation-js",
    name: "Challenge — SHA-256 implementacja lokalna",
    description: "Rozwiązywanie wyzwania lokalną implementacją SHA-256.",
    run: ({ nonce, difficulty, prefixLen, depth }) =>
      implementationSolveChallenge(nonce, difficulty, prefixLen, depth),
  },
  {
    id: "challenge-rust-library-wasm",
    name: "Challenge — WebAssembly",
    description: "Rozwiązywanie wyzwania za pomocą WebAssembly przy użyciu biblioteki sha2.",
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
