import openpyxl
import json
import os

def excel_to_json():
    try:
        # Get the directory of the current script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        print(f"Looking for doc.xlsx in directory: {script_dir}")
        # Define the path to the Excel file (doc.xlsx in the same directory)
        file_path = os.path.join(script_dir, "doc.xlsx")

        # Verify file exists
        if not os.path.exists(file_path):
            print(f"Error: File 'doc.xlsx' not found in directory: {script_dir}")
            print("Please ensure 'doc.xlsx' is in the same directory as this script.")
            return

        # Open the Excel file
        workbook = openpyxl.load_workbook(file_path, data_only=True)

        # Try to access the "Data on homepage" sheet
        try:
            sheet = workbook["Goals"]
        except KeyError:
            print("Error: Sheet 'Data on homepage' not found in the Excel file.")
            print(f"Available sheets: {workbook.sheetnames}")
            return

        # Print sheet details for debugging
        max_row = sheet.max_row
        max_column = sheet.max_column
        print(f"Available sheets: {workbook.sheetnames}")
        print(f"Sheet 'Data on homepage' found.")
        print(f"Number of rows: {max_row}")
        print(f"Number of columns: {max_column}")
        print(f"Headers: {[cell.value for cell in sheet[2]]}")
        print("Raw data (all rows):")
        for row_idx, row in enumerate(sheet.iter_rows(values_only=True), start=1):
            print(f"Row {row_idx}: {row}")

        # Validate expected columns (assuming first row is header)
        # expected_columns = ['Indicator', 'Definition', 'Data', 'Icon link']
        # headers = [cell.value for cell in sheet[2]]
        # if not all(col in headers for col in expected_columns):
        #     print(f"Error: Excel file must contain columns: {expected_columns}")
        #     print(f"Found columns: {headers}")
        #     return

        # Extract data rows (skip header row)
        data = []
        for row_idx, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
            try:
                row_data = {
                    'Indicator': row[headers.index('Indicator')] if row[headers.index('Indicator')] is not None else '',
                    'Definition': row[headers.index('Definition')] if row[headers.index('Definition')] is not None else '',
                    'Data': row[headers.index('Data')] if row[headers.index('Data')] is not None else '',
                    'Icon link': row[headers.index('Icon link')] if 'Icon link' in headers and row[headers.index('Icon link')] is not None else ''
                }
                # Handle data types (convert floats to int if whole numbers)
                if isinstance(row_data['Data'], float) and row_data['Data'].is_integer():
                    row_data['Data'] = int(row_data['Data'])
                data.append(row_data)
            except Exception as e:
                print(f"Error processing row {row_idx}: {str(e)}")
                continue

        # Define output JSON file path (same directory as input file)
        output_path = os.path.join(script_dir, "doc_homepage_data.json")

        # Write to JSON file
        with open(output_path, 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, indent=2, ensure_ascii=False)

        print(f"JSON file successfully created at: {output_path}")
        print(f"Extracted {len(data)} rows of data.")

    except FileNotFoundError:
        print(f"Error: File 'doc.xlsx' not found or inaccessible in directory: {script_dir}")
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    excel_to_json()
