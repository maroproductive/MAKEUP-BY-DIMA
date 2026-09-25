import { ImageResponse } from "next/og";
export const alt = "Makeup by Dima — Your beauty, beautifully enhanced.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#f8f5ef",
        color: "#302b26",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "20px solid #ded2be",
      }}
    >
      <div style={{ fontSize: 24, letterSpacing: 10 }}>MAKEUP BY DIMA</div>
      <div style={{ fontSize: 78, marginTop: 50, fontFamily: "serif" }}>
        Beautifully you.
      </div>
      <div style={{ fontSize: 24, marginTop: 28, color: "#8c7653" }}>
        Soft glam · Engagement · Bridal
      </div>
    </div>,
    size,
  );
}
