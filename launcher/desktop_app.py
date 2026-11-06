# launcher/desktop_app.py
"""
ChordCamp Pro — Standalone Native Desktop Application
Embedded Edge Chromium WebView2 Win32 window with local secure HTTP server
"""

import os
import sys
import socket
import threading
from http.server import SimpleHTTPRequestHandler
import socketserver
import webview

def find_app_dir():
    # If frozen with PyInstaller
    if getattr(sys, 'frozen', False):
        base_dir = os.path.dirname(os.path.abspath(sys.executable))
        if os.path.exists(os.path.join(base_dir, 'index.html')):
            return base_dir
        # Check parent folder if placed inside dist/
        parent = os.path.dirname(base_dir)
        if os.path.exists(os.path.join(parent, 'index.html')):
            return parent
        if hasattr(sys, '_MEIPASS') and os.path.exists(os.path.join(sys._MEIPASS, 'index.html')):
            return sys._MEIPASS

    # Running from source script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(script_dir)
    if os.path.exists(os.path.join(parent_dir, 'index.html')):
        return parent_dir
    if os.path.exists('index.html'):
        return os.path.abspath('.')

    return os.path.abspath('.')

def get_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Silence HTTP request terminal output
        pass

    def end_headers(self):
        # Allow cross-origin / local media device access
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def start_local_server(app_dir, port):
    os.chdir(app_dir)
    handler = QuietHandler
    with socketserver.TCPServer(('127.0.0.1', port), handler) as httpd:
        httpd.serve_forever()

def main():
    app_dir = find_app_dir()
    port = get_free_port()

    # Start quiet background HTTP server for secure context (enables mic access for tuner)
    server_thread = threading.Thread(target=start_local_server, args=(app_dir, port), daemon=True)
    server_thread.start()

    url = f'http://127.0.0.1:{port}/index.html'

    icon_path = os.path.join(app_dir, 'assets', 'ChordCamp.ico')
    if not os.path.exists(icon_path):
        icon_path = None

    # Create native desktop window
    window = webview.create_window(
        title='ChordCamp Pro — Interactive Guitar Studio',
        url=url,
        width=1280,
        height=850,
        min_size=(960, 640),
        background_color='#0d140e',
        text_select=False,
        zoomable=True
    )

    # Launch native Edge Chromium desktop app window
    webview.start(gui='edgechromium', debug=False)

if __name__ == '__main__':
    main()

