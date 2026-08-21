"""Constants ported 1:1 from the original Streamlit app (Main.py)."""

PH_LABELS = {
    0: "Strongly Acidic",
    1: "Moderately Acidic",
    2: "Neutral",
    3: "Moderately Alkaline",
    4: "Strongly Alkaline",
}

REQUIRED_COLS = [
    "P", "SAND", "CLAY", "N", "K", "Ca", "Mg", "Na", "CEC", "SAR", "ESP",
    "% Ca", "% Mg", "% K",
]

BATCH_INPUT_COLS = ["P", "SAND", "CLAY", "N", "K", "Ca", "Mg", "Na", "CEC", "SAR", "ESP"]
