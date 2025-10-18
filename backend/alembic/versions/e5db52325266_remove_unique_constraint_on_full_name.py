"""Remove unique constraint on full_name

Revision ID: e5db52325266
Revises: 71edbd983ab2
Create Date: 2025-10-18 15:55:13.372575

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5db52325266'
down_revision: Union[str, Sequence[str], None] = '71edbd983ab2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
