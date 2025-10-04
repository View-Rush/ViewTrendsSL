# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from openapi_server.models.inline_object import InlineObject
from openapi_server.models.inline_object1 import InlineObject1
from openapi_server.models.notification_settings import NotificationSettings
from openapi_server.models.users_me_get200_response import UsersMeGet200Response
from openapi_server.models.users_me_notifications_settings_get200_response import UsersMeNotificationsSettingsGet200Response
from openapi_server.models.users_me_password_put200_response import UsersMePasswordPut200Response
from openapi_server.models.users_me_password_put_request import UsersMePasswordPutRequest
from openapi_server.models.users_me_patch_request import UsersMePatchRequest
from openapi_server.models.users_me_stats_get200_response import UsersMeStatsGet200Response
from openapi_server.security_api import get_token_BearerAuth

class BaseUsersApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseUsersApi.subclasses = BaseUsersApi.subclasses + (cls,)
    async def users_me_get(
        self,
    ) -> UsersMeGet200Response:
        """Retrieve authenticated user&#39;s profile information"""
        ...


    async def users_me_notifications_settings_get(
        self,
    ) -> UsersMeNotificationsSettingsGet200Response:
        """Retrieve user&#39;s notification preferences"""
        ...


    async def users_me_notifications_settings_put(
        self,
        notification_settings: NotificationSettings,
    ) -> UsersMeNotificationsSettingsGet200Response:
        """Update user&#39;s notification preferences"""
        ...


    async def users_me_password_put(
        self,
        users_me_password_put_request: UsersMePasswordPutRequest,
    ) -> UsersMePasswordPut200Response:
        """Change authenticated user&#39;s password"""
        ...


    async def users_me_patch(
        self,
        users_me_patch_request: UsersMePatchRequest,
    ) -> UsersMeGet200Response:
        """Update authenticated user&#39;s profile information"""
        ...


    async def users_me_stats_get(
        self,
    ) -> UsersMeStatsGet200Response:
        """Retrieve user&#39;s overall statistics and metrics"""
        ...
