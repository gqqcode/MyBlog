#coding:utf-8

# from flask import Flask, Blueprint, request, render_template, url_for, redirect
# from flask_login import (LoginManager, login_required, login_user,
#                              logout_user, UserMixin)
#
# app = Flask(__name__)
#
#
# class User(UserMixin):
#     def is_authenticated(self):
#         return True
#
#     def is_actice(self):
#         return True
#
#     def is_anonymous(self):
#         return False
#
#     def get_id(self):
#         return "1"
#
#
#
#
# app.secret_key = 's3cr3t'
# login_manager = LoginManager()
# login_manager.session_protection = 'strong'
# # login_manager.login_view = 'auth.login'
# login_manager.login_message=u"请登录"
# login_manager.init_app(app)
#
# @login_manager.user_loader
# def load_user(user_id):
#     user = User()
#     return user
#
#
# auth = Blueprint("auth", __name__)
#
#
# # login_manager.login_view = 'auth.login'和下面的是一样的，下面的更适合定制
# @login_manager.unauthorized_handler
# def unauthorized():
#     return render_template("auth/login.html")
#
#
# @auth.route("/login", methods=["GET", "POST"])
# def login():
#     if request.method == "GET":
#         return render_template("auth/login.html")
#     if request.method == "POST":
#         username = request.form.get("username")
#         password = request.form.get("password")
#
#         user = User()
#         login_user(user)
#         return redirect(url_for("home"))
#
# @auth.route("/logout", methods=["GET", "POST"])
# @login_required
# def logout():
#     logout_user()
#     return "logout page!"
#
# @app.route('/', methods=["GET", "POST"])
# @login_required
# def home():
#     return render_template("main/home.html")
#
#
#
# app.register_blueprint(auth, url_prefix="/auth")
#
# if __name__ == "__main__":
#     app.run(debug=True)



import os

from app import create_app, db
from app.models import User
from flask_script import Manager, Shell
from flask_migrate import Migrate, MigrateCommand


app = create_app(os.getenv('FLASK_CONFIG') or 'default')
manager = Manager(app)
migrate = Migrate(app, db)


def make_shell_context():
    return dict(app=app, db=db, User=User)

manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)

if __name__ == "__main__":
    manager.run()