import React, { useEffect, useState } from 'react';
import { Eatery, SearchBarProps } from '../../interface';
import "./Searchbar.css"
import { useEateryContext } from '../../hooks/useEateryContext';

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { eateries, fetchEateries } = useEateryContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Eatery[]>([]);

  useEffect(() => {
    fetchEateries();
  }, [fetchEateries]);

  // Execute a search whenever the term changes
  useEffect(() => {
    if (searchTerm !== "") { // suggest when user types 
      const results = eateries.filter(eatery =>
        eatery.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 2); // show 2 suggestions at a time
      setResults(results);
    } else { 
      setResults([])
    }
  }, [searchTerm, eateries]);

  const handleSelect = (eatery: Eatery) => {
    onSearch(eatery);
    setSearchTerm("");
    setResults([]);
  }

  return (
    <div className='search-wrapper'>
      <div className='search-container'>
      
        <div className='search-bar-container'>
        <span className='glyphicon glyphicon-search'></span>
          <input
            type="text"
            placeholder= 'Search Restaurants'
            className='search-bar'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          /> 
        </div>

        {results.length > 0 && (
          <div className="autocomplete-dropdown">
            
            {results.map(eatery => (
              <div key={eatery.id} onClick={() => handleSelect(eatery)}>
                {eatery.restaurant_name}
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default SearchBar;
