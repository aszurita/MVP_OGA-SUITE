export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="em-search-wrap">
      <input
        type="text"
        placeholder="Buscar..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
}
