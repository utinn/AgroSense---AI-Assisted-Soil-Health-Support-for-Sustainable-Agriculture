"""Constants ported 1:1 from the original Streamlit app (Main.py)."""

PH_LABELS = {
    0: "Strongly Acidic",
    1: "Moderately Acidic",
    2: "Neutral",
    3: "Moderately Alkaline",
    4: "Strongly Alkaline",
}

# Column order the model was trained on. "% Ca", "% Mg", "% K" are derived,
# not raw user input — see compute_percentages() in model.py.
REQUIRED_COLS = [
    "P", "SAND", "CLAY", "N", "K", "Ca", "Mg", "Na", "CEC", "SAR", "ESP",
    "% Ca", "% Mg", "% K",
]

# Columns expected in an uploaded batch CSV (raw inputs only).
BATCH_INPUT_COLS = ["P", "SAND", "CLAY", "N", "K", "Ca", "Mg", "Na", "CEC", "SAR", "ESP"]
