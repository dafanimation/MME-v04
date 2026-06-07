// components/QREscanner.jsx
import QrScanner from 'react-qr-scanner';

const LectorQR = ({ onRecursoEncontrado }) => {
    const handleScan = async (data) => {
        if (data) {
            // El QR contiene ID del recurso o URL del Drive
            const recurso = await buscarRecursoPorQR(data.text);
            if (recurso) {
                onRecursoEncontrado(recurso);
                // Abrir ficha automáticamente
                abrirFichaRecurso(recurso);
            }
        }
    };
    
    return <QrScanner onScan={handleScan} />;
};