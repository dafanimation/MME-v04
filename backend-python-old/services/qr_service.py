import uuid


def generate_qr_code() -> str:
    """Generate a unique QR code identifier for a resource."""
    return str(uuid.uuid4())


def get_qr_url(qr_code: str, base_url: str = 'http://localhost:5173') -> str:
    """Get the scan URL for a QR code."""
    return f'{base_url}/recursos/qr/{qr_code}'
