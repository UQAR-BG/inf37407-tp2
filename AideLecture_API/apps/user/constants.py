from enum import Enum

###
# Tout le crédit de cette énumération doit être porté au compte de M. Dmitry Naumenko.
# Source: https://dmitry-naumenko.medium.com/how-to-create-a-decorator-for-checking-groups-in-django-40a9df327c4b
# Date: 17/11/2022
###


class UserGroup(Enum):
    admin = "react-app-administrators"
    participant = "react-app-participants"
