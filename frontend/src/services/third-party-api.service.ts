const weatherService = {
  getForecast: async (lat: number, lng: number): Promise<any> => {
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      if (!response.ok) throw await response.json()
      return await response.json()
    } catch (err) {
      console.error('Error fetching forecast:', err)
    }
  }
}

// todo make type for getCountryCurrency
const currencyService = {
  getCountryCurrency: async (countryCode: string): Promise<any> => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      const result = await response.json();
      return result[0].currencies;
    } catch (e) {
      console.error(e);
    }
  },
  getCurrentLocationCurrency: async (lat: string, lng: string): Promise<any> => {
    try {
      const response = await fetch(`/api/location-currency?lat=${lat}&lng=${lng}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      const result = await response.json();
      return result.results?.[0]?.annotations?.currency?.iso_code;
    } catch (e) {
      console.error(e);
    }
  },

  getCurrencyRate: async (base: string, target: string): Promise< number | undefined> => {
    try {
      const response = await fetch(`/api/rate?base=${base}&target=${target}`)

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      const result = await response.json();
      return result.conversion_rate;
    }catch (e){
      console.error(e);
      return undefined;
    }
  },

}

export { weatherService, currencyService }