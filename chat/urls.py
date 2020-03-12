from django.urls import re_path

from . import views

urlpatterns = [
    re_path(r'^$', views.index, name='index'),
    re_path(r'^chat/$', views.chat_index, name='chat_index'),
    # url used to process the xmlhttprequests done by nodejs socket.io
    re_path(r'^save_message/$', views.save_message, name='chat_save_message'),
]