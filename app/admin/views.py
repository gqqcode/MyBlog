#coding:utf-8

from flask import render_template, redirect, request, url_for, flash
from flask_login import login_user, logout_user, login_required, \
    current_user
from . import admin
from .. import db
from ..models import User



@admin.route("/admin", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("admin/article.html")
    # if request.method == "POST":
    #     username = request.form.get("username")
    #     password = request.form.get("password")
    #     remember = request.form.get("remember-me")
    #     if remember:
    #         remember = True
    #     else:
    #         remember = False
    #
    #     user = User.query.filter_by(username=username).first()
    #     if user and user.verify_password(password):
    #         login_user(user, remember=remember)#设置是否自动登录
    #         return redirect("/")
    #     else:
    #         return render_template("auth/login.html")

@admin.route('/admin/article')
def artical():
    return render_template('/admin/article.html')


@admin.route('/admin/content')
def content():
    return render_template('/admin/content.html')

@admin.route('/admin/category')
def category():
    return render_template('/admin/category.html')


@admin.route('/admin/notice')
def notice():
    return render_template('/admin/notice.html')

@admin.route('/admin/carousel')
def carousel():
    return render_template('/admin/carousel.html')

@admin.route('/admin/user')
def user():
    return render_template('/admin/user.html')

@admin.route('/admin/mdeditor')
def mdeditor():
    return render_template('/admin/mdeditor.html')