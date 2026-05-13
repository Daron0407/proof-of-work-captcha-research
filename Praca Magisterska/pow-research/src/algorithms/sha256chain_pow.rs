use sha2::{Digest, Sha256};

use super::PowAlgorithm;

pub struct Sha256ChainPow;

impl Sha256ChainPow {
    fn sha256(input: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(input);
        let result = hasher.finalize();
        hex::encode(result)
    }
}

impl PowAlgorithm for Sha256ChainPow {
    fn name(&self) -> &'static str {
        "sha256chain"
    }

    fn solve(&self, seed: &str, difficulty: usize) -> u64 {
        let target = "0".repeat(difficulty);

        // initial state
        let mut state = seed.to_string();
        let mut nonce: u64 = 0;

        // chain through N steps
        for _step in 0..difficulty {
            loop {
                let input = format!("{}{}", state, nonce);
                let hash = Self::sha256(&input);

                if hash.starts_with(&target) {
                    // update state for next round
                    state = hash;
                    nonce = 0; // reset nonce for next step
                    break;
                }

                nonce += 1;
            }
        }

        // final nonce is not that important here (you could store vector if needed)
        nonce
    }
}
