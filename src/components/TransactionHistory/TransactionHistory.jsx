import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import TransactionApi from "../../api/transactionApi";

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const response = TransactionApi.getAllTransaction();
    if (response.status === 200) {
      console.log(response);
      setTransactions(response.data);
    }
  });
  return (
    user && (
      <div>
        <header className="heading flex flex-col border-b pt-[20px] pb-[15px]">
          <span className="font-body text-[18px] text-dark font-[500]">
            My transactions
          </span>
        </header>
        <div className="flex flex-col justify-center items-center">
          {transactions.length === 0 ? (
            <p className="font-body py-5">You have no transaction.</p>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    )
  );
};

export default TransactionHistory;
