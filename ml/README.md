# ML Workspace

This directory contains the machine learning code, data, and experiment assets for the project.

## Environment setup

Create and activate a local Python environment:

```bash
cd ml
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
.\.venv\Scripts\activate    # Windows
```

Install the project dependencies:

```bash
pip install -r requirements.txt
```

## Jupyter kernel

Register the environment as a Jupyter kernel:

```bash
python -m ipykernel install --user --name ml-env --display-name "ML Env"
```

Then select "ML Env" as the kernel when opening notebooks.

## Project structure

```text
ml/
├── .venv/                 # local virtual environment
├── data/                 # raw and processed datasets
├── scripts/              # reusable data processing and utility scripts
├── training/             # model artifacts, notebooks, and training code
├── requirements.txt      # Python dependencies
├── README.md             # project overview
└── .venv/                # local environment directory
```

The project is organized around raw and processed data under `data/`, reusable utilities under `scripts/`, and model training assets under `training/`.
