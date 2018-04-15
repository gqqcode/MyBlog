#coding:utf-8

from datetime import datetime
import hashlib
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
# from markdown import markdown
# import bleach
from flask import current_app, request, url_for
from flask_login import UserMixin, AnonymousUserMixin
from . import db, login_manager



class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def reset_password(self, token, new_password):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return False
        if data.get('reset') != self.id:
            return False
        self.password = new_password
        db.session.add(self)
        return True
    def get_id(self):
        return self.id




@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))



# from flask.ext.login import login_user, logout_user
#
# #获取要登陆的用户对象
# user = User.query.filter_by(username = 'skkg').first()
#
# #第一个参数传入用户对象,第二个参数 传入 以后是否自动登陆
# login_user(user,True)
#
# #登出
# logout_user
# 复制代码
# (5)获取当前登陆的用户,
#
# from flask.ext.login import current_user
#
# #判断当前用户是否是匿名用户
# current_user.is_anonymous()
# 　　也可以在模版中使用　{% if current_user.is_authenticated() %} 判断
#
#  (6)在模版中使用,如果用户已认证就显示他的名字
#
# 1
# 2
# 3
# {% if current_user.is_authenticated() %}
#   Hi {{ current_user.name }}!
# {% endif %}
