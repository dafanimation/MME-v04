from models.usuario import db
from datetime import datetime


class Grup(db.Model):
    __tablename__ = 'grups'

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(50), unique=True, nullable=False)
    descripcio = db.Column(db.String(200))
    color = db.Column(db.String(20), default='#667eea')
    actiu = db.Column(db.Boolean, default=True)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'nom': self.nom,
            'descripcio': self.descripcio,
            'color': self.color,
            'actiu': self.actiu,
        }
