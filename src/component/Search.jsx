const Search = ({ setSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search transactions..."
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default Search;
