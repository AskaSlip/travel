'use client';
import { FC, useEffect, useState } from 'react';
import { ITripStop } from '@/models/ITripStop';
import { currencyService } from '@/services/third-party-api.service';
import currencies from '@/assets/currencies.json';
import CurrencyComboBox from '@/components/CurrencyComboBox/CurrencyComboBox';

interface IProps {
  tripStops: ITripStop[];
}

const cacheDuration = 24 * 60 * 60 * 1000;

const CurrencyConvertorComponent: FC<IProps> = ({ tripStops }) => {

  // const [uniqueCountries, setUniqueCountries] = useState<string[]>([]);
  const [currentPosition, setCurrentPosition] = useState<{ lat: string, lng: string }>();
  const [currentUserCurrency, setCurrentUserCurrency] = useState<string>();
  const [uniqueCountriesCurrency, setUniqueCountriesCurrency] = useState<string[]>([]);
  const [uniqueCountriesCode, setUniqueCountriesCode] = useState<string[]>([]);
  const [selectedBase, setSelectedBase] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [rate, setRate] = useState<string | number | undefined>();
  const [baseValue, setBaseValue] = useState<number | string>('');
  const [targetValue, setTargetValue] = useState<number | string>('');

  useEffect(() => {
    const codes = Array.from(
      new Set(tripStops.map((stop) => stop.iso_code).filter((c): c is string => typeof c === 'string')),
    );
    setUniqueCountriesCode(codes);

    // const countries = Array.from(
    //   new Set(tripStops.map((stop) => stop.country).filter((c): c is string => typeof c === 'string')),
    // );
    // setUniqueCountries(countries);
  }, [JSON.stringify(tripStops)]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude.toString(), lng: longitude.toString() });
      },
      (err) => {
        console.error('Failed to get location:', err);
      },
    );
  }, []);

  useEffect(() => {
    if (!currentPosition) return;
    const fetchCurrency = async () => {
      const currency = await currencyService.getCurrentLocationCurrency(currentPosition?.lat, currentPosition?.lng);
      setCurrentUserCurrency(currency);
    };
    fetchCurrency();

  }, [currentPosition]);


  useEffect(() => {
    const fetchCountriesCurrency = async () => {
      const currencies = await Promise.all(
        uniqueCountriesCode.map(async (code) => {
          const currencyDetails = await currencyService.getCountryCurrency(code);
          return Object.keys(currencyDetails)[0];
        }),
      );
      const uniqueCurrencies = [...new Set(currencies)];
      setUniqueCountriesCurrency(uniqueCurrencies);
    };
    fetchCountriesCurrency();
  }, [uniqueCountriesCode]);

  const handleBaseChange = (currency: string) => {
    setSelectedBase(currency);
  };
  const handleTargetChange = (currency: string) => {
    setSelectedTarget(currency);
  };

  const getCacheKey = (base: string, target: string) => {
    return `exchange_${base}_${target}`;
  };

  const getCachedRate = (base: string, target: string): number | null => {
    const key = getCacheKey(base, target);
    const cachedData = localStorage.getItem(key);

    if (!cachedData) return null;

    const { rate, timestamp } = JSON.parse(cachedData);
    const now = Date.now();
    if (now - timestamp < cacheDuration) {
      return rate;
    }
    localStorage.removeItem(key);
    return null;
  };

  const setCachedRate = (base: string, target: string, rate: number) => {
    const key = getCacheKey(base, target);
    const payload = JSON.stringify({
      rate,
      timestamp: Date.now(),
    });
    localStorage.setItem(key, payload);
  };

  useEffect(() => {
    if (!selectedBase || !selectedTarget) return;

    const cachedRate = getCachedRate(selectedBase, selectedTarget);
    if (cachedRate !== null) {
      setRate(cachedRate);
      return;
    }

    const fetchRate = async () => {
      try {
        const rate = await currencyService.getCurrencyRate(selectedBase, selectedTarget);
        if (rate) {
          setRate(rate);
          setCachedRate(selectedBase, selectedTarget, rate);
        }

      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        return;
      }
    };
    fetchRate();

  }, [selectedBase, selectedTarget]);


  const handleBaseInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBaseValue(value);

    if (rate && !isNaN(+value)) {
      setTargetValue((+value * +rate).toFixed(2));
    } else {
      setTargetValue('');
    }
  };

  const handleTargetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTargetValue(value);

    if (rate && !isNaN(+value) && rate !== 0) {
      setBaseValue((+value / +rate).toFixed(2));
    } else {
      setBaseValue('');
    }
  };


  return (
    <div className="border-amber-950 border-4">
      <h2>curr from current location {currentUserCurrency}</h2>
      <h2>u have them:</h2>
      <ul>
        {uniqueCountriesCurrency.map((curr, index) => (
          <li key={index}>
            {curr}
          </li>
        ))}
      </ul>
      <CurrencyComboBox currency={currencies} value={selectedBase} onChange={handleBaseChange} currentUserCurrency={currentUserCurrency}/>
      <input type={'number'} placeholder={'base'} value={baseValue} onChange={handleBaseInput}
             className="input-no-spinner w-16 border-blue-500 border-4" />
      <br />
      <CurrencyComboBox currency={currencies} value={selectedTarget} onChange={handleTargetChange} />
      <input type={'number'} placeholder={'target'} value={targetValue} onChange={handleTargetInput}
             className="input-no-spinner w-16 border-blue-500 border-4" />

    </div>
  );
};

export default CurrencyConvertorComponent;