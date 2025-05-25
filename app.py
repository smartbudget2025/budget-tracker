from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from datetime import datetime
import os
import stripe
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///budget.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'your-stripe-secret-key')

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    is_premium = db.Column(db.Boolean, default=False)
    transactions = db.relationship('Transaction', backref='user', lazy=True)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    type = db.Column(db.String(10), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    user = User(email=data['email'], password=data['password'])
    db.session.add(user)
    db.session.commit()
    login_user(user)
    return jsonify({'message': 'Registration successful'})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and user.password == data['password']:  # In production, use proper password hashing
        login_user(user)
        return jsonify({'message': 'Login successful'})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})

@app.route('/premium/subscribe', methods=['POST'])
@login_required
def subscribe():
    try:
        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': os.getenv('STRIPE_PRICE_ID', 'your-price-id'),
                'quantity': 1,
            }],
            mode='subscription',
            success_url=request.host_url + 'premium/success',
            cancel_url=request.host_url + 'premium/cancel',
        )
        return jsonify({'sessionId': checkout_session.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/premium/success')
@login_required
def premium_success():
    current_user.is_premium = True
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/')
def index():
    if current_user.is_authenticated:
        return render_template('index.html', user=current_user)
    return render_template('login.html')

@app.route('/api/transactions', methods=['GET'])
@login_required
def get_transactions():
    transactions = Transaction.query.filter_by(user_id=current_user.id).order_by(Transaction.date.desc()).all()
    return jsonify([{
        'id': t.id,
        'amount': t.amount,
        'category': t.category,
        'description': t.description,
        'date': t.date.strftime('%Y-%m-%d %H:%M:%S'),
        'type': t.type
    } for t in transactions])

@app.route('/api/transactions', methods=['POST'])
@login_required
def add_transaction():
    data = request.json
    transaction = Transaction(
        amount=data['amount'],
        category=data['category'],
        description=data.get('description', ''),
        type=data['type'],
        user_id=current_user.id
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction added successfully'})

@app.route('/api/summary', methods=['GET'])
@login_required
def get_summary():
    income = db.session.query(db.func.sum(Transaction.amount)).\
        filter(Transaction.type == 'income', Transaction.user_id == current_user.id).scalar() or 0
    expenses = db.session.query(db.func.sum(Transaction.amount)).\
        filter(Transaction.type == 'expense', Transaction.user_id == current_user.id).scalar() or 0
    
    # Premium features
    if current_user.is_premium:
        categories = db.session.query(
            Transaction.category,
            db.func.sum(Transaction.amount)
        ).filter_by(
            user_id=current_user.id,
            type='expense'
        ).group_by(Transaction.category).all()
        
        return jsonify({
            'income': income,
            'expenses': expenses,
            'balance': income - expenses,
            'premium_features': {
                'category_breakdown': dict(categories),
                'savings_rate': ((income - expenses) / income * 100) if income > 0 else 0,
            }
        })
    
    return jsonify({
        'income': income,
        'expenses': expenses,
        'balance': income - expenses
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True) 