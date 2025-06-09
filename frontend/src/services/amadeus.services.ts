const amadeusServices = {
  getAmadeusToken: async (): Promise<any> => {
    try {
      const response = await fetch('/api/amadeus-token');

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Amadeus error:', errorData);
        return;
      }

      return await response.json();
    } catch (e) {
      console.error('Fetch error:', e);
    }
  },

}

export { amadeusServices }