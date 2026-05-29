import { useNavigate } from "react-router-dom";
import SearchModal from "../components/SearchModal";

const SearchPage = () => {
    const navigate = useNavigate();

    return <SearchModal onClose={() => navigate("/")} />;
};

export default SearchPage;
