import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models.usuario import db
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, origins=['http://localhost:5173', 'http://localhost:3000'])
jwt = JWTManager(app)
db.init_app(app)

from api.auth import auth_bp
from api.usuarios import usuarios_bp
from api.recursos import recursos_bp
from api.grupos import grupos_bp
from api.sincronizacion import sincronizacion_bp

app.register_blueprint(auth_bp)
app.register_blueprint(usuarios_bp)
app.register_blueprint(recursos_bp)
app.register_blueprint(grupos_bp)
app.register_blueprint(sincronizacion_bp)

with app.app_context():
    os.makedirs(os.path.join(os.path.dirname(__file__), 'data'), exist_ok=True)
    db.create_all()

    from models.usuario import Usuario
    import bcrypt

    admin_email = app.config['ADMIN_EMAIL']
    if not Usuario.query.filter_by(email=admin_email).first():
        pw_hash = bcrypt.hashpw('admin123'.encode(), bcrypt.gensalt())
        admin = Usuario(
            email=admin_email,
            nombre='Admin Master',
            password_hash=pw_hash.decode(),
            rol='ADMIN_MASTER',
            es_admin_master=True,
            activo=True,
        )
        db.session.add(admin)
        db.session.commit()
        print(f'✅ Admin Master creat: {admin_email} / admin123')

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'version': 'v0.3', 'message': 'API funcionant'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
