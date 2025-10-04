# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr, field_validator
from typing import Optional
from typing_extensions import Annotated
from openapi_server.models.history_recent_get200_response import HistoryRecentGet200Response
from openapi_server.security_api import get_token_BearerAuth

class BaseHistoryApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseHistoryApi.subclasses = BaseHistoryApi.subclasses + (cls,)
    async def history_best_predictions_get(
        self,
        limit: Optional[Annotated[int, Field(le=20, strict=True, ge=1)]],
        period: Optional[StrictStr],
    ) -> HistoryRecentGet200Response:
        """Retrieve predictions with highest accuracy"""
        ...


    async def history_recent_get(
        self,
        limit: Optional[Annotated[int, Field(le=20, strict=True, ge=1)]],
    ) -> HistoryRecentGet200Response:
        """Retrieve most recent predictions for quick access"""
        ...
