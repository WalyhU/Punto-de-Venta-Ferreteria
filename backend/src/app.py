import os
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
# encrypt password
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/sistema_ferreteria'
mongo = PyMongo(app)

CORS(app, resources={r"/*": {"origins": "*"}})

db = mongo.db

# Subir imagenes
app.config['UPLOAD_FOLDER'] = 'src\\static\\uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

# JWT
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET')
jwt = JWTManager(app)

# Proveer imagenes

# ======== INICIO DE SESION ========

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.


@app.route('/login', methods=['POST'])
def createToken():
    # Check password hash
    email = request.json['email']
    contra = request.json['password']
    # Verify if the email exits in the database
    user = db.users.find_one({'email': email})
    # print ObjectId(id)
    state = user['state']
    if state == 'Inactive':
        return jsonify({"msg": "El usuario está inactivo",
                        "email": email,
                        "password": contra}), 401

    if user is None:
        return jsonify({"msg": "User don't exists",
                        "email": email,
                        "password": contra}), 401
    # Verify if the password is correct
    if not check_password_hash(user['password'], contra):
        return jsonify({"msg": "Bad password",
                        "email": email,
                        "password": contra}), 401
    # Identity can be any data that is json serializable
    access_token = create_access_token(identity=email, expires_delta=False)
    return jsonify(access_token=access_token), 200


@app.route('/session', methods=['POST'])
@jwt_required()
def createSession():
    email = get_jwt_identity()
    user = db.users.find_one({'email': email})
    return jsonify({
        '_id': str(ObjectId(user['_id'])),
        'name': user['name'],
        'email': user['email'],
        'password': user['password'],
        'rol': user['rol'],
    })
# ==========================

# ======== USUARIOS ========


@app.route('/users', methods=['POST'])
@jwt_required()
def createUser():
    id = db.users.insert_one({
        'name': request.json['name'],
        'email': request.json['email'],
        'password': generate_password_hash(request.json['password']),
        'rol': request.json['rol'],
    })
    return jsonify(str(ObjectId(id.inserted_id)))


@app.route('/users', methods=['GET'])
@jwt_required()
def getUsers():
    users = []
    for doc in db.users.find():
        users.append({
            '_id': str(ObjectId(doc['_id'])),
            'name': doc['name'],
            'email': doc['email'],
            'password': doc['password'],
            'rol': doc['rol'],
        })
    return jsonify(users)


@app.route('/user/<id>', methods=['GET'])
@jwt_required()
def getUser(id):
    user = db.users.find_one({'_id': ObjectId(id)})
    print(user)
    return jsonify({
        '_id': str(ObjectId(user['_id'])),
        'name': user['name'],
        'email': user['email'],
        'password': user['password'],
        'rol': user['rol'],
    })


@app.route('/users/<id>', methods=['DELETE'])
@jwt_required()
def deleteUser(id):
    db.users.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'User Deleted'})


@app.route('/users/<id>', methods=['PUT'])
@jwt_required()
def updateUser(id):
    db.users.update_one({'_id': ObjectId(id)}, {'$set': {
        'name': request.json['name'],
        'email': request.json['email'],
        'rol': request.json['rol'],
    }})
    return jsonify({'msg': 'User Updated'})
# ==========================

# ======== PRODUCTOS ========


@app.route('/products', methods=['POST'])
@jwt_required()
def createProducts():
    f = request.files['image']
    filename = secure_filename(f.filename)
    f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    id = db.products.insert_one({
        'code': request.form['code'],
        'name': request.form['name'],
        'brand': request.form['brand'],
        'price': request.form['price'],
        'category': request.form['category'],
        'stock': request.form['stock'],
        'description': request.form['description'],
        'image': filename,
    })
    return jsonify(str(ObjectId(id.inserted_id)))


@app.route('/products', methods=['GET'])
@jwt_required()
def getProducts():
    products = []
    for doc in db.products.find():
        products.append({
            '_id': str(ObjectId(doc['_id'])),
            'code': doc['code'],
            'name': doc['name'],
            'brand': doc['brand'],
            'price': doc['price'],
            'category': doc['category'],
            'stock': doc['stock'],
            'description': doc['description'],
            'image': doc['image'],
        })
    return jsonify(products)


@app.route('/product/<id>', methods=['GET'])
@jwt_required()
def getProduct(id):
    product = db.products.find_one({'_id': ObjectId(id)})
    return jsonify({
        '_id': str(ObjectId(product['_id'])),
        'code': product['code'],
        'name': product['name'],
        'brand': product['brand'],
        'price': product['price'],
        'category': product['category'],
        'stock': product['stock'],
        'description': product['description'],
        'image': product['image'],
    })


@app.route('/codeProduct/<code>', methods=['GET'])
@jwt_required()
def getProductCode(code):
    product = db.products.find_one({'code': code})
    return jsonify({
        '_id': str(ObjectId(product['_id'])),
        'code': product['code'],
        'name': product['name'],
        'brand': product['brand'],
        'price': product['price'],
        'category': product['category'],
        'stock': product['stock'],
        'description': product['description'],
        'image': product['image'],
    })


@app.route('/products/<id>', methods=['PUT'])
@jwt_required()
def updateProduct(id):
    if request.files:
        f = request.files['image']
        filename = secure_filename(f.filename)
        f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        db.products.update_one({'_id': ObjectId(id)}, {'$set': {
            'code': request.form['code'],
            'name': request.form['name'],
            'brand': request.form['brand'],
            'price': request.form['price'],
            'category': request.form['category'],
            'stock': request.form['stock'],
            'description': request.form['description'],
            'image': filename,
        }})
    else:
        db.products.update_one({'_id': ObjectId(id)}, {'$set': {
            'code': request.form['code'],
            'name': request.form['name'],
            'brand': request.form['brand'],
            'price': request.form['price'],
            'category': request.form['category'],
            'stock': request.form['stock'],
            'description': request.form['description'],
        }})
    return jsonify({'msg': 'Product Updated'})

@app.route('/stock/<id>', methods=['PUT'])
@jwt_required()
def updateStock(id):
    db.products.update_one({'_id': ObjectId(id)}, {'$set': {
        'stock': request.json['stock'],
    }})
    return jsonify({'msg': 'Stock Updated'})

@app.route('/products/<id>', methods=['DELETE'])
@jwt_required()
def deleteProduct(id):
    db.products.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'Product Deleted'})

# ==========================

# ======== CLIENTES ========


@app.route('/clients', methods=['POST'])
@jwt_required()
def createClients():
    id = db.clients.insert_one({
        'nit': request.form['nit'],
        'dpi': request.form['dpi'],
        'name': request.form['name'],
        'tel': request.form['tel'],
        'mail': request.form['mail'],
        'direction': request.form['direction'],
        'discount': request.form['discount'],
        'state': request.form['state'],
    })
    return jsonify(str(ObjectId(id.inserted_id)))

@app.route('/clients', methods=['GET'])
@jwt_required()
def getClients():
    clients = []
    for doc in db.clients.find():
        clients.append({
            '_id': str(ObjectId(doc['_id'])),
            'nit': doc['nit'],
            'dpi': doc['dpi'],
            'name': doc['name'],
            'tel': doc['tel'],
            'mail': doc['mail'],
            'direction': doc['direction'],
            'discount': doc['discount'],
            'state': doc['state'],
        })
    return jsonify(clients)

@app.route('/client/<id>', methods=['GET'])
@jwt_required()
def getClient(id):
    client = db.clients.find_one({'_id': ObjectId(id)})
    return jsonify({
        '_id': str(ObjectId(client['_id'])),
        'nit': client['nit'],
        'dpi': client['dpi'],
        'name': client['name'],
        'tel': client['tel'],
        'mail': client['mail'],
        'direction': client['direction'],
        'discount': client['discount'],
        'state': client['state'],
    })

@app.route('/nitClient/<nit>', methods=['GET'])
@jwt_required()
def getClientNit(nit):
    client = db.clients.find_one({'nit': nit})
    return jsonify({
        '_id': str(ObjectId(client['_id'])),
        'nit': client['nit'],
        'dpi': client['dpi'],
        'name': client['name'],
        'tel': client['tel'],
        'mail': client['mail'],
        'direction': client['direction'],
        'discount': client['discount'],
        'state': client['state'],
    })

@app.route('/clients/<id>', methods=['PUT'])
@jwt_required()
def updateClient(id):
    db.clients.update_one({'_id': ObjectId(id)}, {'$set': {
        'nit': request.form['nit'],
        'dpi': request.form['dpi'],
        'name': request.form['name'],
        'tel': request.form['tel'],
        'mail': request.form['mail'],
        'direction': request.form['direction'],
        'discount': request.form['discount'],
        'state': request.form['state'],
    }})
    return jsonify({'msg': 'Client Updated'})

@app.route('/clients/<id>', methods=['DELETE'])
@jwt_required()
def deleteClient(id):
    db.clients.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'Client Deleted'})

# ==========================

# ======== VENTAS ========
@app.route('/sales', methods=['POST'])
@jwt_required()
def createSales():
    id = db.sales.insert_one({
        'date': request.json['date'],
        'client': request.json['client'],
        'products': request.json['products'],
        'total': request.json['total'],
    })
    return jsonify(str(ObjectId(id.inserted_id)))

@app.route('/sales', methods=['GET'])
@jwt_required()
def getSales():
    sales = []
    for doc in db.sales.find():
        sales.append({
            '_id': str(ObjectId(doc['_id'])),
            'date': doc['date'],
            'products': doc['products'],
            'quantity': doc['quantity'],
            'totalPrice': doc['totalPrice'],
            'total': doc['total'],
            'client': doc['client'],
        })
    return jsonify(sales)

@app.route('/sales/<id>', methods=['GET'])
@jwt_required()
def getSale(id):
    sale = db.sales.find_one({'_id': ObjectId(id)})
    return jsonify({
        '_id': str(ObjectId(sale['_id'])),
        'date': sale['date'],
        'products': sale['products'],
        'quantity': sale['quantity'],
        'totalPrice': sale['totalPrice'],
        'total': sale['total'],
        'client': sale['client'],
    })

""" @app.route('/sales/<id>', methods=['PUT'])
@jwt_required()
def updateSale(id):
    db.sales.update_one({'_id': ObjectId(id)}, {'$set': {
        'date': request.form['date'],
        'products': request.form['products'],
        'quantity': request.form['quantity'],
        'totalPrice': request.form['totalPrice'],
        'total': request.form['total'],
        'client': request.form['client'],
    }})
    return jsonify({'msg': 'Sale Updated'})

@app.route('/sales/<id>', methods=['DELETE'])
@jwt_required()
def deleteSale(id):
    db.sales.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'Sale Deleted'}) """

# ==========================

if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')
