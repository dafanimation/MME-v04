from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Usuario(db.Model):
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    rol = db.Column(db.String(50), default='INVITADO')
    es_admin_master = db.Column(db.Boolean, default=False)
    grup = db.Column(db.String(50))
    puntos = db.Column(db.Integer, default=0)
    tokens = db.Column(db.Integer, default=0)
    activo = db.Column(db.Boolean, default=True)
    ultimo_acceso = db.Column(db.DateTime, default=datetime.utcnow)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'nombre': self.nombre,
            'rol': self.rol,
            'grup': self.grup,
            'es_admin_master': self.es_admin_master,
            'puntos': self.puntos,
            'tokens': self.tokens,
            'activo': self.activo,
            'ultimo_acceso': self.ultimo_acceso.isoformat() if self.ultimo_acceso else None,
            'creado_en': self.creado_en.isoformat() if self.creado_en else None,
        }


class Recurso(db.Model):
    __tablename__ = 'recursos'

    id = db.Column(db.Integer, primary_key=True)
    codi = db.Column(db.String(50), unique=True)
    nom = db.Column(db.String(100), nullable=False)
    descripcio = db.Column(db.Text)
    tipus = db.Column(db.String(50), default='PC')
    ubicacio = db.Column(db.String(200))
    qr_code = db.Column(db.String(200), unique=True)
    estat = db.Column(db.String(50), default='disponible')
    ram = db.Column(db.String(50))
    cpu = db.Column(db.String(100))
    sistema_op = db.Column(db.String(100))
    emmagatzemament = db.Column(db.String(50))
    imatge_url = db.Column(db.String(500))
    model_3d_url = db.Column(db.String(500))
    coordenades_x = db.Column(db.Float, default=0.0)
    coordenades_y = db.Column(db.Float, default=0.0)
    coordenades_z = db.Column(db.Float, default=0.0)
    usuari_assignat = db.Column(db.String(120))
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'codi': self.codi,
            'nom': self.nom,
            'descripcio': self.descripcio,
            'tipus': self.tipus,
            'ubicacio': self.ubicacio,
            'qr_code': self.qr_code,
            'estat': self.estat,
            'ram': self.ram,
            'cpu': self.cpu,
            'sistema_op': self.sistema_op,
            'emmagatzemament': self.emmagatzemament,
            'imatge_url': self.imatge_url,
            'model_3d_url': self.model_3d_url,
            'coordenades': {'x': self.coordenades_x, 'y': self.coordenades_y, 'z': self.coordenades_z},
            'usuari_assignat': self.usuari_assignat,
            'creado_en': self.creado_en.isoformat() if self.creado_en else None,
        }
