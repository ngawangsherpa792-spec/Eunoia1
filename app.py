from datetime import datetime
from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Database Configuration
basedir = os.path.abspath(os.path.dirname(__file__))

# Vercel handles the file system as read-only, except for /tmp
if os.environ.get('VERCEL'):
    db_path = os.path.join('/tmp', 'eunoia.db')
else:
    db_path = os.path.join(basedir, 'eunoia.db')

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or \
    'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Ensure tables are created
try:
    with app.app_context():
        db.create_all()
except Exception as e:
    print(f"Database initialization error: {e}")

class ContactMessage(db.Model):
    """Model for storing contact form submissions."""
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    course = db.Column(db.String(100))
    message = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<ContactMessage {self.email}>'

# Course data
COURSES = {
    'cybersecurity': {
        'title': 'Cybersecurity Mastery',
        'description': 'Master the art of digital defense. From ethical hacking to advanced threat analysis.',
        'duration': '12 Weeks',
        'level': 'Beginner to Advanced',
        'icon': 'shield',
        'color': '#00d4ff',
        'modules': [
            'Network Security Fundamentals',
            'Ethical Hacking & Penetration Testing',
            'Malware Analysis & Reverse Engineering',
            'Cloud Security Architecture',
            'Incident Response & Forensics'
        ]
    },
    'ai-ml': {
        'title': 'AI & Machine Learning',
        'description': 'Build intelligent systems. From neural networks to deep learning applications.',
        'duration': '16 Weeks',
        'level': 'Intermediate to Advanced',
        'icon': 'brain',
        'color': '#ff006e',
        'modules': [
            'Python for Data Science',
            'Supervised & Unsupervised Learning',
            'Deep Learning with TensorFlow',
            'Natural Language Processing',
            'Computer Vision & AI Deployment'
        ]
    },
    'data-science': {
        'title': 'Advanced Data Science',
        'description': 'Transform raw data into actionable insights using cutting-edge analytics.',
        'duration': '14 Weeks',
        'level': 'Intermediate',
        'icon': 'database',
        'color': '#8338ec',
        'modules': [
            'Statistical Analysis',
            'Big Data Technologies',
            'Data Visualization',
            'Predictive Modeling',
            'Real-time Analytics'
        ]
    }
}

@app.route('/')
def index():
    return render_template('index.html', 
                         courses=COURSES, 
                         url=request.url,
                         year=datetime.now().year)

@app.route('/robots.txt')
def robots():
    return render_template('robots.txt')

@app.route('/sitemap.xml')
def sitemap():
    return render_template('sitemap.xml', now=datetime.now().strftime('%Y-%m-%d'))

@app.route('/api/courses')
def get_courses():
    return jsonify(COURSES)

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        
        # Validation
        if not data.get('email') or not data.get('first_name'):
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

        # Save to Database
        new_message = ContactMessage(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            email=data.get('email'),
            course=data.get('course'),
            message=data.get('message')
        )
        
        db.session.add(new_message)
        db.session.commit()
        
        return jsonify({
            'status': 'success', 
            'message': 'Message received! We will contact you soon.'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
