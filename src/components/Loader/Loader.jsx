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
        // color="#3470FF"
        color={color}
        // loading={true}
        loading={loading}
        // size={80}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoaderComponent;
