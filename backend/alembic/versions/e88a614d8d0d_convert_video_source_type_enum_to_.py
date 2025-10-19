"""convert video_source_type enum to lowercase text

Revision ID: e88a614d8d0d
Revises: d2d9d9bb4916
Create Date: 2025-10-19 19:39:34.102469

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e88a614d8d0d'
down_revision: Union[str, Sequence[str], None] = 'd2d9d9bb4916'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Rename old enum type
    op.execute("ALTER TYPE video_source_type RENAME TO video_source_type_old")

    # Add temporary new column using text
    op.add_column("videos", sa.Column("source_type_new", sa.String(), nullable=False, server_default="youtube"))

    # Copy data from old enum (cast to lowercase text)
    op.execute("UPDATE videos SET source_type_new = lower(source_type::text)")

    # Drop the old column and rename the new one
    op.drop_column("videos", "source_type")
    op.alter_column("videos", "source_type_new", new_column_name="source_type")

    # Drop the old enum type
    op.execute("DROP TYPE video_source_type_old")


def downgrade():
    # Recreate old enum type (if you ever need to roll back)
    op.execute("CREATE TYPE video_source_type AS ENUM ('YOUTUBE', 'MANUAL', 'TEST')")

    # Add old enum column back
    op.add_column(
        "videos",
        sa.Column(
            "source_type_old",
            sa.Enum("YOUTUBE", "MANUAL", "TEST", name="video_source_type"),
            nullable=False,
            server_default="YOUTUBE",
        ),
    )

    # Copy data from text back to uppercase enum
    op.execute("UPDATE videos SET source_type_old = upper(source_type)::video_source_type")

    # Drop text column and rename the enum one back
    op.drop_column("videos", "source_type")
    op.alter_column("videos", "source_type_old", new_column_name="source_type")
