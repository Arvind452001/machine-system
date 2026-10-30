const LoadingSpinner = ({
  text = "Loading...",
  minHeight = "160px",
  size = "2.2rem",
  color = "var(--orange, #c94f2d)",
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 16px",
        minHeight,
        color: "var(--muted, #6b7c72)",
        width: "100%",
        textAlign: "center",
      }}
      role="status"
    >
      <div
        className="spinner-border mb-3"
        role="status"
        style={{
          width: size,
          height: size,
          color: color,
          borderWidth: "0.22em",
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && (
        <div
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#6b7c72",
            letterSpacing: "0.01em",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
