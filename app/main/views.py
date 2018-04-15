#coding:utf-8

from flask import render_template, redirect, request, url_for, flash
from flask_login import login_user, logout_user, login_required, \
    current_user
from . import main
from .. import db
from ..models import User

@main.route('/', methods=["GET", "POST"])
def home():
    return render_template("main/index.html")