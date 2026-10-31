using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

namespace AndroidIconGen
{
    class MipmapDef
    {
        public string Folder;
        public int Size;
        public int FgSize;
        public MipmapDef(string f, int s, int fg) { Folder = f; Size = s; FgSize = fg; }
    }

    class Program
    {
        static void Main(string[] args)
        {
            string sourcePath = @"c:\Users\SurfaceGO1\Desktop\ChordCamp-Pro\assets\icon-source.jpg";
            string baseResDir = @"c:\Users\SurfaceGO1\Desktop\ChordCamp-Pro\assets\android-res";

            MipmapDef[] mipmaps = new MipmapDef[]
            {
                new MipmapDef("mipmap-mdpi", 48, 108),
                new MipmapDef("mipmap-hdpi", 72, 162),
                new MipmapDef("mipmap-xhdpi", 96, 216),
                new MipmapDef("mipmap-xxhdpi", 144, 324),
                new MipmapDef("mipmap-xxxhdpi", 192, 432)
            };

            using (Bitmap src = new Bitmap(sourcePath))
            {
                foreach (MipmapDef m in mipmaps)
                {
                    string dir = Path.Combine(baseResDir, m.Folder);
                    if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

                    // ic_launcher.png and ic_launcher_round.png
                    using (Bitmap resized = ResizeImage(src, m.Size, m.Size))
                    {
                        resized.Save(Path.Combine(dir, "ic_launcher.png"), ImageFormat.Png);
                        resized.Save(Path.Combine(dir, "ic_launcher_round.png"), ImageFormat.Png);
                    }

                    // ic_launcher_foreground.png
                    using (Bitmap fg = ResizeImage(src, m.FgSize, m.FgSize))
                    {
                        fg.Save(Path.Combine(dir, "ic_launcher_foreground.png"), ImageFormat.Png);
                    }
                }
            }
            Console.WriteLine("Android mipmap icons generated successfully in assets/android-res!");
        }

        static Bitmap ResizeImage(Bitmap src, int width, int height)
        {
            Bitmap dest = new Bitmap(width, height, PixelFormat.Format32bppArgb);
            using (Graphics g = Graphics.FromImage(dest))
            {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.CompositingQuality = CompositingQuality.HighQuality;
                g.Clear(Color.Transparent);
                g.DrawImage(src, new Rectangle(0, 0, width, height), 0, 0, src.Width, src.Height, GraphicsUnit.Pixel);
            }
            return dest;
        }
    }
}
