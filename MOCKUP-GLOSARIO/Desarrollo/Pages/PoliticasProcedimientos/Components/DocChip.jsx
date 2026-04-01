export default function DocChip({ letter, label, onClick }) {
  const isWord = letter === 'W';

  return (
    <button
      type="button"
      className={`pp-chip ${isWord ? 'pp-chip-word' : 'pp-chip-slides'}`}
      title={label}
      onClick={onClick}
    >
      <span className="pp-chip-letter">{letter}</span>
      <span>{label}</span>
    </button>
  );
}
