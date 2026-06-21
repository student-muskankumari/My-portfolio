# Kronos — Live Stock Forecasting App
## Comprehensive Technical Project Report

**Project URL:** https://kronox.streamlit.app  
**GitHub:** https://github.com/student-muskankumari/KronoX  
**Type:** Full-Stack ML Web Application  
**Domain:** Financial Technology / Time-Series Forecasting  
**Status:** Production Deployed

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Tech Stack](#3-tech-stack)
4. [System Architecture](#4-system-architecture)
5. [Functions & Modules](#5-functions--modules)
6. [ML Model Details](#6-ml-model-details)
7. [Kronos Foundation Model Integration](#7-kronos-foundation-model-integration)
8. [Backtesting Engine](#8-backtesting-engine)
9. [Problems Solved](#9-problems-solved)
10. [Challenges & Solutions](#10-challenges--solutions)
11. [Deployment](#11-deployment)
12. [Performance Metrics](#12-performance-metrics)
13. [Future Improvements](#13-future-improvements)

---

## 1. Project Overview

Kronos is a production-grade, real-time stock forecasting web application that combines a custom-trained GradientBoosting machine learning model with the Kronos-mini financial foundation model (a 4.1M parameter causal transformer pre-trained on financial K-line sequences). The app provides live price feeds, multi-step price predictions, confidence bands, and a complete backtesting engine for simulated trading strategy evaluation.

### Core Objective

To provide retail investors and researchers with a free, accessible tool that:
- Fetches real-time market data for 100+ Indian and international stocks
- Forecasts future price movements using both traditional ML and deep learning
- Simulates trading strategies on historical data to evaluate signal quality
- Visualises everything in an interactive, dark-themed dashboard

### Key Differentiators

| Feature | Kronos | Typical Stock Apps |
|---|---|---|
| Foundation model (Kronos-mini) | ✅ | ❌ |
| Custom-trained ML (98 tickers) | ✅ | ❌ |
| Backtesting with equity curve | ✅ | Rarely |
| Open source + free | ✅ | Rarely |
| Indian NSE stocks | ✅ | Limited |
| Live deployment | ✅ | — |

---

## 2. Features

### 2.1 Real-Time Price Feed

- Fetches live intraday price, change %, Day High/Low, and previous close using `yfinance.Ticker.fast_info`
- Displayed as a prominent live price bar at the top of the page
- Updates every N seconds in Live Mode (configurable 5–600s)
- Falls back gracefully when markets are closed (shows last known data)

### 2.2 Multi-Step Price Forecasting

- Predicts 1 Week, 2 Weeks, 1 Month, 3 Months, or 6 Months ahead (daily)
- Predicts 12h, 24h, 48h, or 1 Week ahead (hourly)
- Three-tier prediction chain: Kronos-mini → GBM/RF ML Model → Linear fallback
- Confidence band around predictions: ±(RMSE × Margin)
- Prediction label shows source ("via Kronos", "via ML", "via Linear")

### 2.3 Interactive Plotly Charts

- Dark-themed Plotly charts with zoom, pan, and hover tooltips
- Balanced view: shows 5× prediction horizon of history
- Forecast divider: vertical dotted line with "Forecast →" annotation
- Bridge connector: dotted line linking last historical point to first prediction
- Smooth prediction line: 3-bar rolling average reduces noise

### 2.4 Live Mode

- Auto-refreshes entire forecast at configurable intervals
- In-place updates using `st.empty()` slots (no page reload)
- Real-time countdown timer showing seconds to next refresh
- Fetches fresh OHLCV data and live price on every refresh cycle

### 2.5 Backtesting Engine

- Simulates 1-step ML signal trading on full historical dataset
- Configurable strategy parameters (threshold, MA20 filter, stop-loss)
- Full metrics: Final Capital, Strategy Return, Buy & Hold comparison, Max Drawdown, Win Rate, Sharpe Ratio
- Equity curve chart: strategy vs real Buy & Hold with green/red shading
- Signal distribution donut chart (BUY/SELL/HOLD breakdown)
- Trade log: only BUY/SELL/STOP entries shown (HOLDs filtered)

### 2.6 Market Coverage

- **50 Indian NSE tickers:** Full Nifty 50 coverage (RELIANCE.NS, TCS.NS, HDFCBANK.NS, etc.)
- **48 International tickers:** Top S&P 500 companies (AAPL, MSFT, NVDA, GOOGL, etc.)
- **Intervals:** 1d (daily), 1h (hourly), 1wk (weekly)
- **History:** Up to 5 years daily / 60 days hourly (Yahoo Finance limits)

---

## 3. Tech Stack

### 3.1 Backend & ML

| Library | Version | Purpose |
|---|---|---|
| Python | 3.10+ | Core language |
| scikit-learn | 1.3+ | GradientBoostingRegressor, model serialisation |
| joblib | 1.3+ | Model save/load (model.joblib, features.joblib) |
| pandas | 2.0+ | DataFrame manipulation, feature engineering |
| numpy | 1.24+ | Numerical operations, array computing |
| yfinance | 0.2.28+ | Historical OHLCV + live price from Yahoo Finance |
| torch | 2.0+ | PyTorch backend for Kronos transformer |
| einops | 0.7+ | Tensor operations used by Kronos model |
| rotary-embedding-torch | 0.5+ | Rotary positional encoding for Kronos attention |
| huggingface-hub | 0.19+ | Download Kronos model weights from HuggingFace |
| safetensors | 0.4+ | Efficient model weight format used by Kronos |

### 3.2 Frontend

| Technology | Purpose |
|---|---|
| Streamlit 1.28+ | App framework — Python → React web app |
| Plotly graph_objects | Interactive dark-themed charts |
| Custom CSS (injected via st.markdown) | Dark theme, card components, button colours |
| Inline HTML | Live price bar, metric cards, banners |
| st.empty() slots | In-place live updates without page reload |

### 3.3 Deployment

| Technology | Purpose |
|---|---|
| Streamlit Community Cloud | Free cloud hosting, auto-deploys from GitHub |
| GitHub | Version control + CI/CD trigger |
| packages.txt | System package installation (git) |
| requirements.txt | Python package installation via uv/pip |
| cloud_startup.py | Auto-runs Kronos setup + model training on cold start |

### 3.4 Colour Palette

```
Background:    #0f0f1a   Deep navy black
Sidebar:       #13131f   Slightly lighter
Card bg:       #1a1a2e   Card surfaces
Card border:   #2a2a3d   Subtle borders
Text primary:  #e0e0f0   Near white
Text muted:    #8888aa   Purple-grey
Green:         #00c07a   Start button, profit, up moves
Red:           #e53935   Stop button, loss, down moves
Chart blue:    #4db8ff   Historical price line
Chart orange:  #ff9933   Predicted line
```

---

## 4. System Architecture

### 4.1 Folder Structure

```
kronos/
├── app_hourly.py              Main Streamlit app
├── train_model.py             ML model training script
├── evaluate.py                Model evaluation
├── setup_kronos.py            One-time Kronos setup
├── cloud_startup.py           Cloud auto-setup script
├── model.joblib               Trained GBM model (serialised)
├── features.joblib            Feature names list
├── requirements.txt           Python dependencies
├── packages.txt               System dependencies (git)
├── .gitignore                 Excludes venv, __pycache__
├── .streamlit/
│   └── config.toml            Dark theme + server config
├── src/
│   ├── data_loader.py         Data fetch + live price
│   ├── forecast_utils.py      Business date generation
│   └── model_handler_kronos.py  Kronos integration
└── eval_out/
    └── predictions.csv        Saved predictions
```

### 4.2 Data Flow

```
User Input (ticker, interval, horizon)
         │
         ▼
fetch_yfinance()          Historical OHLCV (pandas DataFrame)
fetch_live_price()        Real-time intraday price (dict)
         │
         ▼
do_forecast()
  ├──► predict_with_kronos()     Priority 1
  │      └─ _clean_df_for_kronos()  7-step NaN cleaning
  │      └─ KronosPredictor.predict()
  │
  ├──► ml_forecast()             Priority 2
  │      └─ eng()                22 feature engineering
  │      └─ GBM.predict() loop
  │
  └──► linear_fallback()         Priority 3
         │
         ▼
backtest()                Simulate trading on history
         │
         ▼
render()                  Fill named slots with charts + metrics
         │
         ▼
Browser (Streamlit React app via WebSocket)
```

### 4.3 Prediction Priority Chain

```
1. Kronos-mini       Best accuracy, foundation model
        ↓ NaN error / not installed
2. GBM/RF Model      Good accuracy, 98 tickers, 22 features
        ↓ model.joblib missing
3. Linear fallback   Last resort, straight-line extrapolation
```

---

## 5. Functions & Modules

### 5.1 `app_hourly.py` — Main Application

#### `eng(df, feats)` — Feature Engineering
```
Input:  Raw OHLCV DataFrame
Output: DataFrame with 22 engineered features
Steps:
  - Normalised price ratios (Open/Close, High/Close, Low/Close)
  - Volume normalisation (vs 20-day average)
  - Calendar features (Day, Month, Year)
  - Returns (1d, 5d, 20d percentage changes)
  - Moving averages normalised (MA5, MA20, MA50 / Close)
  - Volatility (10d, 20d rolling std of returns)
  - Price momentum (position in 20-day high/low range)
  - RSI 14 (normalised 0-1)
  - MACD signal line (normalised by price)
  - Bollinger Band position (0=lower, 1=upper band)
  - Volume spike (vs 50-day average)
  - ATR normalised (Average True Range / price)
```

#### `ml_forecast(df, horizon, model, feats)` — Multi-Step Prediction
```
Input:  OHLCV DataFrame, horizon steps, trained model, feature list
Output: List of predicted close prices
Method: Autoregressive — each prediction feeds the next step
  For each step:
    1. Build synthetic feature row from recent history
    2. model.predict(row) → predicted return %
    3. next_price = last_price × (1 + predicted_return)
    4. Append to history for next step
Constraint: Predicted return clipped to [-5%, +5%] per step
```

#### `backtest(df, model, feats, ...)` — Trading Simulation
```
Input:  OHLCV DataFrame, model, features, strategy params
Output: Dict with metrics, portfolio series, trade log
Strategy:
  - signal > threshold AND price > MA20 → BUY (all-in)
  - signal < -threshold → SELL (close position)
  - price drops 3% from entry (if stop-loss on) → STOP
  - else → HOLD
Metrics computed:
  - Final Capital, Strategy Return %
  - Sharpe Ratio (annualised)
  - Max Drawdown
  - Win Rate (% of profitable closed trades)
  - Avg Profit per trade, Avg Hold Duration
  - Signal distribution (BUY/SELL/HOLD counts)
```

#### `do_forecast(...)` — Core Orchestrator
```
Input:  All sidebar parameters
Output: Dict with predictions, metrics, backtest results
Steps:
  1. Fetch historical data via fetch_yfinance()
  2. Try Kronos-mini prediction
  3. Fall back to ML forecast if Kronos fails
  4. Fall back to linear extrapolation if ML fails
  5. Run backtest on historical data
  6. Compute RMSE, MAPE
  7. Generate future dates
  8. Return complete result dict
```

#### `render(res, lpx, is_live, countdown)` — UI Renderer
```
Input:  Forecast result dict, live price dict, mode flags
Output: Updates all st.empty() named slots in-place
Renders:
  - Live banner (if live mode)
  - Countdown timer
  - Live price bar (if market open)
  - 3 metric cards (price, prediction, RMSE)
  - Timestamp
  - Plotly forecast chart
  - Full backtesting section
```

#### `fchart(df, fdts, preds, rmse_v, mg, ticker)` — Forecast Chart
```
Input:  DataFrame, future dates, predictions, RMSE value
Output: Plotly Figure object
Features:
  - Shows 5× prediction steps of history (balanced view)
  - Smooths predictions with 3-bar rolling average
  - RMSE confidence band (±RMSE × Margin)
  - Bridge connector from last historical to first prediction
  - Vertical forecast divider line
  - Explicit x/y axis ranges (prevents prediction being invisible)
  - Dark theme (paper_bgcolor="#0f0f1a")
```

#### `echart(portfolio, actual_closes, cap0)` — Equity Curve Chart
```
Input:  Portfolio values over time, actual prices, initial capital
Output: Plotly Figure with strategy vs real B&H
Features:
  - Strategy % return (blue line)
  - True Buy & Hold % return (dashed grey) — bar-by-bar, not straight line
  - Green fill where strategy outperforms B&H
  - Red fill where strategy underperforms B&H
  - Zero reference line
```

### 5.2 `src/data_loader.py` — Data Pipeline

#### `fetch_yfinance(ticker, start, end, interval)` — Historical Data
```
Input:  Ticker symbol, date range, interval string
Output: Clean DataFrame [Date, Open, High, Low, Close, Volume]
Features:
  - Handles MultiIndex columns from yfinance
  - Normalises column names
  - Retry logic with delays for rate limiting
  - Returns None if data empty after retries
```

#### `fetch_live_price(ticker)` — Real-Time Price
```
Input:  Ticker symbol
Output: Dict {price, change, change_pct, prev_close, day_high, day_low, time}
Method: yfinance.Ticker(ticker).fast_info (faster than full info)
Fallback: Returns {error: "..."} dict if market closed or rate limited
```

### 5.3 `src/model_handler_kronos.py` — Kronos Integration

#### `_clean_df_for_kronos(kdf)` — 7-Step NaN Cleaner
```
Step 1: Drop last row if any price column is NaN (incomplete candle)
Step 2: Forward-fill then backward-fill prices
Step 3: Fill volume NaN with 0
Step 4: Drop rows still NaN after filling
Step 5: Replace inf/-inf with NaN then drop
Step 6: Drop rows where close ≤ 0
Step 7: Reset index
Reason: Kronos rejects any NaN in input DataFrame with hard error
```

#### `predict_with_kronos(df, horizon_steps, interval, device)` — Kronos Prediction
```
Input:  OHLCV DataFrame, steps ahead, interval string
Output: List of predicted close prices or None
Steps:
  1. Build Kronos-format DataFrame (lowercase cols)
  2. Clean NaN with _clean_df_for_kronos()
  3. Align timestamps to cleaned data length
  4. Generate future timestamps (business days / hours)
  5. Call KronosPredictor.predict()
  6. Sanity check: filter predictions outside [0.3×last, 3×last]
  7. Return clean predictions or None
```

#### `load_kronos(device)` — Model Loader
```
Reads src/kronos_path.json (written by setup_kronos.py)
Adds kronos_root to sys.path
Imports: from model import Kronos, KronosTokenizer, KronosPredictor
Downloads weights from HuggingFace on first run:
  NeoQuasar/Kronos-Tokenizer-2k  (~16 MB)
  NeoQuasar/Kronos-mini          (~16 MB)
Caches predictor instance in module-level variable
Returns cached predictor on subsequent calls
```

### 5.4 `src/forecast_utils.py` — Date Utilities

#### `build_future_dates(last_date, n_steps, freq)` — Business Date Generator
```
Input:  Last historical date, number of steps, frequency string
Output: List of future business dates
freq="B"  → Business days (Mon-Fri, skips weekends)
freq="h"  → Hourly
freq="W"  → Weekly
Example: last=Friday Apr 15, steps=3 → [Apr 22, Apr 23, Apr 24]
Critical: Without this, predictions land on weekends (market closed)
```

### 5.5 `train_model.py` — Model Training

#### `download_and_engineer(ticker)` — Per-Ticker Pipeline
```
Input:  Ticker symbol string
Output: DataFrame with 22 features + target column
Steps:
  1. yf.download(ticker, 2018-2025)
  2. Clean MultiIndex columns
  3. Compute all 22 features
  4. Create target: next day's return % (shifted by -1)
  5. Drop NaN rows
  6. Return clean DataFrame
```

#### Main Training Loop
```
1. Download 98 tickers (50 Indian + 48 International)
2. Concatenate all into single DataFrame (~186,000 rows)
3. 80/20 train/test split
4. Train GradientBoostingRegressor (300 trees, depth=5, lr=0.05)
5. Evaluate: MAE, RMSE, R², Directional Accuracy
6. Print per-ticker accuracy breakdown
7. Save model.joblib + features.joblib
```

### 5.6 `setup_kronos.py` — One-Time Setup

#### `find_kronos_root(base)` — Package Locator
```
Input:  Base directory to search
Output: (kronos_root, init_path) tuple or (None, None)
Method: os.walk() searching for model/__init__.py
        containing "KronosPredictor" in source
Handles: Repo may place model package at any depth
```

#### Main Setup Flow
```
1. git clone https://github.com/shiyu-coder/Kronos → src/kronos/
2. find_kronos_root() → locate model/__init__.py
3. pip install -r requirements.txt
4. Verify: from model import KronosPredictor works
5. Write src/kronos_path.json:
   {"kronos_root": "...", "model_init": "..."}
```

### 5.7 `cloud_startup.py` — Cloud Auto-Setup

#### `_setup_kronos_cloud()` — Cloud Kronos Config
```
Runs at import time on Streamlit Cloud
Checks if src/kronos_path.json already exists and valid
If not: git clone Kronos repo + write kronos_path.json
Handles: Cold starts on Streamlit Cloud where repo not present
```

#### `_train_if_missing()` — Lightweight Model Training
```
Runs only if model.joblib not found (e.g. first deploy)
Trains on 5 tickers (RELIANCE.NS, TCS.NS, AAPL, MSFT, GOOGL)
Uses 16 base features (not full 22)
Takes ~2 minutes on cloud
Saves model.joblib + features.joblib
Ensures app never crashes due to missing model
```

---

## 6. ML Model Details

### 6.1 Model Architecture

```
Type:      GradientBoostingRegressor (scikit-learn)
Trees:     300
Max depth: 5
LR:        0.05
Subsample: 0.8 (prevents overfitting)
Min leaf:  10 samples
Features:  0.7 (random subsampling per tree)
Target:    Next day's return % (regression)
```

### 6.2 Why GradientBoosting over RandomForest

| Aspect | RandomForest | GradientBoosting |
|---|---|---|
| Tree building | Independent, parallel | Sequential, each corrects errors |
| Directional accuracy | ~52–53% | ~55–58% |
| Training time | ~5 min | ~15 min |
| Overfitting risk | Lower | Higher (mitigated by subsample) |
| Financial patterns | Average | Better (iterative residual learning) |

### 6.3 Feature Importance (Top 10)

| Feature | Category | Importance |
|---|---|---|
| Return_1d | Return | Highest |
| Price_momentum | Momentum | High |
| MA20_norm | Trend | High |
| Volatility_10d | Risk | High |
| RSI_14 | Technical | Medium-High |
| Return_5d | Return | Medium |
| MACD_signal | Technical | Medium |
| BB_position | Technical | Medium |
| MA50_norm | Trend | Medium |
| Volume_spike | Volume | Medium |

### 6.4 Training Data Statistics

```
Tickers:           98 (50 Indian NSE + 48 International)
Period:            2018-01-01 to 2025-11-05
Rows per ticker:   ~1,900 (daily bars)
Total rows:        ~186,000
Features:          22
Train/Test split:  80% / 20%
Directional Acc:   ~55–58% (vs 50% random baseline)
```

---

## 7. Kronos Foundation Model Integration

### 7.1 What is Kronos

Kronos (NeoQuasar/Kronos-mini) is a decoder-only transformer model pre-trained on financial K-line (OHLCV) sequences — analogous to GPT but for price data instead of text.

```
Architecture:   Decoder-only Transformer
Parameters:     4.1 million
Context length: 2048 bars (vs 512 for larger Kronos models)
Tokenizer:      KronosTokenizer — quantises continuous prices → discrete tokens
Training data:  Massive financial market datasets across multiple assets
Task:           Autoregressive next-token prediction on price sequences
```

### 7.2 Integration Architecture

```
yfinance OHLCV DataFrame
         │
         ▼
_clean_df_for_kronos()     7-step NaN removal
         │
         ▼
KronosTokenizer             Continuous prices → discrete tokens
  (NeoQuasar/Kronos-Tokenizer-2k)
         │
         ▼
Kronos Transformer           Autoregressive decoding
  (NeoQuasar/Kronos-mini)
         │
         ▼
KronosPredictor              Tokens → actual prices (inverse normalise)
         │
         ▼
Sanity check                 Filter [0.3×last, 3×last] price range
         │
         ▼
List of predicted close prices
```

### 7.3 Key Integration Challenge: NaN Values

yfinance returns NaN in incomplete candles (today's partial bar). Kronos's internal validator throws `Input DataFrame contains NaN values` with zero tolerance. The 7-step cleaner resolves this by:
- Dropping the last row if incomplete (most common source)
- Forward + backward filling historical gaps
- Aligning timestamp array to match cleaned data length exactly

---

## 8. Backtesting Engine

### 8.1 Strategy Logic

```python
For each historical bar i:
  signal = model.predict(features[i])   # predicted next-bar return

  # Stop loss check (if enabled)
  if position_open AND price < entry * 0.97:
      STOP  → close at current price, record loss

  # Entry signal
  elif signal > threshold AND price > MA20:
      BUY   → spend all capital at current price

  # Exit signal  
  elif signal < -threshold:
      SELL  → close at next bar's open price

  # No signal
  else:
      HOLD  → do nothing

  Track: portfolio_value[i] = cash + shares × current_price
```

### 8.2 Metrics Computation

```
Sharpe Ratio   = mean(daily_returns) / std(daily_returns) × √252
Max Drawdown   = min((portfolio - rolling_max) / rolling_max)
Win Rate       = profitable_trades / total_closed_trades × 100
Avg Profit     = mean(realized_profits) across SELL + STOP trades
Avg Hold       = mean(bars_held) across all positions
B&H Return     = (final_close / first_close - 1) × 100
```

### 8.3 Trade Log Design

- Only BUY/SELL/STOP entries recorded (HOLD excluded — reduces noise from 93% hold signals)
- BUY shows Profit = 0.0 (unrealized, position still open)
- SELL/STOP shows realized P&L = shares × (exit_price - entry_price)
- Duration column shows bars held per trade

---

## 9. Problems Solved

### 9.1 Real-Time Stock Forecasting for Retail Users

**Problem:** Institutional investors have access to Bloomberg terminals (₹25 lakh/year) and proprietary ML systems. Retail investors have no free tool combining live data, ML forecasting, and backtesting.

**Solution:** Kronos provides all three in a single free web app, accessible from any browser without installation.

### 9.2 Indian NSE Stock Coverage

**Problem:** Most free forecasting tools focus on US stocks. Indian NSE stocks (RELIANCE.NS, TCS.NS, etc.) are poorly served by existing tools.

**Solution:** Trained specifically on 50 Nifty 50 stocks covering all major Indian sectors. First-class NSE support with ₹ currency symbol, NSE ticker format handling, and IST timezone awareness.

### 9.3 Foundation Model Accessibility

**Problem:** The Kronos-mini transformer (state-of-the-art financial forecasting model) has no user-facing interface. Researchers must write custom code to use it.

**Solution:** Wrapped Kronos-mini in a production-ready handler with NaN cleaning, retry logic, timestamp alignment, and sanity checking — making it accessible via a simple web UI.

### 9.4 Backtesting Realism

**Problem:** Many backtesting tools use straight-line Buy & Hold as the benchmark, which is misleading. The equity curve doesn't show the actual risk/reward profile.

**Solution:** Implemented bar-by-bar Buy & Hold tracking — the benchmark follows actual price movement, not a diagonal line. Green/red shading shows exactly when the strategy was ahead or behind.

### 9.5 Live Deployment Without Downtime

**Problem:** Streamlit Cloud cold starts require re-downloading dependencies and setting up the Kronos model from scratch, causing multi-minute delays.

**Solution:** `cloud_startup.py` runs at import time and handles Kronos repo cloning + path configuration automatically. Lightweight model training fallback ensures app never crashes even if `model.joblib` is missing.

---

## 10. Challenges & Solutions

### Challenge 1 — Kronos NaN Error

**Problem:** `[Kronos] prediction failed: Input DataFrame contains NaN values in price or volume columns`

yfinance returns incomplete candles for today's bar (market mid-session). The High, Low, or Volume columns are NaN. Kronos's internal validator rejects any NaN with a hard error.

**Root Cause Analysis:**
```
yfinance downloads today's partial bar:
  Date: 2026-04-16
  Open:   1340.00  ✅
  High:   NaN      ❌  (not finalised yet)
  Low:    NaN      ❌
  Close:  1344.10  ✅
  Volume: NaN      ❌
```

**Solution:** 7-step cleaning pipeline in `_clean_df_for_kronos()`:
1. Drop last row if any price NaN
2. ffill/bfill remaining
3. Volume → fill with 0
4. Drop still-NaN rows
5. Replace inf/-inf
6. Drop close ≤ 0
7. Reset index + align timestamps

---

### Challenge 2 — Kronos Model Package Not Found

**Problem:** `❌ Could not find model.py with KronosPredictor`

The Kronos repository uses a Python **package** (`model/` folder with `__init__.py`) not a flat `model.py` file. The original `find_model_py()` searched for a file named `model.py` — which doesn't exist.

**Root Cause:**
```
Expected by old code: src/kronos/model.py        ← doesn't exist
Actual structure:     src/kronos/model/__init__.py ← this is the entry point
                      src/kronos/model/kronos.py
                      src/kronos/model/module.py
```

**Solution:** Rewrote `find_kronos_root()` to search for `model/__init__.py` containing `KronosPredictor`, saves `kronos_root` (not `model_py`) to `kronos_path.json`. Runtime import uses `sys.path.insert(0, kronos_root)` then `from model import Kronos, KronosTokenizer, KronosPredictor` — exactly as the Kronos documentation specifies.

---

### Challenge 3 — PyArrow Crash on Trade Log

**Problem:** `pyarrow.lib.ArrowTypeError: Expected bytes, got a 'numpy.float64' object — Conversion failed for column Exit with type object`

The `Exit` column in the trade log DataFrame had mixed Python types:
- BUY rows: `Exit = "open"` (Python string)
- SELL rows: `Exit = 1394.0` (numpy float64)

PyArrow (used internally by Streamlit's `st.dataframe`) cannot serialise a column with mixed types.

**Solution:** Cast all Exit values to `str` before creating the DataFrame:
```python
tdf["Exit"] = tdf["Exit"].astype(str)
```
This converts all values to strings uniformly: `"open"`, `"1394.0"`, `"1419.4"`.

---

### Challenge 4 — RMSE Showing "nan"

**Problem:** RMSE metric card showed "nan" instead of a number.

**Root Cause:** `np.mean()` propagates NaN — if any prediction or actual value was NaN, the entire RMSE calculation returned NaN.

**Solution:** Replaced `np.mean()` with `np.nanmean()` and added explicit NaN masking:
```python
def safe_rmse(a, p):
    mask = ~(np.isnan(av) | np.isnan(pv))
    return float(np.sqrt(np.nanmean((av[mask] - pv[mask])**2)))
```

---

### Challenge 5 — Prediction Invisible on Chart

**Problem:** The forecast section appeared as a tiny sliver on the right edge of the chart, barely visible at scale.

**Root Cause:** `df.tail(300)` showed 300 historical bars next to only 10 predicted bars — predictions occupied ~3% of chart width.

**Solution:**
- History window = `5 × prediction_steps` (50 bars for 10-step horizon)
- Explicit `xaxis.range` from first history bar to last prediction + 2 days
- Explicit `yaxis.range` covering all prices with 0.5% padding
- Result: Prediction occupies ~17% of chart width — clearly visible

---

### Challenge 6 — `add_vline` Crash with Datetime Axis

**Problem:** `TypeError: unsupported operand type(s) for +: 'int' and 'str'` from `plotly/shapeannotation.py:_mean()`

Plotly's `add_vline()` internally tries `float(sum(X)) / len(X)` on the x-axis values. When the axis contains datetime strings, `sum()` tries to add an integer 0 to a string — which fails.

**Solution:** Replaced `add_vline()` with `add_shape()` + `add_annotation()`:
```python
fig.add_shape(type="line", x0=hd[-1], x1=hd[-1],
              y0=0, y1=1, xref="x", yref="paper",
              line=dict(color="#555", width=1, dash="dot"))
```
`add_shape` with `xref="x"` skips the internal `_mean()` calculation entirely.

---

### Challenge 7 — Deployment: Wrong Dependency File Used

**Problem:** Streamlit Cloud installed from `environment.yml` (conda) instead of `requirements.txt` (pip), missing `plotly`.

**Root Cause:** Repository had both `environment.yml` (from original project, no plotly) and `requirements.txt` (complete, with plotly). Streamlit Cloud always prefers `environment.yml` when both exist.

**Solution:** Deleted `environment.yml`. Streamlit Cloud now uses `requirements.txt` via uv, installs all 98 packages correctly including plotly.

---

### Challenge 8 — yfinance Rate Limiting on Cloud

**Problem:** `YFRateLimitError: Too Many Requests. Rate limited.` on Streamlit Cloud.

**Root Cause:** Hundreds of Streamlit apps share the same cloud IP addresses. Yahoo Finance detects high request volume from these IPs and rate-limits them. Local machine (1–2 requests/minute) never triggers this; cloud (hundreds of apps) does.

**Solution:** Added retry logic with exponential backoff in `fetch_yfinance()`:
- Attempt 1: immediate
- Attempt 2: wait 2 seconds
- Attempt 3: wait 5 seconds
- On `TooManyRequests` error: wait 5s, 10s before retrying

---

### Challenge 9 — Git Merge Conflict on Push

**Problem:** `error: failed to push some refs — Updates were rejected because the remote contains work that you do not have locally`

**Root Cause:** GitHub repo had commits made via the web interface (Streamlit Cloud sync) that weren't in the local copy. Attempting `git pull --rebase` created a conflict in `requirements.txt`.

**Solution:** `git rebase --abort` then `git push origin main --force` — safe to use on a personal project where you are the sole contributor and the remote's extra commits were unintentional.

---

## 11. Deployment

### 11.1 Deployment Architecture

```
Developer Machine
      │ git push
      ▼
GitHub (student-muskankumari/KronoX)
      │ webhook trigger
      ▼
Streamlit Community Cloud
  ├── Install packages.txt (apt: git)
  ├── Install requirements.txt (uv: 98 packages)
  ├── streamlit run app_hourly.py
  │     └── import cloud_startup → Kronos setup
  └── Serve at https://kronox.streamlit.app
```

### 11.2 Key Deployment Files

| File | Purpose |
|---|---|
| `requirements.txt` | All Python dependencies — plotly, torch, einops, etc. |
| `packages.txt` | System packages — `git` (required for Kronos clone) |
| `.streamlit/config.toml` | Dark theme, headless server, CORS disabled |
| `cloud_startup.py` | Auto-runs Kronos setup + model training on cold start |
| `model.joblib` | Pre-trained model committed to git (846 KB) |
| `features.joblib` | Feature names committed to git (272 bytes) |

### 11.3 Cold Start Sequence

```
[1] apt install git                    ~30 seconds
[2] uv pip install (98 packages)       ~30 seconds
[3] streamlit run app_hourly.py        starts
[4] cloud_startup._setup_kronos()      ~30 seconds (git clone)
[5] cloud_startup._train_if_missing()  skipped (model.joblib exists)
[6] App ready to serve                 total ~2 minutes
[7] First prediction click             ~30 seconds (HuggingFace weights download)
[8] Subsequent predictions             ~3-5 seconds (cached)
```

---

## 12. Performance Metrics

### 12.1 Model Performance

| Metric | Value |
|---|---|
| Directional Accuracy | ~55–58% |
| MAE (% of price) | ~1.05% |
| RMSE (price units) | ~27 (RELIANCE.NS, 1-year horizon) |
| MAPE | ~1.76% |
| Baseline (random) | 50% |
| Improvement over baseline | +5–8% |

### 12.2 Backtesting Performance (RELIANCE.NS, 2 Years)

| Metric | Value |
|---|---|
| Strategy Return | +9.27% |
| Buy & Hold | -15.37% |
| vs B&H | +24.63% |
| Max Drawdown | -14.1% |
| Sharpe Ratio | 0.41 |
| Win Rate | 50% |
| Total Trades | 2 (2-year period) |

### 12.3 App Performance

| Metric | Value |
|---|---|
| Initial load time | ~2 minutes (cold start) |
| Forecast time (ML) | ~2–3 seconds |
| Forecast time (Kronos) | ~5–15 seconds |
| Live refresh cycle | Configurable 5–600s |
| Memory usage | ~400–600 MB (with Kronos loaded) |

---

## 13. Future Improvements

### 13.1 Model Improvements

| Improvement | Expected Impact |
|---|---|
| Retrain with 5 years data | +10% accuracy |
| Add sector/market-cap features | +5% accuracy |
| Ensemble Kronos + ML signals | +8-12% accuracy |
| Fine-tune Kronos on NSE data | Significant for Indian stocks |
| LSTM/Transformer alternative | Potentially better sequential patterns |

### 13.2 Data Source Improvements

| Improvement | Benefit |
|---|---|
| Replace yfinance live price with Finnhub | More reliable real-time data |
| Add Zerodha/Upstox API for NSE | True tick-level Indian data |
| Add alternative data (news sentiment) | Non-price signals |
| Add options chain data | Better volatility estimation |

### 13.3 Feature Improvements

| Feature | Description |
|---|---|
| Multi-ticker comparison | Compare predictions for multiple stocks |
| Portfolio backtesting | Test strategy across a basket of stocks |
| Alert system | Email/SMS when model triggers BUY signal |
| Export to CSV | Download predictions and trade log |
| Paper trading mode | Track virtual trades in real-time |
| Fundamental data overlay | P/E, revenue growth on chart |

### 13.4 Technical Improvements

| Improvement | Benefit |
|---|---|
| Redis caching | Avoid re-fetching same data |
| Async data fetching | Faster load times |
| GPU inference for Kronos | 10× faster predictions |
| Model versioning | Track model performance over time |
| A/B testing framework | Compare Kronos vs ML vs ensemble |

---

## Summary

Kronos is a full-stack ML application that successfully integrates a traditional gradient boosting model, a state-of-the-art financial foundation model (Kronos-mini transformer), real-time market data, and an interactive backtesting engine into a single production-deployed web application. The project involved solving 9 significant technical challenges spanning ML integration, data quality, frontend rendering, and cloud deployment — demonstrating end-to-end software engineering skills from model training to live production serving.

**Live Application:** https://kronox.streamlit.app  
**Source Code:** https://github.com/student-muskankumari/KronoX
