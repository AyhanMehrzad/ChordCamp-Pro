using System;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Diagnostics;
using System.Reflection;
using System.Windows.Forms;

namespace ChordCampInstaller
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new InstallerForm());
        }
    }

    public class InstallerForm : Form
    {
        private ProgressBar progressBar;
        private Label lblStatus;
        private Button btnInstall;
        private CheckBox chkDesktop;
        private CheckBox chkStartMenu;
        private CheckBox chkLaunch;
        private TextBox txtInstallPath;
        private bool isUpgrade = false;

        public InstallerForm()
        {
            this.Text = "ChordCamp Pro — Windows Setup";
            this.Size = new Size(520, 390);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(13, 20, 14);
            this.ForeColor = Color.FromArgb(235, 245, 230);
            this.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);

            string defaultPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "ChordCamp-Pro");
            isUpgrade = Directory.Exists(defaultPath) && File.Exists(Path.Combine(defaultPath, "index.html"));

            // Header Banner
            Panel pnlHeader = new Panel();
            pnlHeader.Dock = DockStyle.Top;
            pnlHeader.Height = 80;
            pnlHeader.BackColor = Color.FromArgb(8, 13, 9);
            this.Controls.Add(pnlHeader);

            Label lblTitle = new Label();
            lblTitle.Text = "ChordCamp Pro";
            lblTitle.Font = new Font("Segoe UI", 16f, FontStyle.Bold);
            lblTitle.ForeColor = Color.FromArgb(216, 255, 101);
            lblTitle.Location = new Point(20, 14);
            lblTitle.AutoSize = true;
            pnlHeader.Controls.Add(lblTitle);

            Label lblSub = new Label();
            lblSub.Text = "Interactive Offline Guitar Playground & Practice Studio";
            lblSub.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
            lblSub.ForeColor = Color.FromArgb(180, 195, 175);
            lblSub.Location = new Point(22, 45);
            lblSub.AutoSize = true;
            pnlHeader.Controls.Add(lblSub);

            // Install Path
            Label lblPath = new Label();
            lblPath.Text = "Install Location:";
            lblPath.Location = new Point(22, 95);
            lblPath.AutoSize = true;
            this.Controls.Add(lblPath);

            txtInstallPath = new TextBox();
            txtInstallPath.Text = defaultPath;
            txtInstallPath.Location = new Point(24, 120);
            txtInstallPath.Size = new Size(455, 26);
            txtInstallPath.BackColor = Color.FromArgb(22, 33, 23);
            txtInstallPath.ForeColor = Color.FromArgb(216, 255, 101);
            txtInstallPath.BorderStyle = BorderStyle.FixedSingle;
            this.Controls.Add(txtInstallPath);

            // Checkboxes
            chkDesktop = new CheckBox();
            chkDesktop.Text = "Create / Refresh Desktop Shortcut";
            chkDesktop.Checked = true;
            chkDesktop.Location = new Point(25, 160);
            chkDesktop.AutoSize = true;
            this.Controls.Add(chkDesktop);

            chkStartMenu = new CheckBox();
            chkStartMenu.Text = "Add / Refresh Windows Start Menu Shortcut";
            chkStartMenu.Checked = true;
            chkStartMenu.Location = new Point(25, 190);
            chkStartMenu.AutoSize = true;
            this.Controls.Add(chkStartMenu);

            chkLaunch = new CheckBox();
            chkLaunch.Text = "Launch ChordCamp Pro immediately after update/install";
            chkLaunch.Checked = true;
            chkLaunch.Location = new Point(25, 220);
            chkLaunch.AutoSize = true;
            this.Controls.Add(chkLaunch);

            // Status label
            lblStatus = new Label();
            lblStatus.Text = isUpgrade 
                ? "Existing installation detected. Ready to update in-place (no uninstall needed)!"
                : "Ready to install.";
            lblStatus.Location = new Point(24, 252);
            lblStatus.ForeColor = isUpgrade ? Color.FromArgb(216, 255, 101) : Color.FromArgb(170, 190, 165);
            lblStatus.AutoSize = true;
            this.Controls.Add(lblStatus);

            // Progress bar
            progressBar = new ProgressBar();
            progressBar.Location = new Point(24, 275);
            progressBar.Size = new Size(455, 14);
            progressBar.Visible = false;
            this.Controls.Add(progressBar);

            // Install button
            btnInstall = new Button();
            btnInstall.Text = isUpgrade 
                ? "⚡ Update / Upgrade ChordCamp Pro (v1.1.0)" 
                : "Install ChordCamp Pro (v1.1.0)";
            btnInstall.Location = new Point(24, 300);
            btnInstall.Size = new Size(455, 38);
            btnInstall.BackColor = Color.FromArgb(216, 255, 101);
            btnInstall.ForeColor = Color.FromArgb(12, 20, 10);
            btnInstall.Font = new Font("Segoe UI", 10.5f, FontStyle.Bold);
            btnInstall.FlatStyle = FlatStyle.Flat;
            btnInstall.FlatAppearance.BorderSize = 0;
            btnInstall.Cursor = Cursors.Hand;
            btnInstall.Click += BtnInstall_Click;
            this.Controls.Add(btnInstall);
        }

        private void BtnInstall_Click(object sender, EventArgs e)
        {
            btnInstall.Enabled = false;
            progressBar.Visible = true;
            progressBar.Value = 10;
            lblStatus.Text = "Closing running instances & preparing update...";
            Application.DoEvents();

            // Gracefully close any running instances so files are not locked
            try
            {
                foreach (Process p in Process.GetProcessesByName("ChordCamp"))
                {
                    p.Kill();
                    p.WaitForExit(1500);
                }
            }
            catch { }

            try
            {
                string targetDir = txtInstallPath.Text.Trim();
                if (string.IsNullOrEmpty(targetDir))
                {
                    targetDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "ChordCamp-Pro");
                }

                if (!Directory.Exists(targetDir))
                {
                    Directory.CreateDirectory(targetDir);
                }

                progressBar.Value = 30;
                lblStatus.Text = "Extracting ChordCamp Pro application payload...";
                Application.DoEvents();

                // 1. Try to extract from embedded resource payload
                bool extracted = false;
                Assembly asm = Assembly.GetExecutingAssembly();
                string resourceName = "ChordCampPayload.zip";

                using (Stream stream = asm.GetManifestResourceStream(resourceName))
                {
                    if (stream != null)
                    {
                        string tempZip = Path.Combine(Path.GetTempPath(), "ChordCampPayload_" + Guid.NewGuid().ToString("N") + ".zip");
                        using (FileStream fs = new FileStream(tempZip, FileMode.Create, FileAccess.Write))
                        {
                            byte[] buffer = new byte[65536];
                            int read;
                            while ((read = stream.Read(buffer, 0, buffer.Length)) > 0)
                            {
                                fs.Write(buffer, 0, read);
                            }
                        }

                        // Extract using ZipFile
                        ExtractZipOverwrite(tempZip, targetDir);

                        try { File.Delete(tempZip); } catch { }
                        extracted = true;
                    }
                }

                // 2. Fallback to adjacent directory copy if running locally from source
                if (!extracted)
                {
                    string currentDir = AppDomain.CurrentDomain.BaseDirectory;
                    string sourceDir = currentDir;
                    if (!File.Exists(Path.Combine(sourceDir, "index.html")))
                    {
                        string parent = Directory.GetParent(currentDir).FullName;
                        if (File.Exists(Path.Combine(parent, "index.html")))
                        {
                            sourceDir = parent;
                        }
                    }

                    if (File.Exists(Path.Combine(sourceDir, "index.html")))
                    {
                        CopyDirectory(sourceDir, targetDir);
                        extracted = true;
                    }
                }

                if (!extracted)
                {
                    throw new Exception("Application payload not found inside installer or adjacent directory.");
                }

                progressBar.Value = 75;
                lblStatus.Text = "Creating Windows shortcuts...";
                Application.DoEvents();

                string exePath = Path.Combine(targetDir, "ChordCamp.exe");
                string iconPath = Path.Combine(targetDir, "assets", "ChordCamp.ico");

                if (chkDesktop.Checked)
                {
                    string desktop = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                    string shortcut = Path.Combine(desktop, "ChordCamp Pro.lnk");
                    CreateShortcut(shortcut, exePath, targetDir, iconPath, "ChordCamp Pro — Interactive Guitar Playground");
                }

                if (chkStartMenu.Checked)
                {
                    string startMenu = Environment.GetFolderPath(Environment.SpecialFolder.Programs);
                    string shortcut = Path.Combine(startMenu, "ChordCamp Pro.lnk");
                    CreateShortcut(shortcut, exePath, targetDir, iconPath, "ChordCamp Pro — Interactive Guitar Playground");
                }

                // Create uninstaller
                string uninstallerPath = Path.Combine(targetDir, "Uninstall.bat");
                File.WriteAllText(uninstallerPath,
                    "@echo off\r\n" +
                    "title Uninstall ChordCamp Pro\r\n" +
                    "echo Removing desktop shortcuts...\r\n" +
                    "del /q \"%USERPROFILE%\\Desktop\\ChordCamp Pro.lnk\" 2>nul\r\n" +
                    "del /q \"%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\ChordCamp Pro.lnk\" 2>nul\r\n" +
                    "echo Removing application files...\r\n" +
                    "cd ..\r\n" +
                    "rmdir /s /q \"" + targetDir + "\" 2>nul\r\n" +
                    "echo ChordCamp Pro has been removed successfully.\r\n" +
                    "pause\r\n"
                );

                progressBar.Value = 100;
                lblStatus.Text = isUpgrade ? "Update successful!" : "Installation successful!";

                if (chkLaunch.Checked && File.Exists(exePath))
                {
                    Process.Start(new ProcessStartInfo(exePath) { WorkingDirectory = targetDir });
                }

                MessageBox.Show(
                    isUpgrade 
                        ? "ChordCamp Pro has been updated to the latest version!\r\n\r\nAll new chords, guitar tuner, and visual metronome are ready to use."
                        : "ChordCamp Pro has been successfully installed!\r\n\r\nEnjoy your offline guitar playground!",
                    isUpgrade ? "Update Complete" : "Installation Complete",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information
                );

                this.Close();
            }
            catch (Exception ex)
            {
                progressBar.Visible = false;
                btnInstall.Enabled = true;
                lblStatus.Text = "Installation failed: " + ex.Message;
                MessageBox.Show("Error during installation: " + ex.Message, "Install Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private static void ExtractZipOverwrite(string zipPath, string targetDir)
        {
            using (ZipArchive archive = ZipFile.OpenRead(zipPath))
            {
                foreach (ZipArchiveEntry entry in archive.Entries)
                {
                    string fullPath = Path.Combine(targetDir, entry.FullName);
                    if (string.IsNullOrEmpty(entry.Name))
                    {
                        Directory.CreateDirectory(fullPath);
                    }
                    else
                    {
                        Directory.CreateDirectory(Path.GetDirectoryName(fullPath));
                        entry.ExtractToFile(fullPath, true);
                    }
                }
            }
        }

        private static void CopyDirectory(string source, string target)
        {
            if (string.Equals(Path.GetFullPath(source).TrimEnd('\\'), Path.GetFullPath(target).TrimEnd('\\'), StringComparison.OrdinalIgnoreCase))
            {
                return;
            }

            Directory.CreateDirectory(target);

            string[] ignoreDirs = new string[] { ".git", ".github", "node_modules", "android", "dist", "scripts", "installer" };
            string[] ignoreFiles = new string[] { "ChordCampSetup.exe", "ChordCampSetup.cs" };

            foreach (string file in Directory.GetFiles(source))
            {
                string fileName = Path.GetFileName(file);
                bool skip = false;
                foreach (string ign in ignoreFiles)
                {
                    if (string.Equals(fileName, ign, StringComparison.OrdinalIgnoreCase)) { skip = true; break; }
                }
                if (!skip)
                {
                    File.Copy(file, Path.Combine(target, fileName), true);
                }
            }

            foreach (string dir in Directory.GetDirectories(source))
            {
                string dirName = Path.GetFileName(dir);
                bool skip = false;
                foreach (string ign in ignoreDirs)
                {
                    if (string.Equals(dirName, ign, StringComparison.OrdinalIgnoreCase)) { skip = true; break; }
                }
                if (!skip)
                {
                    CopyDirectory(dir, Path.Combine(target, dirName));
                }
            }
        }

        private static void CreateShortcut(string shortcutPath, string targetPath, string workingDir, string iconPath, string description)
        {
            try
            {
                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                dynamic shell = Activator.CreateInstance(shellType);
                dynamic shortcut = shell.CreateShortcut(shortcutPath);
                shortcut.TargetPath = targetPath;
                shortcut.WorkingDirectory = workingDir;
                if (File.Exists(iconPath))
                {
                    shortcut.IconLocation = iconPath + ",0";
                }
                shortcut.Description = description;
                shortcut.Save();
            }
            catch (Exception)
            {
            }
        }
    }
}
