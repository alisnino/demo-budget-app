from . import health_bp

@health_bp.route('/', methods=['GET'])
def health_check():
    return {'message': "OK"}, 200
