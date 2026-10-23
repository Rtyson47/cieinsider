"""Fail the commit if an indexable page has no Microsoft Clarity tag.

Every /marked/ page shipped without it (found 2026-10-23), so the paid offer's visits were never
counted while every sibling page was. Copy the block from bridge/index.html. Pages marked
noindex are skipped.
"""
import sys

bad = 0
for path in sys.argv[1:]:
    src = open(path, encoding='utf-8').read()
    if 'noindex' in src or 'clarity.ms/tag/' in src:
        continue
    print(f'{path}: no Microsoft Clarity tag. Copy the "Microsoft Clarity" block from '
          f'bridge/index.html into the <head>.')
    bad += 1
sys.exit(1 if bad else 0)
