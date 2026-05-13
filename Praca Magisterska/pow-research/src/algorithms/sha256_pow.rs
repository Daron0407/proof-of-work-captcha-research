use sha2::{Digest, Sha256};

use super::PowAlgorithm;

pub struct Sha256Pow;

impl Sha256Pow {
    fn sha256(input: &str) -> String {
        let mut hasher = Sha256::new();

        hasher.update(input);

        let result = hasher.finalize();

        hex::encode(result)
    }
}

impl PowAlgorithm for Sha256Pow {
    fn name(&self) -> &'static str {
        "sha256"
    }

    fn solve(&self, seed: &str, difficulty: usize) -> u64 {
        let target = "0".repeat(difficulty);

        let mut nonce = 0;

        loop {
            let input = format!("{}{}", seed, nonce);

            let hash = Self::sha256(&input);

            if hash.starts_with(&target) {
                return nonce;
            }

            nonce += 1;
        }
    }
}
