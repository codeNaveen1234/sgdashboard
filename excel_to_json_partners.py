import openpyxl
import json
import os
import re
from constants import PAGE_METADATA, TABS_METADATA


def convert_drive_link_to_direct_url(link):
    """
    Convert a Google Drive sharing link to a direct image URL.
    """
    if not isinstance(link, str):
        return ''
    
    # Match Google Drive file ID
    match = re.search(r"/d/([a-zA-Z0-9_-]+)", link)
    if match:
        file_id = match.group(1)
        return f"https://drive.google.com/uc?export=view&id={file_id}"
    return link.strip()


def excel_to_json_partners():
    try:
        # Get the directory of the current script
        script_dir = os.path.dirname(os.path.abspath(__file__))

        # Define file paths
        file_path = os.path.join(script_dir, "doc.xlsx")
        json_path = os.path.join(script_dir, "public/assets", "landing-page.json")

        # Load Excel workbook and sheet
        workbook = openpyxl.load_workbook(file_path, data_only=True)
        try:
            sheet = workbook[PAGE_METADATA["PARTNERS"]]
        except KeyError:
            print(f"❌ Error: Sheet '{PAGE_METADATA['PARTNERS']}' not found.")
            print("Available sheets:", workbook.sheetnames)
            return

        # Read headers from first row
        headers = [str(cell.value).strip() if cell.value is not None else '' for cell in sheet[1]]
        expected_columns = TABS_METADATA["PARTNERS"]

        # Ensure all expected columns are present
        if not all(col in headers for col in expected_columns):
            print("❌ Error: Missing required columns in Excel sheet.")
            print("Expected:", expected_columns)
            print("Found:", headers)
            return

        # Collect valid partner data from rows
        data = []
        for row_idx, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
            try:
                raw_name = row[headers.index(expected_columns[0])]
                if not raw_name or not str(raw_name).strip():
                    continue  # Skip row if name is missing or blank

                raw_src = row[headers.index(expected_columns[1])] or ''
                logo_url = convert_drive_link_to_direct_url(raw_src)

                row_data = {
                    'name': str(raw_name).strip(),
                    'src': logo_url,
                    'partnerState':row[headers.index(expected_columns[2])] or '',
                    'category': row[headers.index(expected_columns[3])] or '',
                    'website': row[headers.index(expected_columns[4])] or ''
                }

                # Generate id and alt from name
                name_clean = row_data['name'].lower().replace(" ", "")
                row_data['id'] = name_clean
                row_data['alt'] = name_clean

                data.append(row_data)

            except Exception as e:
                print(f"⚠️ Error processing row {row_idx}: {e}")
                continue

        # Read existing JSON data
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                try:
                    json_data = json.load(f)
                except json.JSONDecodeError:
                    json_data = []
        else:
            json_data = []

        # Ensure JSON is a list
        if not isinstance(json_data, list):
            json_data = [json_data]

        # Append to existing partner-logos section or create it
        found = False
        for obj in json_data:
            if isinstance(obj, dict) and obj.get('type', '').strip().lower() == 'partner-logos':
                if 'partners' not in obj or not isinstance(obj['partners'], list):
                    obj['partners'] = []
                obj['partners'].extend(data)
                found = True
                break

        if not found:
            json_data.append({
                "type": "partner-logos",
                "width": "100%",
                "position": "left",
                "title": "Our Network",
                "showFilters": False,
                "partners": data,
                "styles": {
                    "section": "partner-logos-section",
                    "title": "section-title",
                    "category": "partner-category",
                    "logosContainer": "logos-container",
                    "logo": "partner-logo"
                }
            })

        # Write back to JSON file
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)

        print("✅ Partner data appended successfully.")

    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    excel_to_json_partners()
