mod algorithms;
mod benchmark;
mod config;

use algorithms::sha256_pow::Sha256Pow;
use algorithms::sha256chain_pow::Sha256ChainPow;
use algorithms::PowAlgorithm;

use benchmark::benchmark_algorithm;

use config::ExperimentConfig;

use std::env;
use std::fs::File;

fn main() {
    let args: Vec<String> = env::args().collect();

    let config_path = &args[1];

    let file = File::open(config_path).unwrap();

    let config: ExperimentConfig = serde_yaml::from_reader(file).unwrap();

    let mut all_results = Vec::new();

    for algorithm_name in &config.algorithms {
        let algorithm: Box<dyn PowAlgorithm> = match algorithm_name.as_str() {
            "sha256" => Box::new(Sha256Pow),
            "sha256chain" => Box::new(Sha256ChainPow),

            _ => panic!("Unknown algorithm"),
        };

        for &difficulty in &config.difficulties {
            let results = benchmark_algorithm(algorithm.as_ref(), difficulty, config.runs);

            all_results.extend(results);
        }
    }

    std::fs::create_dir_all("results").unwrap();
    let mut writer = csv::Writer::from_path("results/results.csv").unwrap();

    writer
        .write_record(&["algorithm", "difficulty", "run", "time_ms"])
        .unwrap();

    for result in all_results {
        writer
            .write_record(&[
                result.algorithm,
                result.difficulty.to_string(),
                result.run.to_string(),
                result.time_ms.to_string(),
            ])
            .unwrap();
    }

    writer.flush().unwrap();

    println!("Results saved.");
}
