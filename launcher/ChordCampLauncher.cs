using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace ChordCampApp
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            try
            {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                string htmlPath = Path.Combine(baseDir, "index.html");

                if (!File.Exists(htmlPath))
                {
                    // Fallback check in parent or dist directory
                    string parentHtml = Path.Combine(Directory.GetParent(baseDir).FullName, "index.html");
                    if (File.Exists(parentHtml))
                    {
                        htmlPath = parentHtml;
                    }
                }

                if (!File.Exists(htmlPath))
                {
                    MessageBox.Show(
                        "Could not locate 'index.html'. Please make sure ChordCamp.exe is in the ChordCamp project folder.",
                        "ChordCamp Pro - File Missing",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Warning
                    );
                    return;
                }

                // Check for installed Chrome or Edge or Chromium to launch in dedicated standalone app-window mode
                string[] possibleBrowserPaths = new string[]
                {
                    @"C:\Program Files\Google\Chrome\Application\chrome.exe",
                    @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
                    @"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
                    @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + @"\Microsoft\Edge\Application\msedge.exe",
                    @"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe",
                    @"C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe"
                };

                string browserExe = null;
                foreach (string path in possibleBrowserPaths)
                {
                    if (File.Exists(path))
                    {
                        browserExe = path;
                        break;
                    }
                }

                string fileUri = new Uri(htmlPath).AbsoluteUri;

                if (browserExe != null)
                {
                    // Launch in clean borderless / dedicated standalone app mode (no browser address bar, feels 100% like a native desktop app!)
                    ProcessStartInfo psi = new ProcessStartInfo();
                    psi.FileName = browserExe;
                    psi.Arguments = string.Format("--app=\"{0}\" --enable-features=OverlayScrollbar --disable-features=Translate", fileUri);
                    psi.UseShellExecute = false;
                    Process.Start(psi);
                }
                else
                {
                    // Fallback to default browser
                    Process.Start(new ProcessStartInfo(fileUri) { UseShellExecute = true });
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error launching ChordCamp: " + ex.Message, "ChordCamp Pro Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
