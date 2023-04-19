import { useEffect, useState } from 'react';
import './App.css';
import { getAllPokemon, getPokemon } from './utils/pokemon';
import Card from './components/Card/Card';
import Navbar from './components/Nabvar/Navbar';

function App() {
  const initialURL = 'https://pokeapi.co/api/v2/pokemon';
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');

  useEffect(() => {
    const fetchPokemonData = async () => {
      // ポケモンの全データ一覧をデータを取得する
      let res = await getAllPokemon(initialURL);
      // ポケモン詳細データを取得する
      loadPokemon(res.results);
      setNextUrl(res.next);
      setLoading(false);
    };
    // ポケモンの全データ一覧をデータを取得する
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };


  const handlePrevPage = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let res = await getAllPokemon(prevUrl);
    await loadPokemon(res.results);
    setNextUrl(res.next);
    setPrevUrl(res.previous);
    setLoading(false);
  };

  const handleNextPage = async () => {
    if (!nextUrl) return;
    setLoading(true);
    let res = await getAllPokemon(nextUrl);
    await loadPokemon(res.results);
    setNextUrl(res.next);
    setPrevUrl(res.previous);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中．．．</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
