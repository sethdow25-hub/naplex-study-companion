"""Serve only the bundled app on this computer and its local network."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from ipaddress import ip_address
from pathlib import Path
import argparse
import socket
import sys
import webbrowser

BASE_DIR = Path(__file__).resolve().parent
APP_DIR = BASE_DIR / "app" if (BASE_DIR / "app" / "index.html").is_file() else BASE_DIR
PORT = 4173

class AppHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".webmanifest": "application/manifest+json"}
    allowed = {"/", "/index.html", "/styles.css", "/content.js", "/extra-content.js",
               "/audit-data.js", "/content-audit.md", "/practice-core.js",
               "/app.js", "/sync-core.js", "/focus-core.js", "/sync.js", "/sw.js", "/manifest.webmanifest", "/icon.svg",
               "/icon-192.png", "/icon-512.png"}
    def do_GET(self):
        if self.path.split("?", 1)[0] not in self.allowed:
            self.send_error(404)
            return
        super().do_GET()
    def do_HEAD(self):
        if self.path.split("?", 1)[0] not in self.allowed:
            self.send_error(404)
            return
        super().do_HEAD()
    def log_message(self, format, *args):
        pass

def local_addresses():
    try:
        found = {result[4][0] for result in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET)}
        return sorted(value for value in found if ip_address(value).is_private and not ip_address(value).is_loopback and not ip_address(value).is_link_local)
    except OSError:
        return []

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--no-open", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args()
    if not (APP_DIR / "index.html").is_file():
        print("The app folder is missing. Extract the whole ZIP and try again.")
        return 1
    try:
        server = ThreadingHTTPServer(("0.0.0.0", PORT), partial(AppHandler, directory=str(APP_DIR)))
    except OSError as exc:
        print(f"Could not start on port {PORT}: {exc}")
        print("Close another copy of the study app or another program using this port, then try again.")
        return 1
    server.daemon_threads = True
    local = f"http://127.0.0.1:{PORT}/"
    print("\nNAPLEX STUDY COMPANION", flush=True)
    print("======================", flush=True)
    print(f"Computer: {local}", flush=True)
    print("\nOn an Android phone on the same Wi-Fi, open one of these addresses in Chrome:", flush=True)
    addresses = local_addresses()
    if addresses:
        for address in addresses:
            print(f"  http://{address}:{PORT}/", flush=True)
    else:
        print("  No Wi-Fi address was detected. Check your computer's IPv4 address and use http://ADDRESS:4173/", flush=True)
    print("\nKeep this window open while using the app on your phone.", flush=True)
    print("Windows may ask whether to allow local-network access; use a trusted network.", flush=True)
    print("Press Ctrl+C or close this window to stop the app.\n", flush=True)
    if not args.no_open:
        webbrowser.open(local)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0

if __name__ == "__main__":
    sys.exit(main())
