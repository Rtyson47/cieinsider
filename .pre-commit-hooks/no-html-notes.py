"""Fail the commit if a page carries an internal note in an HTML comment.

The repo is public and every comment ships in the served HTML, where crawlers and AI tools read it.
On 2026-10-10 the comments on /marked/ held a student's name, paper and score. Short section labels
(<!-- FOOTER -->) are fine; anything longer than 70 characters is a note and belongs in
"cie insider/site-copy-notes/", outside the repo. Comments inside <script>/<style> are ignored.
"""
import re, sys

LIMIT = 70
block = re.compile(r'<script\b.*?</script>|<style\b.*?</style>', re.S | re.I)
bad = 0
for path in sys.argv[1:]:
    src = open(path, encoding='utf-8').read()
    html = block.sub(lambda m: '\n' * m.group(0).count('\n'), src)
    for m in re.finditer(r'<!--(.*?)-->', html, re.S):
        if len(m.group(1)) > LIMIT:
            line = html[:m.start()].count('\n') + 1
            print(f'{path}:{line}: {len(m.group(1))}-char HTML comment. Move the note to '
                  f'"cie insider/site-copy-notes/" (the repo is public).')
            bad += 1
sys.exit(1 if bad else 0)
