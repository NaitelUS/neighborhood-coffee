import Header from "./components/Header";

export default function App() {
  return (
    <div
      style={{
        backgroundColor: "#fffaf3",
        color: "#2d2d2d",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
      }}
    >
      <Header />
      <p>Header loaded successfully ✅</p>
    </div>
  );
}
