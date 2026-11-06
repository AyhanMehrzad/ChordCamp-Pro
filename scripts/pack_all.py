# scripts/pack_all.py
"""
ChordCamp Pro — Automated Multi-Platform Packaging Engine
Prepares dist/, packages ChordCamp.exe, builds ChordCampPayload.zip, and compiles ChordCampSetup.exe
"""

import os
import sys
import shutil
import zipfile
import subprocess

PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DIST_DIR = os.path.join(PROJECT_DIR, 'dist')
INSTALLER_DIR = os.path.join(PROJECT_DIR, 'installer')
PAYLOAD_ZIP = os.path.join(INSTALLER_DIR, 'ChordCampPayload.zip')
CSC_PATH = r"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"

def step1_prepare_dist():
    print("\n--- [1/4] Preparing Clean dist/ Directory ---")
    if os.path.exists(DIST_DIR):
        shutil.rmtree(DIST_DIR, ignore_errors=True)
    os.makedirs(DIST_DIR, exist_ok=True)

    items = ['index.html', 'manifest.json', 'sw.js', 'install-android.html', 'launch-windows.bat', 'Install-Windows.bat', 'Update-Windows.bat']
    for item in items:
        src = os.path.join(PROJECT_DIR, item)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(DIST_DIR, item))
            print(f"  Copied {item} to dist/")

    folders = ['css', 'js', 'assets']
    for folder in folders:
        src = os.path.join(PROJECT_DIR, folder)
        dest = os.path.join(DIST_DIR, folder)
        if os.path.exists(src):
            shutil.copytree(src, dest, dirs_exist_ok=True)
            print(f"  Copied folder {folder}/ to dist/")

def step2_build_exe():
    print("\n--- [2/4] Packaging Standalone ChordCamp.exe with PyInstaller ---")
    cmd = [
        sys.executable, "-m", "PyInstaller",
        "--noconsole",
        "--onefile",
        f"--icon={os.path.join(PROJECT_DIR, 'assets', 'ChordCamp.ico')}",
        "--name=ChordCamp",
        os.path.join(PROJECT_DIR, "launcher", "desktop_app.py")
    ]
    subprocess.run(cmd, cwd=PROJECT_DIR, check=True)

    built_exe = os.path.join(PROJECT_DIR, "dist", "ChordCamp.exe")
    root_exe = os.path.join(PROJECT_DIR, "ChordCamp.exe")
    if os.path.exists(built_exe):
        shutil.copy2(built_exe, root_exe)
        print(f"  ChordCamp.exe updated successfully! Size: {os.path.getsize(root_exe)} bytes")

def step3_create_payload_zip():
    print("\n--- [3/4] Creating ChordCampPayload.zip for Windows Installer ---")
    os.makedirs(INSTALLER_DIR, exist_ok=True)
    if os.path.exists(PAYLOAD_ZIP):
        try:
            os.remove(PAYLOAD_ZIP)
        except Exception:
            pass

    # Ensure ChordCamp.exe is in dist
    shutil.copy2(os.path.join(PROJECT_DIR, "ChordCamp.exe"), os.path.join(DIST_DIR, "ChordCamp.exe"))

    with zipfile.ZipFile(PAYLOAD_ZIP, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, _, files in os.walk(DIST_DIR):
            for file in files:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, DIST_DIR)
                # Skip recursive zip or huge caches if any
                if file.endswith('.zip') or file.endswith('.tmp'):
                    continue
                zf.write(abs_path, rel_path)

    print(f"  Payload zip created! Size: {os.path.getsize(PAYLOAD_ZIP)} bytes")

def step4_compile_setup_installer():
    print("\n--- [4/4] Compiling ChordCampSetup.exe with Microsoft .NET CSC ---")
    if not os.path.exists(CSC_PATH):
        print(f"  ERROR: .NET CSC compiler not found at {CSC_PATH}")
        sys.exit(1)

    setup_cs = os.path.join(INSTALLER_DIR, "ChordCampSetup.cs")
    icon_file = os.path.join(PROJECT_DIR, "assets", "ChordCamp.ico")
    out_exe = os.path.join(PROJECT_DIR, "ChordCampSetup.exe")

    refs = "System.Windows.Forms.dll,System.Drawing.dll,Microsoft.CSharp.dll,System.IO.Compression.dll,System.IO.Compression.FileSystem.dll"
    cmd = [
        CSC_PATH,
        "/target:winexe",
        f"/r:{refs}",
        f"/resource:{PAYLOAD_ZIP},ChordCampPayload.zip",
        f"/win32icon:{icon_file}",
        f"/out:{out_exe}",
        setup_cs
    ]

    res = subprocess.run(cmd, cwd=PROJECT_DIR, capture_output=True, text=True)
    if res.returncode != 0:
        print("  Compilation failed:")
        print(res.stderr)
        print(res.stdout)
        sys.exit(1)

    print(f"  ChordCampSetup.exe compiled successfully! Size: {os.path.getsize(out_exe)} bytes")

    # Copy to dist as well
    shutil.copy2(out_exe, os.path.join(DIST_DIR, "ChordCampSetup.exe"))

if __name__ == '__main__':
    step1_prepare_dist()
    step2_build_exe()
    step3_create_payload_zip()
    step4_compile_setup_installer()
    print("\n✨ ALL COMPILED FILES FOR PC & ANDROID PREPARED AND UPDATED SUCCESSFULLY! ✨\n")

