# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr, field_validator
from typing import List, Optional
from typing_extensions import Annotated
from openapi_server.models.channel_settings import ChannelSettings
from openapi_server.models.channels_callback_get200_response import ChannelsCallbackGet200Response
from openapi_server.models.channels_connect_post200_response import ChannelsConnectPost200Response
from openapi_server.models.channels_me_analytics_get200_response import ChannelsMeAnalyticsGet200Response
from openapi_server.models.channels_me_delete200_response import ChannelsMeDelete200Response
from openapi_server.models.channels_me_get404_response import ChannelsMeGet404Response
from openapi_server.models.channels_me_settings_get200_response import ChannelsMeSettingsGet200Response
from openapi_server.models.channels_me_sync_post200_response import ChannelsMeSyncPost200Response
from openapi_server.models.channels_me_videos_get200_response import ChannelsMeVideosGet200Response
from openapi_server.models.channels_me_videos_get404_response import ChannelsMeVideosGet404Response
from openapi_server.models.inline_object import InlineObject
from openapi_server.security_api import get_token_BearerAuth

class BaseChannelsApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseChannelsApi.subclasses = BaseChannelsApi.subclasses + (cls,)
    async def channels_callback_get(
        self,
        code: StrictStr,
        state: StrictStr,
    ) -> ChannelsCallbackGet200Response:
        """Handle OAuth callback from YouTube"""
        ...


    async def channels_connect_post(
        self,
    ) -> ChannelsConnectPost200Response:
        """Initiate YouTube channel connection via OAuth"""
        ...


    async def channels_me_analytics_get(
        self,
        period: Optional[StrictStr],
        metrics: Optional[List[StrictStr]],
    ) -> ChannelsMeAnalyticsGet200Response:
        """Retrieve analytics data from connected YouTube channel"""
        ...


    async def channels_me_delete(
        self,
    ) -> ChannelsMeDelete200Response:
        """Disconnect YouTube channel from account"""
        ...


    async def channels_me_get(
        self,
    ) -> ChannelsCallbackGet200Response:
        """Retrieve connected YouTube channel information"""
        ...


    async def channels_me_settings_get(
        self,
    ) -> ChannelsMeSettingsGet200Response:
        """Retrieve channel-specific settings"""
        ...


    async def channels_me_settings_put(
        self,
        channel_settings: ChannelSettings,
    ) -> ChannelsMeSettingsGet200Response:
        """Update channel-specific settings"""
        ...


    async def channels_me_sync_post(
        self,
    ) -> ChannelsMeSyncPost200Response:
        """Manually trigger channel data synchronization"""
        ...


    async def channels_me_videos_get(
        self,
        page: Optional[Annotated[int, Field(strict=True, ge=1)]],
        limit: Optional[Annotated[int, Field(le=50, strict=True, ge=1)]],
        sort_by: Optional[StrictStr],
        order: Optional[StrictStr],
    ) -> ChannelsMeVideosGet200Response:
        """Retrieve videos from connected YouTube channel"""
        ...
