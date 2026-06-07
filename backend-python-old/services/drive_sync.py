"""
Sincronització amb Google Drive.
Configura GOOGLE_DRIVE_CREDENTIALS i DRIVE_FOLDER_ID al .env per activar.
"""
import os


def sync_from_drive(folder_id: str = None) -> dict:
    credentials = os.environ.get('GOOGLE_DRIVE_CREDENTIALS')
    if not credentials:
        return {'ok': False, 'message': 'GOOGLE_DRIVE_CREDENTIALS no configurat'}

    # TODO: implementar amb google-api-python-client
    return {'ok': False, 'message': 'Pendent d\'implementar'}


def export_to_drive(data: list, folder_id: str = None) -> dict:
    credentials = os.environ.get('GOOGLE_DRIVE_CREDENTIALS')
    if not credentials:
        return {'ok': False, 'message': 'GOOGLE_DRIVE_CREDENTIALS no configurat'}

    return {'ok': False, 'message': 'Pendent d\'implementar'}
