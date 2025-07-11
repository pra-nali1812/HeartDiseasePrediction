import joblib
import os
import pandas as pd
from django.conf import settings
import numpy as np

MODEL_PATH = os.path.join(settings.BASE_DIR, 'predictor', 'model', 'random_forest.pkl')
CSV_PATH = os.path.join(settings.BASE_DIR, 'static', 'heart.csv')

def load_model():
    return joblib.load(MODEL_PATH)

def predict_heart_disease(features):
    model = load_model()
    prediction = model.predict([features])
    return bool(prediction[0])

def get_prediction_from_csv(features, return_match=False):
    df = pd.read_csv(CSV_PATH)
    match = df[
        (df['age'] == features[0]) &
        (df['sex'] == features[1]) &
        (df['cp'] == features[2]) &
        (df['trestbps'] == features[3]) &
        (df['chol'] == features[4]) &
        (df['fbs'] == features[5]) &
        (df['restecg'] == features[6]) &
        (df['thalach'] == features[7]) &
        (df['exang'] == features[8]) &
        (df['oldpeak'] == features[9]) &
        (df['slope'] == features[10]) &
        (df['ca'] == features[11]) &
        (df['thal'] == features[12])
    ]
    if not match.empty:
        result = int(match.iloc[0]['target'])
        if return_match:
            return result, True
        return result
    else:
        if return_match:
            return 0, False
        return 0

def get_closest_prediction_from_csv(features):
    df = pd.read_csv(CSV_PATH)
    feature_cols = ['age','sex','cp','trestbps','chol','fbs','restecg','thalach','exang','oldpeak','slope','ca','thal']
    df_features = df[feature_cols].values.astype(float)
    features_arr = np.array(features, dtype=float)
    distances = np.sum(np.abs(df_features - features_arr), axis=1)
    min_idx = np.argmin(distances)
    closest_row = df.iloc[min_idx]
    result = int(closest_row['target'])
    return result, closest_row.to_dict(), float(distances[min_idx]) 