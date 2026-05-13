use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct ExperimentConfig {
    pub algorithms: Vec<String>,

    pub difficulties: Vec<usize>,

    pub runs: usize,
}
