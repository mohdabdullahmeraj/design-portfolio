/** @type {import('next').NextConfig} */
const nextConfig = {
  // lets a phone on the same Wi-Fi open the dev server (http://<this PC's IP>:3000) with live reload working
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  // the page of every piece was "Playground" (/playground), then "All work" (/work); now "Archive" (/archive).
  // Keep old links working. (/work/<slug> case studies are untouched.)
  async redirects() {
    return [
      { source: "/playground", destination: "/archive", permanent: true },
      { source: "/work", destination: "/archive", permanent: true },
    ];
  },
};
export default nextConfig;
