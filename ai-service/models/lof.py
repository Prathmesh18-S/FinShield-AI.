import joblib
import pandas as pd
from sklearn.neighbors import LocalOutlierFactor

class LOFModel:
    def __init__(self, contamination=0.1, n_neighbors=20):
        self.contamination = contamination
        self.n_neighbors = n_neighbors
        # novelty=True allows prediction on new data
        self.model = LocalOutlierFactor(n_neighbors=self.n_neighbors, contamination=self.contamination, novelty=True)
        self.is_trained = False
        
    def train(self, features_df):
        if len(features_df) < self.n_neighbors:
            self.model.set_params(n_neighbors=len(features_df) - 1 if len(features_df) > 1 else 1)
        self.model.fit(features_df)
        self.is_trained = True
        
    def predict(self, features):
        if not self.is_trained:
            return 20.0
            
        df = pd.DataFrame([features])
        # decision_function returns negative for outliers, positive for inliers
        score = self.model.decision_function(df)[0]
        
        risk = 50.0 - (score * 100.0)
        risk = max(0.0, min(100.0, risk))
        
        return risk
        
    def save_model(self, path):
        if self.is_trained:
            joblib.dump(self.model, path)
            
    def load_model(self, path):
        self.model = joblib.load(path)
        self.is_trained = True
