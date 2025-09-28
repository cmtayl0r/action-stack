import { useAppContext } from "@/context/app/AppContext";
const ThemeSelector = () => {
  const { state, setTheme } = useAppContext();

  const themes = [
    { value: "light", label: "☀️ Light", icon: "☀️" },
    { value: "dark", label: "🌙 Dark", icon: "🌙" },
    {
      value: "light-high-contrast",
      label: "☀️ ♿ Light High Contrast",
      icon: "☀️",
    },
    {
      value: "dark-high-contrast",
      label: "🌙 ♿ Dark High Contrast",
      icon: "🌙",
    },
  ] as const;

  return (
    <div className="theme-selector">
      <label htmlFor="theme-select">Choose theme:</label>
      <select
        id="theme-select"
        value={state.theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="theme-select"
      >
        {themes.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  );
};
