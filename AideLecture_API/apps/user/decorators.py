from django.http import HttpResponseForbidden
from user.constants import UserGroup

###
# Tout le crédit de ce décorateur doit être porté au compte de M. Dmitry Naumenko.
# Source: https://dmitry-naumenko.medium.com/how-to-create-a-decorator-for-checking-groups-in-django-40a9df327c4b
# Date: 17/11/2022
###


def is_part_of_group(*groups: UserGroup):

    def decorator(function):
        def wrapper(request, *args, **kwargs):
            if request.user.groups.filter(
                name__in=[group.value for group in groups]
            ).exists():
                return function(request, *args, **kwargs)
            return HttpResponseForbidden()

        return wrapper

    return decorator
