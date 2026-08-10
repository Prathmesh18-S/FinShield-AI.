import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest

class IsolationForestModel:
    def __init__(self, contamination=0.1):
        self.contamination = contamination
        self.model = IsolationForest(contamination=self.contamination, random_state=42)
        self.is_trained = False
        
    def train(self, features_df):
        if len(features_df) == 0:
            raise ValueError("Training data is empty")
        self.model.fit(features_df)
        self.is_trained = True
        
    def predict(self, features):
        if not self.is_trained:
            # Default fallback score if not trained
            return 20.0 
            
        df = pd.DataFrame([features])
        # IF returns -1 for outliers, 1 for inliers
        # decision_function returns negative for outliers, positive for inliers
        score = self.model.decision_function(df)[0]
        
        # Convert decision function score to 0-100 risk score
        # decision_function typically between -0.5 and 0.5
        # We want more negative to be higher risk
        risk = 50.0 - (score * 100.0)
        risk = max(0.0, min(100.0, risk))
        
        return risk
        
    def save_model(self, path):
        if self.is_trained:
            joblib.dump(self.model, path)
            
    def load_model(self, path):
        self.model = joblib.load(path)
        self.is_trained = True
