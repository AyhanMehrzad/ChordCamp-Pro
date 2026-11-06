# launcher/desktop_app.py
"""
ChordCamp Pro — Standalone Native Desktop Application
Embedded Edge Chromium WebView2 Win32 window with local secure HTTP server & automatic microphone permissions
"""

import os
import sys

# Pre-configure WebView2 flags to allow microphone capture without UI prompt blocks
os.environ['WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS'] = '--use-fake-ui-for-media-stream --enable-features=msEdgePermissionPrompt'

import socket
import threading
from http.server import SimpleHTTPRequestHandler
import socketserver
import webview

# Automatically grant CoreWebView2 permissions for audio/microphone in pywebview
try:
    import webview.platforms.edgechromium as ec
    from Microsoft.Web.WebView2.Core import CoreWebView2PermissionState, CoreWebView2PermissionKind

    _orig_on_webview_ready = ec.EdgeChrome.on_webview_ready

    def _patched_on_webview_ready(self, sender, args):
        _orig_on_webview_ready(self, sender, args)
        try:
            if args.IsSuccess and sender.CoreWebView2:
                def _on_permission_requested(s, e):
                    # Auto-grant microphone permission for tuner
                    if e.PermissionKind == CoreWebView2PermissionKind.Microphone:
                        e.State = CoreWebView2PermissionState.Allow
                    else:
                        e.State = CoreWebView2PermissionState.Allow
                sender.CoreWebView2.PermissionRequested += _on_permission_requested
        except Exception:
            pass

    ec.EdgeChrome.on_webview_ready = _patched_on_webview_ready
except Exception:
    pass

def find_app_dir():
    # If frozen with PyInstaller
    if getattr(sys, 'frozen', False):
        base_dir = os.path.dirname(os.path.abspath(sys.executable))
        if os.path.exists(os.path.join(base_dir, 'index.html')):
            return base_dir
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
