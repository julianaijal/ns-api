'use client';
import React, { useState } from 'react';
import { FC } from 'react';
import { IStation } from './interfaces/interfaces';
import { useRouter } from 'next/navigation';
import styles from './styles/Home.module.scss';

const Home: FC<IStation> = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [stationCodes, setStationCodes] = useState('');
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const BASE_URL = 'https://gateway.apiportal.ns.nl';
  const SUBSCRIPTION_KEY = 'ns-api';

  const getStationCodes = async (stationName: string) => {
    const headers = new Headers({
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    });

    const endpoint = `${BASE_URL}/reisinformatie-api/api/v2/stations?q=${stationName}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers,
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.payload);
        setStationCodes(data.payload);
      } else {
        console.error(`Error fetching station codes: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`There was a problem with the fetch operation: ${error}`);
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.searchElement}>
        {' '}
        <h2 className={styles.subtitle}>Stations informatie</h2>
        <h1 className={styles.title}>Zoek je station</h1>
        <input
          type="text"
          placeholder="Bestemming"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button onClick={() => getStationCodes(searchQuery)}>Search</button>
        {stationCodes ? (
          <div>
            {stationCodes.map((stationCode: IStation, i: number) => (
              <p
                key={i}
                onClick={() =>
                  router.push(`/vertrektijden/${stationCode.code}`)
                }
              >
                {stationCode.namen.lang}
              </p>
            ))}
          </div>
        ) : (
          ''
        )}
      </section>
    </main>
  );
};

export default Home;
