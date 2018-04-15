#coding:utf-8

from flask import render_template, redirect, request, url_for, flash
from flask_login import login_user, logout_user, login_required, \
    current_user
from . import auth
from .. import db
from ..models import User



@auth.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("auth/login.html")
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        remember = request.form.get("remember-me")
        if remember:
            remember = True
        else:
            remember = False

        user = User.query.filter_by(username=username).first()
        if user and user.verify_password(password):
            login_user(user, remember=remember)#设置是否自动登录
            return redirect("/")
        else:
            return render_template("auth/login.html")


@auth.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    logout_user()
    return redirect("/auth/login")


@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == "GET":
        return render_template("auth/register.html")

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        user = User(username = username,password = password)
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('auth.login'))


    # form = RegistrationForm()
    # if form.validate_on_submit():
    #     user = User(email=form.email.data,
    #                 username=form.username.data,
    #                 password=form.password.data)
    #     db.session.add(user)
    #     db.session.commit()
    #     token = user.generate_confirmation_token()
    #     send_email(user.email, 'Confirm Your Account',
    #                'auth/email/confirm', user=user, token=token)
    #     flash('A confirmation email has been sent to you by email.')
    #     return redirect(url_for('auth.login'))
    # return render_template('auth/register.html', form=form)


