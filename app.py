from datetime import datetime, timezone
from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_mailman import Mail, EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()


app = Flask(__name__, static_folder='static', static_url_path='/static')

# Database Configuration
basedir = os.path.abspath(os.path.dirname(__file__))
database_url = os.environ.get('DATABASE_URL')

if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

if os.environ.get('VERCEL'):
    # Force /tmp path for SQLite on Vercel to ensure it's writable
    if not database_url or 'sqlite' in database_url:
        db_path = '/tmp/eunoia.db'
        app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Local development
    if not database_url:
        db_path = os.path.join(basedir, 'eunoia.db')
        app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.abspath(db_path)}"
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Mail Configuration
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', os.environ.get('MAIL_USERNAME'))

mail = Mail(app)



class ContactMessage(db.Model):
    """Model for storing contact form submissions."""
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    course = db.Column(db.String(100))
    message = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<ContactMessage {self.email}>'

# Robust Database Initialization for Serverless
@app.before_request
def ensure_db_initialized():
    """Ensure database tables exist before any request is processed."""
    # We use a simple attribute on the app object to track if we've attempted init 
    # in this specific worker/container lifecycle.
    if not getattr(app, '_database_initialized', False):
        with app.app_context():
            try:
                db.create_all()
                app._database_initialized = True
            except Exception as e:
                # Log to Vercel/System logs
                print(f"CRITICAL: Database initialization failure: {e}")

# Course data
COURSES = {
    'cybersecurity': {
        'title': 'Cybersecurity Mastery',
        'description': 'Master the art of digital defense. From ethical hacking to advanced threat analysis.',
        'duration': '12 Weeks',
        'level': 'Beginner to Advanced',
        'price': 'Rs. 15000',
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
        'price': 'Rs. 15000',
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
        'price': 'Rs. 15000',
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
        
        # Send Email
        try:
            admin_email = os.environ.get('ADMIN_EMAIL', 'eunoiacyberandaitechnologies@gmail.com')
            msg = EmailMessage(
                subject=f"New Contact Form Submission: {data.get('course', 'General Inquiry')}",
                body=f"""
                New message from EUNOIA website:
                
                Name: {data.get('first_name')} {data.get('last_name')}
                Email: {data.get('email')}
                Course: {data.get('course', 'N/A')}
                
                Message:
                {data.get('message')}
                
                Sent at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                """,
                from_email=admin_email,
                to=[admin_email]
            )
            msg.send()
            
            # 2. Automated Auto-Reply to Student - with all course prices
            student_msg = EmailMessage(
                subject="Welcome to EUNOIA! Course Information & Pricing",
                body=f"""
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #050508; color: #ffffff; padding: 40px; border-radius: 20px; border: 1px solid #00d4ff;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #00d4ff; margin: 0; font-family: 'Orbitron', sans-serif; letter-spacing: 4px;">EUNOIA</h1>
                        <p style="color: #8338ec; font-size: 14px;">CYBER & AI TECHNOLOGIES</p>
                    </div>
                    
                    <h2 style="color: #ffffff;">Namaste, {data.get('first_name')}!</h2>
                    
                    <p style="line-height: 1.6; color: #cbd5e1;">
                        Thank you for your interest in <strong>EUNOIA Technologies</strong>. We are thrilled to help you start your journey into the world of advanced technology!
                    </p>
                    
                    <p style="line-height: 1.6; color: #cbd5e1;">
                        Please find below our complete course offerings with pricing:
                    </p>
                    
                    <div style="background: rgba(0, 212, 255, 0.1); padding: 20px; border-radius: 12px; border-left: 4px solid #00d4ff; margin: 20px 0;">
                        <h3 style="color: #00d4ff; margin-top: 0;">🛡️ Cybersecurity Mastery</h3>
                        <p style="margin: 5px 0; color: #ffffff;"><strong>Duration:</strong> 12 Weeks</p>
                        <p style="margin: 5px 0; color: #ffffff;"><strong>Level:</strong> Beginner to Advanced</p>
                        <p style="margin: 5px 0; color: #ffffff;"><strong>Price:</strong> <span style="font-size: 1.25rem; color: #ff006e; font-weight: bold;">Rs. 45,000</span></p>
                    </div>
                    
                    <div style="background: rgba(255, 0, 110, 0.1); padding: 20px; border-radius: 12px; border-left: 4px solid #ff006e; margin: 20px 0;">
                        <h3 style="color: #ff006e; margin-top: 0;">🤖 AI & Machine Learning</h3>
                        <p style="margin: 5px 0; color: #ffffff;"><strong>Duration:</strong> 16 Weeks</p>
                        <p style="margin: 5px 0; color: #ffffff;"><strong>Level:</strong> Intermediate to Advanced</p>
                        <p style="margin: 5px 0; color: #ffffff;"><strong>Price:</strong> <span style="font-size: 1.25rem; color: #ff006e; font-weight: bold;">Rs. 55,000</span></p>
                    </div>
                    
                    <div style="background: rgba(131, 56, 236, 0.1); padding: 20px; border-radius: 12px; border-left: 4px solid #8338ec; margin: 20px 0;">
                        <h3 style="color: #8338ec; margin-top: 0;">📊 Advanced Data Science</h3>
                        <p style="margin: 5px 0; color: #ffffff;"><strong>Duration:</strong> 14 Weeks</p>
                        <p style="margin: 5px 0; color: #ffffff;"><strong>Level:</strong> Intermediate</p>
                        <p style="margin: 5px 0; color: #ffffff;"><strong>Price:</strong> <span style="font-size: 1.25rem; color: #ff006e; font-weight: bold;">Rs. 50,000</span></p>
                    </div>
                    
                    <p style="line-height: 1.6; color: #cbd5e1;">
                        Your message has been received, and our academic counselor will reach out to you within 24 hours to discuss the syllabus, career opportunities, and enrollment process.
                    </p>
                    
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="color: #64748b; font-size: 14px;">
                            Kathmandu, Nepal<br>
                            Phone: +977 9713086178<br>
                            <a href="https://wa.me/9779713086178" style="color: #00d4ff; text-decoration: none;">WhatsApp Us</a>
                        </p>
                    </div>
                </div>
                """,
                from_email=admin_email,
                to=[data.get('email')]
            )
            student_msg.content_subtype = "html"
            student_msg.send()
            
        except Exception as mail_error:

            print(f"Failed to send email: {mail_error}")
            # We don't return an error to the user if the DB save succeeded 
            # but mail failed, but we log it.
        
        return jsonify({
            'status': 'success', 
            'message': 'Message received! We will contact you soon.'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
