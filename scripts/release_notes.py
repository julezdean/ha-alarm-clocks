"""Print the changelog section for a release tag, or its date.

HACS renders the body of the GitHub release in its update dialog and puts a
heading of its own above it: the tag, followed by the release name when that
differs from the tag. With the date as the release name the dialog reads
"# v1.1.5  - 2026-09-08", so the body itself starts at the "### Changed"
level and does not repeat the version heading of CHANGELOG.md.
"""

import pathlib
import re
import sys

CHANGELOG = pathlib.Path(__file__).parent.parent / "CHANGELOG.md"


def section(version: str) -> tuple[str, str | None] | None:
    """Return body and date of a version's section, or None if it has none."""
    match = re.search(
        rf"^## \[{re.escape(version)}\]([^\n]*)\n(.*?)(?=^## \[|\Z)",
        CHANGELOG.read_text(),
        re.MULTILINE | re.DOTALL,
    )
    if match is None:
        return None

    date = re.search(r"\d{4}-\d{2}-\d{2}", match.group(1))
    return match.group(2).strip(), date.group(0) if date else None


def main() -> int:
    args = sys.argv[1:]
    want_date = "--date" in args
    tags = [arg for arg in args if arg != "--date"]
    if len(tags) != 1:
        print(f"usage: {sys.argv[0]} [--date] <tag>", file=sys.stderr)
        return 2

    version = tags[0].removeprefix("v")
    if (found := section(version)) is None:
        print(f"no changelog section for {version}", file=sys.stderr)
        return 1

    body, date = found
    if not want_date:
        print(body)
        return 0

    if date is None:
        print(f"no date in the heading of {version}", file=sys.stderr)
        return 1

    print(date)
    return 0


if __name__ == "__main__":
    sys.exit(main())
