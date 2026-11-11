"""Compile and publish the Spanish Data Engineer CV from the LaTeX project.

Run from any directory: python cv/tools/build_cv.py
Dependencies: pypdf and Tectonic (on PATH or in latex/tectonic.exe).
"""
from pathlib import Path
import json
import shutil
import subprocess

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
LATEX = ROOT / 'latex'
SOURCE = LATEX / 'Jhulen-Mallo-CV.tex'
OUTPUT = ROOT / 'output/pdf/Jhulen-Mallo-CV.pdf'
PDF = OUTPUT
WEB_OUTPUT = ROOT / 'assets/docs/Jhulen-Mallo-CV.pdf'
CERTIFICATE_URL = 'https://www.credly.com/badges/6cf3e9ab-4273-437c-b1a1-de7fd75c58f8'


def main():
    executable = shutil.which('tectonic')
    if not executable:
        executable = next((str(path) for path in (
            LATEX / 'tectonic.exe', ROOT.parent / 'latex/tectonic.exe',
        ) if path.is_file()), None)
    if not executable:
        raise RuntimeError('Install Tectonic and add it to PATH, or place it in latex/tectonic.exe.')
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run(
        [executable, '-Z', 'search-path=.',
         '--outdir', str(OUTPUT.parent), '--keep-logs', str(SOURCE)],
        cwd=LATEX, capture_output=True, text=True, check=True,
    )
    log = result.stdout + result.stderr
    if any(warning in log for warning in (
        'Overfull \\vbox', 'Overfull \\hbox', 'Annotation out of page boundary',
    )):
        raise RuntimeError('LaTeX content overflows the page; review the compilation log.')

    reader = PdfReader(PDF)
    if len(reader.pages) != 1:
        raise RuntimeError(f'Expected a one-page CV; received {len(reader.pages)} pages.')
    text = reader.pages[0].extract_text()
    for required in (
        'Jhulen Mallo', 'DATA ENGINEER', 'Banco Bisa', 'Santillana',
        'Estadística', 'Generative AI Leader', 'Associate Cloud Engineer',
        'Nov 2026', 'Diciembre 2025',
    ):
        if required not in text:
            raise RuntimeError('Missing CV content: ' + required)
    links = [
        str(annotation.get_object().get('/A', {}).get('/URI', ''))
        for annotation in reader.pages[0].get('/Annots', [])
    ]
    if CERTIFICATE_URL not in links:
        raise RuntimeError('Missing Generative AI Leader verification link.')
    if 'xdvipdfmx' not in str(reader.metadata.producer):
        raise RuntimeError('The downloadable CV must be compiled from LaTeX.')

    for destination in (WEB_OUTPUT,):
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(PDF, destination)
    print(json.dumps({
        'source': str(SOURCE), 'output': str(OUTPUT),
        'webAsset': str(WEB_OUTPUT), 'pages': len(reader.pages),
        'bytes': PDF.stat().st_size, 'links': len(links),
    }, ensure_ascii=True))


if __name__ == '__main__':
    main()
