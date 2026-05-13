pub struct Difficulty {
    pub expected_ms: u64
}

pub trait PowAlgorithm {
    fn name(&self) -> &'static str;

    fn generate_challenge(
        &self,
        difficulty: Difficulty,
    ) -> Challenge;

    fn solve(
        &self,
        challenge: &Challenge,
    ) -> Solution;

    fn verify(
        &self,
        challenge: &Challenge,
        solution: &Solution,
    ) -> bool;
}

pub struct BenchmarkResult {
    pub algorithm: String,
    pub environment: String,

    pub difficulty: u64,

    pub solve_time_ms: f64,

    pub cpu_usage: f64,

    pub memory_usage_mb: f64,

    pub threads: usize,

    pub success: bool,
}



fn append_world(mut s: String) {
    s.push_str(" world");

    println!("{}", s);
}

fn main() {
    let s = String::from("hello");

    append_world(s.clone());

    println!("{}", s);
}