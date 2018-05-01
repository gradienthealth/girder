import cherrypy
import logging
from girder import auditLogger
from girder.models.model_base import Model
from girder.api.rest import getCurrentUser


class Record(Model):
    def initialize(self):
        self.name = 'audit_log_record'

    def validate(self, doc):
        return doc


class AuditLogHandler(logging.Handler):
    def handle(self, record):
        user = getCurrentUser()
        Record().save({
            'type': record.msg,
            'details': record.details,
            'ip': cherrypy.request.remote.ip,
            'userId': user and user['_id']
        })


def load(info):
    auditLogger.addHandler(AuditLogHandler())
