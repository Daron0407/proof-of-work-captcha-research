use wasm_bindgen::prelude::*;
use sha2::{Digest, Sha256};


fn bytes_to_integer(bytes: &[u8]) -> u128 {
    let mut value: u128 = 0;

    for &byte in bytes {
        value = (value << 8) | byte as u128;
    }

    value
}


#[wasm_bindgen]
pub fn solve_challenge(
    mut nonce: String,
    difficulty: u128,
    prefix_len: usize,
    depth: u32,
) -> String {

    for _ in 0..depth {

        let mut counter: u64 = 0;

        loop {
            // Niepusty prefix
            let prefix = counter.to_string();

            let input = format!("{}{}", prefix, nonce);

            let hash = Sha256::digest(input.as_bytes());

            let value = bytes_to_integer(
                &hash[..prefix_len]
            );

            if value < difficulty {
                nonce = format!("{}{}", prefix, nonce);
                break;
            }

            counter += 1;
        }
    }

    nonce
}