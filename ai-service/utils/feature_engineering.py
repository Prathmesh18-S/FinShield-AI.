import pandas as pd
import numpy as np
from datetime import datetime

def extract_features(transaction_data):
    """
    Extract features from transaction data.
    Expected dict with:
    - amount (float)
    - timestamp (str or float)
    """
    amount = float(transaction_data.get('amount', 0.0))
    timestamp = transaction_data.get('timestamp')
    
    # Parse timestamp
    if isinstance(timestamp, str):
        try:
            dt = pd.to_datetime(timestamp)
        except:
            dt = datetime.now()
    elif isinstance(timestamp, (int, float)):
        # Assuming ms or s
        if timestamp > 1e11:
            dt = datetime.fromtimestamp(timestamp / 1000)
        else:
            dt = datetime.fromtimestamp(timestamp)
    else:
        dt = datetime.now()
        
    hour = dt.hour
    day_of_week = dt.weekday()
    
    is_weekend = 1.0 if day_of_week >= 5 else 0.0
    is_night = 1.0 if (hour < 6 or hour > 22) else 0.0
    amount_log = np.log1p(max(0.0, amount))
    
    features = {
        'amount': amount,
        'hour': hour,
        'day_of_week': day_of_week,
        'is_weekend': is_weekend,
        'is_night': is_night,
        'amount_log': amount_log
    }
    
    return features
