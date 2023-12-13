from django.core.exceptions import ObjectDoesNotExist
from django.db import models


class WhatAlesYouManager(models.Manager):
    def get_or_none(self, **kwargs):
        try:
            return self.get(**kwargs)
        except ObjectDoesNotExist:
            return None
