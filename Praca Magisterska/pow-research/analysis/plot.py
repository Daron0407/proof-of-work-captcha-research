import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

csv_path = BASE_DIR / "results" / "results.csv"

df = pd.read_csv(csv_path)

grouped = (
    df.groupby(["algorithm", "difficulty"])["time_ms"]
    .mean()
    .reset_index()
)

for algorithm in grouped["algorithm"].unique():
    subset = grouped[grouped["algorithm"] == algorithm]

    plt.plot(
        subset["difficulty"],
        subset["time_ms"],
        marker="o",
        label=algorithm,
    )

plt.xlabel("Difficulty")
plt.ylabel("Average Time (ms)")
plt.title("POW Benchmark")
plt.legend()
plt.grid(True)

output_path = BASE_DIR / "results" / "plot.png"
plt.savefig(output_path)

plt.show()