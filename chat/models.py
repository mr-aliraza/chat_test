from django.contrib.auth.models import User
from django.db import models

class Message(models.Model):
    user_name = models.CharField(max_length=20)
    message = models.CharField(max_length=140)

# class Notification(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     message = models.ForeignKey(Message, on_delete=models.CASCADE)
