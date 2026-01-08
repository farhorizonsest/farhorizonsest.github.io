import gspread
from oauth2client.service_account import ServiceAccountCredentials
from docxtpl import DocxTemplate
from datetime import datetime
import os

# --- CONFIGURATION ---
SHEET_NAME = "Far Horizons Booking Request (Responses)"
TEMPLATE_FILE = "template.docx"
CREDENTIALS_FILE = "credentials.json"

def main():
    print("🤖 AI ROBOT: Waking up...")

    # 1. AUTHENTICATION
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    creds = ServiceAccountCredentials.from_json_keyfile_name(CREDENTIALS_FILE, scope)
    client = gspread.authorize(creds)

    # 2. OPEN THE SHEET
    try:
        sheet = client.open(SHEET_NAME).sheet1
        print(f"✅ Connected to: {SHEET_NAME}")
    except Exception as e:
        print(f"❌ ERROR: Could not find sheet. Check the name!")
        print(e)
        return

    # 3. GET DATA
    data = sheet.get_all_values()
    headers = data[0]
    rows = data[1:]

    # Find column indexes dynamically
    try:
        idx_name = headers.index("Full Name (As on Passport)")
        idx_phone = headers.index("Phone Number (With Country Code)")
        idx_email = headers.index("Email Address")
        idx_from = headers.index("Departure City (From)")
        idx_to = headers.index("Arrival City (To)")
        idx_date = headers.index("Departure  Date")
        idx_class = headers.index("Cabin Class")
        
        # --- NEW FIELDS ADDED HERE ---
        idx_passport = headers.index("Passport Number")
        idx_nationality = headers.index("Nationality")
        idx_expiry = headers.index("Passport Expiry Date")
        idx_notes = headers.index("Special Requests / Notes")

        # Status Column Logic
        if "Status" in headers:
            idx_status = headers.index("Status")
        else:
            sheet.update_cell(1, len(headers) + 1, "Status")
            idx_status = len(headers) 

    except ValueError as e:
        print("❌ ERROR: Column headers changed! Check Google Sheet.")
        print(e)
        return

    print("🔎 Scanning for new bookings...")
    invoices_generated = 0

    # 4. LOOP THROUGH ROWS
    for i, row in enumerate(rows):
        sheet_row_num = i + 2
        
        if not row[0]: continue # Empty row
        
        # Safe length check
        status = row[idx_status] if len(row) > idx_status else ""

        if status == "DONE":
            continue 

        client_name = row[idx_name]
        print(f"⚡ Processing: {client_name}")

        # --- PREPARE DATA FOR WORD ---
        context = {
            'ref_num': f"FH-{datetime.now().strftime('%m%d')}-{sheet_row_num}",
            'today_date': datetime.now().strftime("%Y-%m-%d"),
            
            # Client Details
            'name': client_name,
            'phone': row[idx_phone],
            'email': row[idx_email],
            'nationality': row[idx_nationality],
            'passport_num': row[idx_passport],
            'passport_exp': row[idx_expiry],
            
            # Flight Details
            'from_city': row[idx_from],
            'to_city': row[idx_to],
            'travel_date': row[idx_date],
            'cabin': row[idx_class],
            'notes': row[idx_notes],
            
            # Payment Placeholder
            'price': "SAR 0.00" 
        }

        # 5. GENERATE INVOICE
        try:
            doc = DocxTemplate(TEMPLATE_FILE)
            doc.render(context)
            
            filename = f"Invoice_{client_name.replace(' ', '_')}.docx"
            doc.save(filename)
            print(f"   📄 Saved: {filename}")

            sheet.update_cell(sheet_row_num, idx_status + 1, "DONE")
            invoices_generated += 1

        except Exception as e:
            print(f"   ❌ Failed: {e}")

    if invoices_generated > 0:
        print(f"🎉 Success! Generated {invoices_generated} invoices.")
    else:
        print("😴 No new bookings.")

if __name__ == '__main__':
    main()