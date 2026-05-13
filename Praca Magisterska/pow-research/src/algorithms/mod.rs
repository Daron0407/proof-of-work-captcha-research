pub mod sha256_pow;
pub mod sha256chain_pow;

pub trait PowAlgorithm {
    fn name(&self) -> &'static str;

    fn solve(&self, seed: &str, difficulty: usize) -> u64;
}
