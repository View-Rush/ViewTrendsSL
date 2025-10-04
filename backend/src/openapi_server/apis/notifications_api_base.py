# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr, field_validator
from typing import Optional
from typing_extensions import Annotated
from openapi_server.models.notifications_get200_response import NotificationsGet200Response
from openapi_server.models.notifications_mark_all_read_patch200_response import NotificationsMarkAllReadPatch200Response
from openapi_server.models.predictions_drafts_id_delete200_response import PredictionsDraftsIdDelete200Response
from openapi_server.security_api import get_token_BearerAuth

class BaseNotificationsApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseNotificationsApi.subclasses = BaseNotificationsApi.subclasses + (cls,)
    async def notifications_get(
        self,
        page: Optional[Annotated[int, Field(strict=True, ge=1)]],
        limit: Optional[Annotated[int, Field(le=50, strict=True, ge=1)]],
        status: Optional[StrictStr],
        type: Optional[StrictStr],
    ) -> NotificationsGet200Response:
        """Retrieve user&#39;s notifications"""
        ...


    async def notifications_id_delete(
        self,
        id: StrictStr,
    ) -> PredictionsDraftsIdDelete200Response:
        """Delete a specific notification"""
        ...


    async def notifications_id_mark_read_patch(
        self,
        id: StrictStr,
    ) -> PredictionsDraftsIdDelete200Response:
        """Mark a specific notification as read"""
        ...


    async def notifications_mark_all_read_patch(
        self,
    ) -> NotificationsMarkAllReadPatch200Response:
        """Mark all user&#39;s notifications as read"""
        ...
