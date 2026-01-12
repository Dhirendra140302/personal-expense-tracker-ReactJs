const DateFilter = ({ setDateFilter }) => {
  return <input type="month" onChange={(e) => setDateFilter(e.target.value)} />;
};

export default DateFilter;
