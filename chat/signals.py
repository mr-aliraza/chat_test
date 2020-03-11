from django.db.models.signals import post_save
from django.dispatch import receiver
import requests


from celery import shared_task
from chat.models import Message, Notification


@receiver(post_save, sender=Message, dispatch_uid='notification_message_post_save')
def notification_message_post_save(sender, instance=None, created=None, **kwargs):
    if not created:
        return

    create_message_notifications.delay(instance.id)

@shared_task(ignore_result=True)
def create_message_notifications(message_id):
    try:
        message = Message.objects.get(id=message_id)
    except Message.DoesNotExist:
        message = None
    if not message:
        return

    notification = Notification.objects.create(message=message)
    requests.get('http://localhost:3000/new/{}'.format(notification.user))