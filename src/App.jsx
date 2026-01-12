import React from "react";
import Analytics from "./component/Analytics.jsx";
import Header from "./component/Header.jsx";
import Balance from "./component/Balance.jsx";
import IncomeExpenses from "./component/IncomeExpenses.jsx";
import TransactionList from "./component/TransactionList.jsx";
import AddTransaction from "./component/AddTransaction.jsx";
import { GlobalProvider } from "./context/GlobalState.jsx";
import Budget from "./component/Budget.jsx";
import DataManagement from "./component/DataManagement.jsx";

const App = () => {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark((d) => !d);

  return (
    <GlobalProvider>
      <Header toggleTheme={toggleTheme} isDark={isDark} />
      <div className="container">
        <Balance />
        <IncomeExpenses />
        <Analytics />
        <Budget />
        <TransactionList />
        <AddTransaction />
        <DataManagement />
      </div>
    </GlobalProvider>
  );
};

export default App;
