"""Rename username to full_name

Revision ID: 71edbd983ab2
Revises: be42e1e2811c
Create Date: 2025-10-18 15:01:11.847355

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '71edbd983ab2'
down_revision: Union[str, Sequence[str], None] = 'be42e1e2811c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('users', 'username', new_column_name='full_name')


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('users', 'full_name', new_column_name='username')
