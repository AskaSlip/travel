import { IPlaceForFilter } from '@/models/IPlaceForFilter';

export const placeCategories = {
  "Nature & Relaxation": [
    { name: "Parks", key: "park" },
    { name: "Zoo", key: "zoo" },
    { name: "Campgrounds", key: "campground" }
  ],
  "Culture & History": [
    { name: "Museums", key: "museum" },
    { name: "Art Galleries", key: "art_gallery" },
    { name: "Libraries", key: "library" },
    { name: "Churches", key: "church" },
    { name: "Synagogues", key: "synagogue" },
    { name: "Mosques", key: "mosque" },
    { name: "Hindu Temples", key: "hindu_temple" },
    { name: "City Halls", key: "city_hall" }
  ],
  "Food & Drinks": [
    { name: "Restaurants", key: "restaurant" },
    { name: "Cafés", key: "cafe" },
    { name: "Bars & Pubs", key: "bar" },
    { name: "Casinos", key: "casino" }
  ],
  "Entertainment & Activities": [
    { name: "Amusement Parks", key: "amusement_park" },
    { name: "Aquariums", key: "aquarium" },
    { name: "Movie Theaters", key: "movie_theater" },
    { name: "Night Clubs", key: "night_club" },
    { name: "Stadiums", key: "stadium" },
    { name: "Shopping Malls", key: "shopping_mall" },
    { name: "Worth to see", key: "tourist_attraction" }
  ],
  "Where to Stay": [
    { name: "Hotels & Hostels", key: "lodging" }
  ],
  "Travel Services": [
    { name: "Travel Agencies", key: "travel_agency" }
  ]
} satisfies IPlaceForFilter;
