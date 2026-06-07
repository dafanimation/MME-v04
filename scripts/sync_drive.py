"""
Sync script — imports resources from a Google Sheet into the local database.
Requires: GOOGLE_DRIVE_CREDENTIALS and DRIVE_FOLDER_ID set in .env
"""
import os
import sys
import json

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))


def sync_drive():
    credentials_path = os.environ.get('GOOGLE_DRIVE_CREDENTIALS')
    folder_id = os.environ.get('DRIVE_FOLDER_ID')

    if not credentials_path or not folder_id:
        print('⚠️  GOOGLE_DRIVE_CREDENTIALS o DRIVE_FOLDER_ID no configurats al .env')
        return

    # TODO: implement google-api-python-client sync
    print('🔄 Sincronització Google Drive no implementada encara.')
    print(f'   Credentials: {credentials_path}')
    print(f'   Folder ID:   {folder_id}')


if __name__ == '__main__':
    sync_drive()
