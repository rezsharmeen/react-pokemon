import {useState, useEffect, useRef } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';

import SearchBar from './components/Forms/SearchBar';
import ItemsListView from './components/Items/List/View';
import ItemsGridView from './components/Items/Grid/View';
import ItemDetails from './components/Items/ItemDetails';
import DefaultParams from './components/Forms/SearchBarDto';

import { GET_TYPES, GET_POKEMONS, GET_POKEMON_DETAILS, SET_FAVORITE, SET_UNFAVORITE } from "./store/Queries";

function App() {
  let defaultParams = DefaultParams;
  const sourcePokemons = useQuery(GET_POKEMONS);
  const sourceTypes = useQuery(GET_TYPES);
  const [sourcePokemonFetcher, sourcePokemon] = useLazyQuery(GET_POKEMON_DETAILS);
  const [mutateFunctionFavorite, mutateFavoriteObj] = useMutation(SET_FAVORITE);
  const [mutateFunctionUnFavorite, mutateUnFavoriteObj] = useMutation(SET_UNFAVORITE);
  
  let source = useRef([]);
  const [searchTypeOption, setSearchTypeOption] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [selctedChar, setSelecteCharacter] = useState();
  const [searchParam, setSearchParam] = useState(defaultParams);

  useEffect(() => {
    if(sourcePokemons.data && sourcePokemons.data.pokemons && sourcePokemons.data.pokemons.edges){
      const sortedData= [...sourcePokemons.data.pokemons.edges].sort((a, b) => a.name > b.name ? 1 : -1)
      source.current = sortedData;
      setDataForGui();
      if(sourcePokemon && sourcePokemon.data && sourcePokemon.data.id){
        onSelectIconHandler( sourcePokemon.data.id );
      }
    }
  }, [sourcePokemons.data]);

  useEffect(() => {
    if(sourceTypes.data && sourceTypes.data.pokemons && sourceTypes.data.pokemons.edges){
      const typesSets = sourceTypes.data.pokemons.edges.reduce(
        (previousValue, currentValue) => previousValue.concat(currentValue.types), []
      );
      const typesSet = new Set(typesSets);
      setSearchTypeOption(Array.from(typesSet).sort());
    }
  }, [sourceTypes.data]);

  useEffect(() => {
    if(sourcePokemon.data && sourcePokemon.data.pokemonById){
      setSelecteCharacter(sourcePokemon.data.pokemonById);
    }
  }, [sourcePokemon.data]);

  useEffect(() => {
    setDataForGui();
  }, [searchParam]);

  function setDataForGui(){
    let items = [...source.current];
    if(!searchParam){
      return;
    }
    items = searchParam.allChars ? items : items.filter((row) => row.isFavorite === true);
    if(searchParam.searchValue !== '') {
      items = items.filter((row) => row.name.indexOf(searchParam.searchValue) > -1);
    }
    if(searchParam.searchType !== '') {
      items = items.filter((row) => row.types.includes(searchParam.searchType));
    }
    setCharacters(items);
  }

  function onFavClickHandler(id, status) {
    if(status) {
      mutateFunctionFavorite({ 
        variables: { id: id },
        refetchQueries: [
          GET_POKEMONS
        ]
      });
    } else {
      mutateFunctionUnFavorite({ 
        variables: { id: id },
        refetchQueries: [
          GET_POKEMONS
        ]
      });
    }    
  }

  function onSelectIconHandler(id){
    const selectedItem = source.current.find((row) => row.id === id);
    if(selectedItem) {
      sourcePokemonFetcher({ variables: { id: id } });
    } else {
      setSelecteCharacter(null);
    }
  }

  if(sourcePokemons.loading) {
    return <section><p>Loading...</p></section>
  }
  if(sourcePokemons.error) {
    return <section><p>Loading Failed. Please retry.</p></section>
  }
  
  return (
    <div>
      {!selctedChar && <SearchBar defaultParams={defaultParams} searchTypeOption={searchTypeOption} updateDefaultParam={setSearchParam} /> }
      {selctedChar && <ItemDetails data={selctedChar} onFavClickHandler={onFavClickHandler} onSelectIconHandler={onSelectIconHandler} /> }
      {!selctedChar && searchParam && searchParam.viewTypeList && <ItemsListView data={characters} onFavClickHandler={onFavClickHandler} onSelectIconHandler={onSelectIconHandler}/> }
      {!selctedChar && searchParam && !searchParam.viewTypeList && <ItemsGridView data={characters} onFavClickHandler={onFavClickHandler} onSelectIconHandler={onSelectIconHandler} /> }
    </div>
  );
}

export default App;
