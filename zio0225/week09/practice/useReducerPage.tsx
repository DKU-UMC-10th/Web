import { useReducer, useState } from "react";

interface CompanyState {
  department: string;
  error: string | null;
}

type CompanyAction =
  | { type: "CHANGE_DEPARTMENT"; payload: string }
  | { type: "RESET" };

const initialState: CompanyState = {
  department: "Software Developer",
  error: null,
};

function companyReducer(state: CompanyState, action: CompanyAction): CompanyState {
  switch (action.type) {
    case "CHANGE_DEPARTMENT": {
      const newDept = action.payload;
      const hasError = newDept !== "Card Maker"; 

      return {
        ...state,
        department: hasError ? state.department : newDept,
        error: hasError ? "카드 메이커만 입력 가능합니다. (거부권 행사!)" : null,
      };
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function UseReducerCompany() {
  const [state, dispatch] = useReducer(companyReducer, initialState);
  const [inputValue, setInputValue] = useState("");

  const handleUpdate = () => {
    dispatch({ type: "CHANGE_DEPARTMENT", payload: inputValue });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👨‍💻 현재 직무: {state.department}</h2>
      
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="변경하고 싶은 직무를 입력하세요"
        style={{ width: "300px", padding: "8px", marginRight: "10px" }}
      />
      <button onClick={handleUpdate} style={{ padding: "8px 16px" }}>
        직무 변경하기
      </button>
      
      <button 
        onClick={() => { dispatch({ type: "RESET" }); setInputValue(""); }} 
        style={{ padding: "8px 16px", marginLeft: "5px" }}
      >
        초기화
      </button>
    </div>
  );
}