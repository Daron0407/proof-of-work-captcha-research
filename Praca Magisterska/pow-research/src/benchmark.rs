use std::time::Instant;

use crate::algorithms::PowAlgorithm;

pub struct BenchmarkResult {
    pub algorithm: String,

    pub difficulty: usize,

    pub run: usize,

    pub time_ms: f64,
}

pub fn benchmark_algorithm(
    algorithm: &dyn PowAlgorithm,
    difficulty: usize,
    runs: usize,
) -> Vec<BenchmarkResult> {
    let mut results = Vec::new();

    for run in 0..runs {
        let start = Instant::now();

        algorithm.solve("test_seed", difficulty);

        let elapsed = start.elapsed();

        results.push(BenchmarkResult {
            algorithm: algorithm.name().to_string(),

            difficulty,

            run,

            time_ms: elapsed.as_secs_f64() * 1000.0,
        });
    }

    results
}
