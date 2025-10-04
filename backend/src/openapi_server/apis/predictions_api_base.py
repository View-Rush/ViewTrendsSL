# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from datetime import date

from fastapi.openapi.models import Response
from pydantic import Field, StrictBytes, StrictStr, field_validator
from typing import Optional, Tuple, Union
from typing_extensions import Annotated
from openapi_server.models.categories_get200_response import CategoriesGet200Response
from openapi_server.models.inline_object import InlineObject
from openapi_server.models.inline_object3 import InlineObject3
from openapi_server.models.inline_object5 import InlineObject5
from openapi_server.models.languages_get200_response import LanguagesGet200Response
from openapi_server.models.prediction_request import PredictionRequest
from openapi_server.models.predictions_bulk_delete_delete200_response import PredictionsBulkDeleteDelete200Response
from openapi_server.models.predictions_bulk_delete_delete_request import PredictionsBulkDeleteDeleteRequest
from openapi_server.models.predictions_drafts_get200_response import PredictionsDraftsGet200Response
from openapi_server.models.predictions_drafts_id_delete200_response import PredictionsDraftsIdDelete200Response
from openapi_server.models.predictions_drafts_post201_response import PredictionsDraftsPost201Response
from openapi_server.models.predictions_drafts_post_request import PredictionsDraftsPostRequest
from openapi_server.models.predictions_get200_response import PredictionsGet200Response
from openapi_server.models.predictions_id_delete200_response import PredictionsIdDelete200Response
from openapi_server.models.predictions_id_get200_response import PredictionsIdGet200Response
from openapi_server.models.predictions_id_patch_request import PredictionsIdPatchRequest
from openapi_server.models.predictions_id_repredict_post_request import PredictionsIdRepredictPostRequest
from openapi_server.models.predictions_post201_response import PredictionsPost201Response
from openapi_server.models.predictions_post402_response import PredictionsPost402Response
from openapi_server.security_api import get_token_BearerAuth

class BasePredictionsApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BasePredictionsApi.subclasses = BasePredictionsApi.subclasses + (cls,)
    async def categories_get(
        self,
    ) -> CategoriesGet200Response:
        """Retrieve list of available video categories"""
        ...


    async def languages_get(
        self,
    ) -> LanguagesGet200Response:
        """Retrieve list of supported video languages"""
        ...


    async def predictions_bulk_delete_delete(
        self,
        predictions_bulk_delete_delete_request: PredictionsBulkDeleteDeleteRequest,
    ) -> PredictionsBulkDeleteDelete200Response:
        """Delete multiple predictions at once"""
        ...


    async def predictions_drafts_get(
        self,
    ) -> PredictionsDraftsGet200Response:
        """Retrieve user&#39;s saved prediction drafts"""
        ...


    async def predictions_drafts_id_delete(
        self,
        id: StrictStr,
    ) -> PredictionsDraftsIdDelete200Response:
        """Delete a saved prediction draft"""
        ...


    async def predictions_drafts_post(
        self,
        predictions_drafts_post_request: PredictionsDraftsPostRequest,
    ) -> PredictionsDraftsPost201Response:
        """Save prediction form data as draft"""
        ...


    async def predictions_export_get(
        self,
        format: Optional[StrictStr],
        date_from: Optional[date],
        date_to: Optional[date],
    ) -> Response:
        """Export user&#39;s predictions as CSV"""
        ...


    async def predictions_get(
        self,
        page: Optional[Annotated[int, Field(strict=True, ge=1)]],
        limit: Optional[Annotated[int, Field(le=100, strict=True, ge=1)]],
        sort_by: Optional[StrictStr],
        order: Optional[StrictStr],
        category: Optional[StrictStr],
        status: Optional[StrictStr],
        date_from: Optional[date],
        date_to: Optional[date],
        search: Annotated[Optional[StrictStr], Field(description="Search in video titles")],
    ) -> PredictionsGet200Response:
        """Retrieve paginated list of user&#39;s predictions"""
        ...


    async def predictions_id_delete(
        self,
        id: StrictStr,
    ) -> PredictionsIdDelete200Response:
        """Delete a specific prediction from history"""
        ...


    async def predictions_id_get(
        self,
        id: StrictStr,
    ) -> PredictionsIdGet200Response:
        """Retrieve detailed information about a specific prediction"""
        ...


    async def predictions_id_patch(
        self,
        id: StrictStr,
        predictions_id_patch_request: PredictionsIdPatchRequest,
    ) -> PredictionsIdGet200Response:
        """Update prediction with actual view count for tracking"""
        ...


    async def predictions_id_repredict_post(
        self,
        id: StrictStr,
        predictions_id_repredict_post_request: Optional[PredictionsIdRepredictPostRequest],
    ) -> PredictionsPost201Response:
        """Create a new prediction based on previous prediction&#39;s data"""
        ...


    async def predictions_post(
        self,
        prediction_request: PredictionRequest,
    ) -> PredictionsPost201Response:
        """Submit video metadata to predict view count"""
        ...
