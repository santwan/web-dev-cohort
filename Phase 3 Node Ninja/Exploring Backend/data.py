import pandas as pd
import numpy as np
from faker import Faker
import random
from datetime import datetime, timedelta

# Initialize Faker
fake = Faker('en_IN') # 'en_IN' for Indian context where available

# --- Configuration Parameters ---
NUM_LEGIT_USERS = 5000  # Number of legitimate users
NUM_FRAUD_USERS = 50    # Number of simulated fraudsters
TOTAL_TRANSACTIONS = 250000 # Aim for a similar scale to your found dataset
FRAUD_RATIO = 0.005     # 0.5% fraud ratio (adjust based on typical real-world rates, often much lower)

# UPI ID formats (simplified)
upi_id_domains = ['@ybl', '@okaxis', '@apl', '@sbi']

# Banks (common Indian banks)
banks = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda']

# Device types
device_types = ['Android', 'iOS', 'Web']

# Merchant Categories
merchant_categories = ['Food', 'Grocery', 'Fuel', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Transport', 'Utilities', 'Other']

# Location data (simplified for demonstration, could be more granular)
indian_cities = ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow']

# Define time range for transactions (e.g., last 6 months)
start_date = datetime(2025, 1, 1)
end_date = datetime(2025, 6, 30)

# --- Generate User Profiles ---
# This is crucial for user behavior analysis
users = []
for i in range(NUM_LEGIT_USERS + NUM_FRAUD_USERS):
    user_type = 'legit'
    if i >= NUM_LEGIT_USERS:
        user_type = 'fraud' # Mark a subset of users as potential fraudsters

    user_upi_id = f"user{i}_{random.randint(1000,9999)}{random.choice(upi_id_domains)}"
    typical_location = random.choice(indian_cities)
    typical_device = random.choice(device_types)
    # Add more user-specific attributes if needed (e.g., average amount, typical transaction frequency)
    users.append({
        'user_upi_id': user_upi_id,
        'user_type': user_type,
        'typical_location': typical_location,
        'typical_device': typical_device,
        'transaction_history': [] # To store transactions for behavioral features
    })
user_df = pd.DataFrame(users)

# Create a mapping for quick lookup
user_map = {user['user_upi_id']: user for user in users}

# --- Data Generation Logic ---
transactions = []
current_timestamp = start_date

# Adjust the step to distribute transactions over the period
time_step = (end_date - start_date) / TOTAL_TRANSACTIONS

print("Generating legitimate transactions...")
for i in range(int(TOTAL_TRANSACTIONS * (1 - FRAUD_RATIO))):
    current_timestamp += timedelta(seconds=random.randint(1, int(time_step.total_seconds() * 2))) # Randomize steps
    if current_timestamp > end_date:
        current_timestamp = start_date + timedelta(seconds=random.randint(0, int((end_date - start_date).total_seconds())))

    sender_user = random.choice(users[:NUM_LEGIT_USERS]) # Pick only from legit users for normal txns
    receiver_user = random.choice(users) # Receiver can be legit or potentially fraudster

    # Simulate P2P or P2M
    transaction_type = random.choices(['P2P', 'P2M', 'Bill Payment', 'Recharge'], weights=[0.6, 0.2, 0.1, 0.1], k=1)[0]
    amount = round(random.uniform(10, 5000), 2) # Typical UPI amounts

    # Vary amounts by transaction type
    if transaction_type == 'Bill Payment':
        amount = round(random.uniform(500, 15000), 2)
    elif transaction_type == 'Recharge':
        amount = round(random.uniform(10, 500), 2)
    elif transaction_type == 'P2M':
        amount = round(random.uniform(50, 20000), 2)

    # Status
    status = random.choices(['SUCCESS', 'FAILED'], weights=[0.98, 0.02], k=1)[0] # Most are successful

    # Location variation
    location_deviation = random.uniform(-0.01, 0.01) # Small deviation for legitimate users
    location = f"{sender_user['typical_location']}_{random.uniform(20.0, 29.0) + location_deviation:.4f},{random.uniform(70.0, 79.0) + location_deviation:.4f}"

    transaction = {
        'transaction_id': fake.uuid4(),
        'timestamp': current_timestamp,
        'user_upi_id': sender_user['user_upi_id'],
        'receiver_upi_id': receiver_user['user_upi_id'],
        'amount': amount,
        'transaction_type': transaction_type,
        'status': status,
        'sender_bank': random.choice(banks),
        'receiver_bank': random.choice(banks),
        'device_type': sender_user['typical_device'],
        'ip_address': fake.ipv4(),
        'location': location,
        'merchant_id': fake.uuid4() if transaction_type == 'P2M' else np.nan,
        'merchant_category': random.choice(merchant_categories) if transaction_type == 'P2M' else np.nan,
        'is_fraud': 0
    }
    transactions.append(transaction)
    user_map[sender_user['user_upi_id']]['transaction_history'].append(transaction)

print("Generating fraudulent transactions...")
# --- Inject Fraudulent Transactions ---
fraud_scenarios = [
    # 1. Account Takeover (ATO) - Unusual device/location, large transaction to new receiver
    {'type': 'ATO', 'probability': 0.3},
    # 2. Phishing/Social Engineering - User tricked into sending money to a suspicious new receiver
    {'type': 'Phishing', 'probability': 0.2},
    # 3. Small test transaction followed by large transaction
    {'type': 'Small-Large', 'probability': 0.2},
    # 4. High Velocity Transactions (Burst of activity)
    {'type': 'High_Velocity', 'probability': 0.15},
    # 5. International transaction anomaly (if location allows) - not strictly UPI, but good for general fraud
    {'type': 'International_Anomaly', 'probability': 0.05} # Less likely for UPI but useful concept
]

for i in range(int(TOTAL_TRANSACTIONS * FRAUD_RATIO)):
    current_timestamp += timedelta(seconds=random.randint(1, int(time_step.total_seconds() * 2)))
    if current_timestamp > end_date:
        current_timestamp = start_date + timedelta(seconds=random.randint(0, int((end_date - start_date).total_seconds())))

    fraud_user = random.choice(users[NUM_LEGIT_USERS:]) # Pick from designated fraud users
    receiver_upi_id = f"fraud_receiver_{fake.uuid4().split('-')[0]}{random.choice(upi_id_domains)}" # Suspicious receiver

    scenario = random.choices([s['type'] for s in fraud_scenarios], weights=[s['probability'] for s in fraud_scenarios], k=1)[0]

    amount = round(random.uniform(5000, 100000), 2) # Higher amounts for fraud
    transaction_type = random.choice(['P2P', 'P2M']) # Common for fraud
    status = 'SUCCESS' # Fraudsters aim for success
    is_fraud = 1

    sender_bank = random.choice(banks)
    receiver_bank = random.choice(banks)

    device_type = fraud_user['typical_device']
    ip_address = fake.ipv4()
    location = fraud_user['typical_location'] # Default for fraud user

    if scenario == 'ATO':
        # Simulate unusual device/location for ATO
        device_type = random.choice([dt for dt in device_types if dt != fraud_user['typical_device']])
        ip_address = fake.ipv4(private=False) # A public IP
        location = random.choice([city for city in indian_cities if city != fraud_user['typical_location']]) # Far-off location
        amount = round(random.uniform(50000, 500000), 2) # Very large amount
        receiver_upi_id = f"ato_receiver_{fake.uuid4().split('-')[0]}{random.choice(upi_id_domains)}"

    elif scenario == 'Phishing':
        # User is tricked, so sender details might look normal, but receiver is suspicious
        receiver_upi_id = f"phish_scam_{fake.uuid4().split('-')[0]}{random.choice(upi_id_domains)}"
        amount = round(random.uniform(10000, 200000), 2)
        # Maybe slightly different device/location from usual, but not wildly so
        if random.random() < 0.3: # 30% chance of slight deviance
            device_type = random.choice([dt for dt in device_types if dt != fraud_user['typical_device']])
            location_deviation = random.uniform(0.05, 0.1)
            location = f"{fraud_user['typical_location']}_{random.uniform(20.0, 29.0) + location_deviation:.4f},{random.uniform(70.0, 79.0) + location_deviation:.4f}"

    elif scenario == 'Small-Large':
        # Generate a small transaction first, then a large one shortly after
        small_amount = round(random.uniform(1, 100), 2)
        large_amount = round(random.uniform(50000, 500000), 2)
        transactions.append({
            'transaction_id': fake.uuid4(),
            'timestamp': current_timestamp - timedelta(minutes=random.randint(1, 5)), # Small txn just before
            'user_upi_id': fraud_user['user_upi_id'],
            'receiver_upi_id': receiver_upi_id,
            'amount': small_amount,
            'transaction_type': 'P2P',
            'status': 'SUCCESS',
            'sender_bank': sender_bank,
            'receiver_bank': receiver_bank,
            'device_type': device_type,
            'ip_address': ip_address,
            'location': location,
            'merchant_id': np.nan,
            'merchant_category': np.nan,
            'is_fraud': 1
        })
        # The main loop transaction will be the large one
        amount = large_amount
        status = 'SUCCESS'

    elif scenario == 'High_Velocity':
        # Generate several rapid transactions
        num_burst_txns = random.randint(3, 7)
        for _ in range(num_burst_txns):
            burst_amount = round(random.uniform(100, 5000), 2)
            burst_receiver = f"burst_rec_{fake.uuid4().split('-')[0]}{random.choice(upi_id_domains)}"
            transactions.append({
                'transaction_id': fake.uuid4(),
                'timestamp': current_timestamp + timedelta(seconds=random.randint(1, 60)), # Within a minute
                'user_upi_id': fraud_user['user_upi_id'],
                'receiver_upi_id': burst_receiver,
                'amount': burst_amount,
                'transaction_type': 'P2P',
                'status': 'SUCCESS',
                'sender_bank': sender_bank,
                'receiver_bank': receiver_bank,
                'device_type': device_type,
                'ip_address': ip_address,
                'location': location,
                'merchant_id': np.nan,
                'merchant_category': np.nan,
                'is_fraud': 1
            })
        # The main loop transaction also becomes part of the burst
        amount = round(random.uniform(100, 5000), 2)
        status = 'SUCCESS'
        receiver_upi_id = f"burst_rec_{fake.uuid4().split('-')[0]}{random.choice(upi_id_domains)}"

    elif scenario == 'International_Anomaly':
        # Simulate a transaction from a highly unusual, possibly international, location
        foreign_cities = ['New York', 'London', 'Dubai', 'Singapore']
        location = f"{random.choice(foreign_cities)}_{random.uniform(0.0, 90.0):.4f},{random.uniform(-180.0, 180.0):.4f}"
        amount = round(random.uniform(20000, 1000000), 2) # Very large, potentially cross-border
        receiver_upi_id = f"intl_receiver_{fake.uuid4().split('-')[0]}{random.choice(upi_id_domains)}"


    transaction = {
        'transaction_id': fake.uuid4(),
        'timestamp': current_timestamp,
        'user_upi_id': fraud_user['user_upi_id'],
        'receiver_upi_id': receiver_upi_id,
        'amount': amount,
        'transaction_type': transaction_type,
        'status': status,
        'sender_bank': sender_bank,
        'receiver_bank': receiver_bank,
        'device_type': device_type,
        'ip_address': ip_address,
        'location': location,
        'merchant_id': fake.uuid4() if transaction_type == 'P2M' else np.nan,
        'merchant_category': random.choice(merchant_categories) if transaction_type == 'P2M' else np.nan,
        'is_fraud': is_fraud
    }
    transactions.append(transaction)
    user_map[fraud_user['user_upi_id']]['transaction_history'].append(transaction)


df = pd.DataFrame(transactions)
df = df.sort_values(by='timestamp').reset_index(drop=True) # Sort by time for behavioral features

print(f"Generated {len(df)} transactions. Fraudulent transactions: {df['is_fraud'].sum()}")
print(df.head())

# --- Feature Engineering (Post-Generation for Behavioral Features) ---
# This part processes the generated data to create behavioral features.
# For efficiency with large datasets, consider window functions if using a database
# or more optimized pandas operations.

df['timestamp'] = pd.to_datetime(df['timestamp'])
df = df.sort_values(by=['user_upi_id', 'timestamp'])

print("Engineering behavioral features...")

# User-level aggregates (requires sorting by user and time)
df['last_transaction_time'] = df.groupby('user_upi_id')['timestamp'].shift(1)
df['time_since_last_txn'] = (df['timestamp'] - df['last_transaction_time']).dt.total_seconds().fillna(0)

# Rolling window features (more computationally intensive for large data, conceptual)
# You might need to implement these with custom functions or more advanced libraries for scale
def get_rolling_features(df_group):
    df_group = df_group.sort_values(by='timestamp').set_index('timestamp')
    df_group['transaction_velocity_1h_user'] = df_group.rolling('1H')['transaction_id'].count() -1 # Exclude current txn
    df_group['transaction_velocity_24h_user'] = df_group.rolling('24H')['transaction_id'].count() -1
    df_group['avg_amount_7d_user'] = df_group.rolling('7D')['amount'].mean()
    df_group['unique_receivers_24h_user'] = df_group.rolling('24H')['receiver_upi_id'].apply(lambda x: x.nunique()) -1
    return df_group.reset_index()

# Apply rolling features per user (this can be slow for many users/transactions, consider optimization)
# If your dataset is huge, you might need to iterate in chunks or use libraries like Dask.
# For 250k rows, a direct groupby might work, but monitor memory/time.
# For simplicity, let's just calculate unique receivers and velocity, and manually flag location/device changes.

# Unique receivers (more straightforward to calculate)
df['unique_receivers_past_24h'] = df.groupby('user_upi_id')['receiver_upi_id'].transform(
    lambda x: x.expanding().apply(lambda y: y.nunique()) # This is cumulative, not rolling 24h
)
# For true rolling 24h, you'd need a more complex apply with custom windowing or specialized libraries.
# Example for a simplified velocity (count of transactions in the past 10 minutes, for demonstration)
df['prev_timestamps'] = df.groupby('user_upi_id')['timestamp'].transform(lambda x: x.shift(1).dt.time)
df['current_time'] = df['timestamp'].dt.time

# This is a very simplified velocity. For accurate rolling velocity, you'd need a more robust approach.
# A common way is to re-index the grouped data by time and then use rolling().
# For now, let's keep it simple and focus on the concept.

# Location and Device Change Flags
# This needs to be done carefully to compare against a user's *typical* behavior, not just previous txn.
# For now, we'll mark based on deviation from the *generated* typical location/device from user_df

df = df.merge(user_df[['user_upi_id', 'typical_location', 'typical_device']], on='user_upi_id', how='left')
df['location_change_flag'] = (df['location'].str.split('_').str[0] != df['typical_location']).astype(int)
df['device_change_flag'] = (df['device_type'] != df['typical_device']).astype(int)


# Add simple time features
df['hour_of_day'] = df['timestamp'].dt.hour
df['day_of_week'] = df['timestamp'].dt.dayofweek
df['is_weekend'] = ((df['day_of_week'] == 5) | (df['day_of_week'] == 6)).astype(int)

# --- Final Clean-up and Export ---
df.drop(columns=['last_transaction_time', 'prev_timestamps', 'current_time', 'typical_location', 'typical_device'], inplace=True, errors='ignore')

print("\nSample of generated data:")
print(df.sample(5))

print("\nFraud distribution:")
print(df['is_fraud'].value_counts())

# Save to CSV
df.to_csv('synthetic_upi_transactions.csv', index=False)
print("\nSynthetic data saved to 'synthetic_upi_transactions.csv'")