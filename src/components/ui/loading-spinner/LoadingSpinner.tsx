import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = ({
  size = "lg",
  label = "Loading...",
  className = "",
}) => {
  return (
    <div
      className={`${styles["loading-spinner"]} ${className}`}
      data-size={size}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className={styles["visually-hidden"]}>{label}</span>
    </div>
  );
};

export default LoadingSpinner;
