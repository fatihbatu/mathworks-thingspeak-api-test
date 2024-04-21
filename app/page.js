'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTime, setRefreshTime] = useState(null);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://api.thingspeak.com/channels/2491038/feeds.json'
      );

      const latestFieldOneEntry = response.data.feeds
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .filter((feed) => feed.field1 !== null)[0].field1;

      const wrappedData = [
        {
          name: 'Channel ID',
          value: response.data.channel.id ?? 'N/A',
        },
        {
          name: 'Channel Name',
          value: response.data.channel.name ?? 'N/A',
        },
        {
          name: 'Channel Description',
          value: response.data.channel.description ?? 'N/A',
        },
        {
          name: 'Field Name',
          value: response.data.channel.field1 ?? 'N/A',
        },
        {
          name: 'Latest Field Value',
          value: latestFieldOneEntry ?? 'N/A',
        },
      ];

      setError(null);
      setData(wrappedData);
      setRefreshTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p>Loading...</p>;
    }
    if (error) {
      return <p>Error: {error.message}</p>;
    }
    return (
      <div className='flex flex-col items-center'>
        <div className='bg-white p-8 rounded-lg shadow-lg max-w-sm mx-auto'>
          <h1 className='text-3xl font-bold mb-4'>Thingspeak Data</h1>
          <ul>
            {data.map((item) => (
              <li key={item.name} className='mb-2'>
                <strong>{item.name}:</strong> {item.value}
              </li>
            ))}
            <li key='Last Refreshed' className='mb-2'>
              <strong>Last Refreshed:</strong> {refreshTime}
            </li>
          </ul>
        </div>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full max-w-sm'
          onClick={getData}
        >
          Refresh
        </button>
      </div>
    );
  };

  return (
    <main className='bg-gray-100 text-gray-900 font-sans antialiased min-h-screen flex items-center justify-center'>
      {renderContent()}
    </main>
  );
}
