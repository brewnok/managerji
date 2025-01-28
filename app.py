import os
import time
import json
from datetime import datetime
import csv
import sqlite3
import requests

db_file_path = 'database/hotel_data.db'
file_path = "roomdata.json"
output_dir = "database/csv_sheets"
customer_table_path = os.path.join(output_dir,"customer_table.csv")
services_table_path = os.path.join(output_dir,"services_table.csv")

api_key = "74b28f23dc2411b7a9dd0fef23023f8eFFFFNRAL"
insights_api = "https://insights-collector.newrelic.com/v1/accounts/3774110/event"


def monitor_file():
      last_modified_time = os.path.getmtime(file_path)
      current_modified_time = os.path.getmtime(file_path)

      if current_modified_time != last_modified_time:
            return "C"
            last_modified_time = current_modified_time
      else:
            return "NC"
      
def generate_unique_id(room):
      roomNum = room["roomNumber"]
      name = room["personalDetails"]["name"]
      check_in_time = datetime.fromisoformat(room["checkInTime"].replace("Z", "+00:00"))
      check_out_time = datetime.fromisoformat(room["checkOutTime"].replace("Z", "+00:00"))
      aadhaar = room["personalDetails"]["aadhaar"]
      unique_id = f"{roomNum}_{name}_{check_in_time.strftime('%Y%m%d')}_{check_out_time.strftime('%Y%m%d')}_{aadhaar}"
      return unique_id

def prepare_csv():
      with open(file_path, 'r') as file:
            room_data = json.load(file)

      customer_table = []
      services_table = []

      for room in room_data:
            customer_id = generate_unique_id(room)
            floor = room['floor']
            room_number = room['roomNumber']
            phone = room['personalDetails'].get('phone', '')
            aadhaar = room['personalDetails'].get('aadhaar', '')
            number_of_adults = room['personalDetails'].get('numberOfAdults', 0)
            adult_names = ', '.join([adult['name'] for adult in room['personalDetails'].get('adults', [])])
            check_in_time = room.get('checkInTime', '')
            check_out_time = room.get('checkOutTime', '')
            total_bill = room.get('totalBill', 0)

            customer_row = [
                  customer_id, floor, room_number, phone, aadhaar,
                  number_of_adults, adult_names, check_in_time, check_out_time, total_bill
            ]
            customer_table.append(customer_row)

            if room.get('services'):
                  for service in room['services']:
                        service_row = [
                        customer_id, service.get('id', ''), service.get('type', ''),
                        service.get('date', ''), service.get('quantity', 0),
                        service.get('name', ''), service.get('price', 0)
                        ]
                        services_table.append(service_row)
            else:
                  services_table.append([
                        customer_id, '', '', '', 0, '', 0
                  ])

      with open(os.path.join(output_dir,'customer_table.csv'), 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["customerID", "floor", "roomNumber", "phone", "aadhaar", "numberOfAdults", "adultNames", "checkInTime", "checkOutTime", "totalBill"])
            writer.writerows(customer_table)

      with open(os.path.join(output_dir,'services_table.csv'), 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["customerID", "id", "type", "date", "quantity", "name", "price"])
            writer.writerows(services_table)

      print(f"CSV files have been saved in : {output_dir} path")
      
      
def create_db():
      conn = sqlite3.connect(db_file_path)
      cursor = conn.cursor()

      cursor.execute('''
      CREATE TABLE IF NOT EXISTS customer_table (
      customerID TEXT,
      floor TEXT,
      roomNumber TEXT,
      phone TEXT,
      aadhaar TEXT,
      numberOfAdults TEXT,
      adultNames TEXT,
      checkInTime TEXT,
      checkOutTime TEXT,
      totalBill TEXT
      )
      ''')

      cursor.execute('''
      CREATE TABLE IF NOT EXISTS services_table (
      customerID TEXT,
      id TEXT,
      type TEXT,
      date TEXT,
      quantity TEXT,
      name TEXT,
      price TEXT
      )
      ''')

      conn.commit()
      conn.close()

      print("Database and tables created successfully.")
   

def send_to_db():
      conn = sqlite3.connect(db_file_path)
      cursor = conn.cursor()

      def insert_customer_data(file_path):
            with open(file_path, mode='r') as file:
                  csv_reader = csv.DictReader(file)
                  for row in csv_reader:
                        cursor.execute('''
                        INSERT INTO customer_table (customerID, floor, roomNumber, phone, aadhaar, numberOfAdults, adultNames, checkInTime, checkOutTime, totalBill)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ''', (
                        row['customerID'],
                        row['floor'],
                        row['roomNumber'],
                        row['phone'],
                        row['aadhaar'],
                        row['numberOfAdults'],
                        row['adultNames'],
                        row['checkInTime'],
                        row['checkOutTime'],
                        row['totalBill']
                        ))
            print("Customer data inserted successfully.")

      def insert_service_data(file_path):
            with open(file_path, mode='r') as file:
                  csv_reader = csv.DictReader(file)
                  for row in csv_reader:
                        cursor.execute('''
                        INSERT INTO services_table (customerID, id, type, date, quantity, name, price)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        ''', (
                        row['customerID'],
                        row['id'],
                        row['type'],
                        row['date'],
                        row['quantity'],
                        row['name'],
                        row['price']
                        ))
            print("Service data inserted successfully.")

      insert_customer_data(customer_table_path)
      insert_service_data(services_table_path)

      conn.commit()
      conn.close()

def prepare_nr_object(csv_file_name, event_name):
      with open(csv_file_name, mode='r') as file:
            csv_reader = csv.DictReader(file)
            data = []
            for row in csv_reader:
                  row["eventType"] = event_name
                  data.append(row)

      return data

def send_data_to_new_relic(data):
        headers = {
            'Content-Type': 'application/json',
            'Api-Key': api_key
        }
        json_data = json.dumps(data)
        response = requests.post(insights_api, headers=headers, data=json_data)
        
        if response.status_code == 200:
            print('---- DATA SENT TO NEW RELIC ----')

        else:
            print(f'Failed to send data. Status code: {response.status_code}')
            print(f'Response: {response.text}')


def main():
      last_modified_time = os.path.getmtime(file_path)
      while True:
            current_modified_time = os.path.getmtime(file_path)
            if current_modified_time != last_modified_time:
                  try:
                        prepare_csv()
                        send_to_db()
                        customer_data = prepare_nr_object(customer_table_path, "customer_data")
                        services_data = prepare_nr_object(services_table_path, "services_data")
                        send_data_to_new_relic(customer_data)
                        send_data_to_new_relic(services_data)
                        last_modified_time = current_modified_time
                        file = open('roomdata.json', 'w')
                        file.close()
                        last_modified_time = current_modified_time
                  except:
                        print("Re-routing to while block")
                        last_modified_time = current_modified_time

            else:
                  print("NO CHANGE IN THE FILE")
            time.sleep(1)
      
      
main()
