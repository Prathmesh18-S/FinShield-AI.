import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import IsolationForestModel, LOFModel
from utils import extract_features
import pandas as pd
import traceback

app = Flask(__name__)
CORS(app)

# Initialize models
if_model = IsolationForestModel()
lof_model = LOFModel()

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'saved_models')
os.makedirs(MODEL_DIR, exist_ok=True)

# Load existing models if available
if_path = os.path.join(MODEL_DIR, 'if_model.joblib')
lof_path = os.path.join(MODEL_DIR, 'lof_model.joblib')
if os.path.exists(if_path):
    if_model.load_model(if_path)
if os.path.exists(lof_path):
    lof_model.load_model(lof_path)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = extract_features(data)
        
        # Simple ensemble: average of IF and LOF scores
        if_score = if_model.predict(features)
        lof_score = lof_model.predict(features)
        
        final_score = (if_score + lof_score) / 2
        
        return jsonify({
            'success': True,
            'risk_score': final_score,
            'details': {
                'isolation_forest': if_score,
                'lof': lof_score
            }
        })
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/predict-batch', methods=['POST'])
def predict_batch():
    try:
        data = request.json
        transactions = data.get('transactions', [])
        
        results = []
        for txn in transactions:
            features = extract_features(txn)
            if_score = if_model.predict(features)
            lof_score = lof_model.predict(features)
            
            final_score = (if_score + lof_score) / 2
            results.append({
                'transaction_id': txn.get('transaction_id', ''),
                'risk_score': final_score,
                'details': {
                    'isolation_forest': if_score,
                    'lof': lof_score
                }
            })
            
        return jsonify({
            'success': True,
            'predictions': results
        })
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/train', methods=['POST'])
def train():
    try:
        data = request.json
        transactions = data.get('transactions', [])
        if not transactions:
            return jsonify({'success': False, 'error': 'No training data provided'}), 400
            
        features_list = [extract_features(txn) for txn in transactions]
        df = pd.DataFrame(features_list)
        
        if_model.train(df)
        lof_model.train(df)
        
        if_model.save_model(if_path)
        lof_model.save_model(lof_path)
        
        return jsonify({
            'success': True,
            'message': 'Models trained successfully'
        })
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
