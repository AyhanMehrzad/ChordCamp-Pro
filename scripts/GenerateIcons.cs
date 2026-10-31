using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Collections.Generic;

namespace IconGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            string sourcePath = @"C:\Users\SurfaceGO1\.gemini\antigravity-ide\brain\d8b11403-3037-49ac-ba19-78c31298dfdc\.user_uploaded\media_1793438947689.jpg";
            string projectDir = @"c:\Users\SurfaceGO1\Desktop\ChordCamp-Pro";
            string assetsDir = Path.Combine(projectDir, "assets");

            if (!Directory.Exists(assetsDir)) Directory.CreateDirectory(assetsDir);

            // Copy original source
            File.Copy(sourcePath, Path.Combine(assetsDir, "icon-source.jpg"), true);

            using (Bitmap src = new Bitmap(sourcePath))
            {
                // The source is 1024x1024 with a squircle badge.
                // Let's create high-quality resized images
                int[] pngSizes = new int[] { 512, 192, 144, 96, 72, 48, 32, 16 };
                Dictionary<int, byte[]> pngData = new Dictionary<int, byte[]>();

                foreach (int size in pngSizes)
                {
                    using (Bitmap resized = new Bitmap(size, size, PixelFormat.Format32bppArgb))
                    {
                        using (Graphics g = Graphics.FromImage(resized))
                        {
                            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                            g.SmoothingMode = SmoothingMode.HighQuality;
                            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                            g.CompositingQuality = CompositingQuality.HighQuality;
                            g.Clear(Color.Transparent);

                            // Draw image
                            g.DrawImage(src, new Rectangle(0, 0, size, size), 0, 0, src.Width, src.Height, GraphicsUnit.Pixel);
                        }

                        using (MemoryStream ms = new MemoryStream())
                        {
                            resized.Save(ms, ImageFormat.Png);
                            byte[] bytes = ms.ToArray();
                            pngData[size] = bytes;

                            if (size == 512)
                            {
                                File.WriteAllBytes(Path.Combine(assetsDir, "icon-512.png"), bytes);
                                File.WriteAllBytes(Path.Combine(assetsDir, "icon-maskable.png"), bytes);
                                File.WriteAllBytes(Path.Combine(assetsDir, "logo.png"), bytes);
                            }
                            else if (size == 192)
                            {
                                File.WriteAllBytes(Path.Combine(assetsDir, "icon-192.png"), bytes);
                            }
                        }
                    }
                }

                // Generate multi-resolution .ico file (256, 128, 64, 48, 32, 16)
                int[] icoSizes = new int[] { 256, 128, 64, 48, 32, 16 };
                List<byte[]> icoPngs = new List<byte[]>();
                List<int> finalSizes = new List<int>();

                foreach (int size in icoSizes)
                {
                    byte[] bytes;
                    if (!pngData.TryGetValue(size, out bytes))
                    {
                        using (Bitmap resized = new Bitmap(size, size, PixelFormat.Format32bppArgb))
                        {
                            using (Graphics g = Graphics.FromImage(resized))
                            {
                                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                                g.SmoothingMode = SmoothingMode.HighQuality;
                                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                                g.CompositingQuality = CompositingQuality.HighQuality;
                                g.Clear(Color.Transparent);
                                g.DrawImage(src, new Rectangle(0, 0, size, size), 0, 0, src.Width, src.Height, GraphicsUnit.Pixel);
                            }
                            using (MemoryStream ms = new MemoryStream())
                            {
                                resized.Save(ms, ImageFormat.Png);
                                bytes = ms.ToArray();
                            }
                        }
                    }
                    icoPngs.Add(bytes);
                    finalSizes.Add(size);
                }

                // Write .ico binary format
                string icoPath = Path.Combine(assetsDir, "ChordCamp.ico");
                using (FileStream fs = new FileStream(icoPath, FileMode.Create))
                using (BinaryWriter bw = new BinaryWriter(fs))
                {
                    // ICONDIR
                    bw.Write((short)0); // Reserved
                    bw.Write((short)1); // Type: 1 = ICO
                    bw.Write((short)icoPngs.Count); // Count

                    int offset = 6 + (16 * icoPngs.Count);

                    for (int i = 0; i < icoPngs.Count; i++)
                    {
                        int s = finalSizes[i];
                        byte w = (byte)(s >= 256 ? 0 : s);
                        byte h = (byte)(s >= 256 ? 0 : s);
                        byte[] data = icoPngs[i];

                        bw.Write(w);
                        bw.Write(h);
                        bw.Write((byte)0); // Color count
                        bw.Write((byte)0); // Reserved
                        bw.Write((short)1); // Planes
                        bw.Write((short)32); // Bits per pixel
                        bw.Write(data.Length); // Size in bytes
                        bw.Write(offset); // Offset in file

                        offset += data.Length;
                    }

                    // Write image datas
                    for (int i = 0; i < icoPngs.Count; i++)
                    {
                        bw.Write(icoPngs[i]);
                    }
                }

                Console.WriteLine("Successfully generated icon-512.png, icon-192.png, and multi-res ChordCamp.ico (" + new FileInfo(icoPath).Length + " bytes)!");
            }
        }
    }
}
