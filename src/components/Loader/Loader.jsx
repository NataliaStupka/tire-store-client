//ClipLoader
import { ClipLoader } from "react-spinners";

const LoaderComponent = ({ size = 80, color = "#3470FF", loading = true }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <ClipLoader
        color={color}
        loading={loading}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoaderComponent;
