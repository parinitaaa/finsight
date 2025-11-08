from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import BytesIO

app = FastAPI()

# ✅ Enable CORS so React can call Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-excel")
async def analyze_excel(file: UploadFile = File(...)):
    if not (file.filename.endswith(".xlsx") or file.filename.endswith(".xls") or file.filename.endswith(".csv")):
        raise HTTPException(status_code=400, detail="Upload an Excel or CSV file.")

    try:
        contents = await file.read()

        if file.filename.endswith(".csv"):
            df = pd.read_csv(BytesIO(contents))
        else:
            df = pd.read_excel(BytesIO(contents))

        required_columns = ["Date", "Category", "Amount"]
        for col in required_columns:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Missing column: {col}")

        df["Amount"] = pd.to_numeric(df["Amount"], errors="coerce").fillna(0)
        df["Date"] = pd.to_datetime(df["Date"], errors="coerce")

        total = float(df["Amount"].sum())

        category_summary = (
            df.groupby("Category")["Amount"]
            .sum()
            .reset_index()
            .sort_values("Amount", ascending=False)
        )

        date_summary = (
            df.groupby(df["Date"].dt.strftime("%Y-%m-%d"))["Amount"]
            .sum()
            .reset_index()
            .rename(columns={"Date": "Date"})
        )

        return {
            "raw": df.to_dict(orient="records"),
            "category_summary": category_summary.to_dict(orient="records"),
            "date_summary": date_summary.to_dict(orient="records"),
            "total": total,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
