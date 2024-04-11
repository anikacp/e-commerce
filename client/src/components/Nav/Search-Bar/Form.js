import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic'; // Import MicIcon from Material-UI
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Form.css'
import { useContext } from 'react';
import { SearchContext } from '../../../Context/SearchContext';
//

const Form = () => {
    const [searchInput, setSearchInput] = useState('')
    const searchContext = useContext(SearchContext)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setSearchInput(e.target.value)
    }

    const handleFormSubmit = (e) => {  
        e.preventDefault()
        searchContext.setSearchQuery(searchInput)
        navigate('/search')
    }

    return ( 
        <form className="search__form" onSubmit={handleFormSubmit}>
            <input type="text" placeholder='Search for products' className="search__form__input" value={searchInput} onChange={handleChange} required />
            <button className="search__form__button" type='submit'>
                <SearchIcon fontSize='medium'/>
            </button>
            <button className="voice__button" type='button'>
                <MicIcon fontSize='medium'/>
            </button>
        </form>
    );
}
 
export default Form;