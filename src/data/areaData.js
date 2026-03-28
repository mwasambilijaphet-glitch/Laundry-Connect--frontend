// ============================================================
// AREA DATA — Tanzania Ward/Mtaa/Landmark Discovery
// Organized by city → district → wards with landmarks
// ============================================================

const AREAS = {
  dar: {
    name: 'Dar es Salaam',
    districts: [
      {
        id: 'kinondoni',
        name: 'Kinondoni',
        wards: [
          { id: 'mikocheni', name: 'Mikocheni', landmarks: ['Mikocheni B', 'Regent Estate', 'Shoppers Plaza'] },
          { id: 'sinza', name: 'Sinza', landmarks: ['Sinza A', 'Sinza Palestina', 'Shekilango Road'] },
          { id: 'kijitonyama', name: 'Kijitonyama', landmarks: ['Kijitonyama Police', 'Morocco'] },
          { id: 'mwananyamala', name: 'Mwananyamala', landmarks: ['Mwananyamala Hospital'] },
          { id: 'kinondoni_a', name: 'Kinondoni', landmarks: ['Kinondoni A', 'Kinondoni B', 'Mwenge'] },
          { id: 'msasani', name: 'Msasani', landmarks: ['Masaki', 'Oyster Bay', 'Slipway', 'Sea Cliff'] },
          { id: 'mbezi', name: 'Mbezi', landmarks: ['Mbezi Beach', 'Africana', 'Mbezi Louis'] },
          { id: 'kawe', name: 'Kawe', landmarks: ['Kawe Beach', 'Tegeta', 'Kunduchi'] },
          { id: 'ubungo', name: 'Ubungo', landmarks: ['Ubungo Bus Terminal', 'Mabibo', 'Kwembe'] },
          { id: 'kimara', name: 'Kimara', landmarks: ['Kimara Baruti', 'Kimara Mwisho', 'Kimara Stopover'] },
          { id: 'kibamba', name: 'Kibamba', landmarks: ['Kibamba', 'Goba', 'Bunju'] },
        ],
      },
      {
        id: 'ilala',
        name: 'Ilala',
        wards: [
          { id: 'kariakoo', name: 'Kariakoo', landmarks: ['Kariakoo Market', 'Msimbazi', 'Mnazi Mmoja'] },
          { id: 'ilala_ward', name: 'Ilala', landmarks: ['Buguruni', 'Vingunguti'] },
          { id: 'upanga', name: 'Upanga', landmarks: ['Upanga East', 'Upanga West', 'Muhimbili'] },
          { id: 'kivukoni', name: 'Kivukoni', landmarks: ['CBD', 'Posta', 'Samora Avenue', 'Askari Monument'] },
          { id: 'tabata', name: 'Tabata', landmarks: ['Tabata Relini', 'Tabata Segerea'] },
          { id: 'ukonga', name: 'Ukonga', landmarks: ['Ukonga', 'Pugu Road'] },
          { id: 'gerezani', name: 'Gerezani', landmarks: ['Gerezani', 'Kivukoni Ferry'] },
        ],
      },
      {
        id: 'temeke',
        name: 'Temeke',
        wards: [
          { id: 'temeke_ward', name: 'Temeke', landmarks: ['Temeke Stereo', 'Chang\'ombe'] },
          { id: 'mbagala', name: 'Mbagala', landmarks: ['Mbagala Rangi Tatu', 'Mbagala Kuu'] },
          { id: 'kurasini', name: 'Kurasini', landmarks: ['Kurasini', 'Bandari'] },
          { id: 'kigamboni', name: 'Kigamboni', landmarks: ['Kigamboni Ferry', 'South Beach'] },
          { id: 'mtoni', name: 'Mtoni', landmarks: ['Mtoni', 'Tandika'] },
          { id: 'yombo', name: 'Yombo Vituka', landmarks: ['Yombo Vituka', 'Toangoma'] },
        ],
      },
    ],
  },
  arusha: {
    name: 'Arusha',
    districts: [
      {
        id: 'arusha_city',
        name: 'Arusha City',
        wards: [
          { id: 'arusha_cbd', name: 'CBD', landmarks: ['Clock Tower', 'Central Market', 'Boma Road'] },
          { id: 'sekei', name: 'Sekei', landmarks: ['Sekei', 'Njiro'] },
          { id: 'njiro', name: 'Njiro', landmarks: ['Njiro Complex', 'Njiro Road'] },
          { id: 'sakina', name: 'Sakina', landmarks: ['Sakina', 'Sanawari'] },
          { id: 'kijenge', name: 'Kijenge', landmarks: ['Kijenge', 'Themi Hill'] },
          { id: 'ngarenaro', name: 'Ngarenaro', landmarks: ['Ngarenaro', 'Fire Station'] },
          { id: 'unga_ltd', name: 'Unga Limited', landmarks: ['Unga Limited', 'Kaloleni'] },
          { id: 'sombetini', name: 'Sombetini', landmarks: ['Sombetini', 'Mt. Meru Hospital'] },
          { id: 'tengeru', name: 'Tengeru', landmarks: ['Tengeru Market', 'USA River'] },
        ],
      },
    ],
  },
  dodoma: {
    name: 'Dodoma',
    districts: [
      {
        id: 'dodoma_city',
        name: 'Dodoma City',
        wards: [
          { id: 'dodoma_cbd', name: 'CBD', landmarks: ['Nyerere Square', 'Jamhuri Stadium', 'Railway Station'] },
          { id: 'kikuyu', name: 'Kikuyu', landmarks: ['Kikuyu', 'Mlimwa'] },
          { id: 'chamwino', name: 'Chamwino', landmarks: ['Chamwino', 'UDOM'] },
          { id: 'nzuguni', name: 'Nzuguni', landmarks: ['Nzuguni', 'Nzuguni Market'] },
          { id: 'viwandani', name: 'Viwandani', landmarks: ['Viwandani', 'Chang\'ombe'] },
          { id: 'makole', name: 'Makole', landmarks: ['Makole', 'Area D'] },
          { id: 'miyuji', name: 'Miyuji', landmarks: ['Miyuji', 'Iyumbu'] },
        ],
      },
    ],
  },
  mwanza: {
    name: 'Mwanza',
    districts: [
      {
        id: 'mwanza_city',
        name: 'Mwanza City',
        wards: [
          { id: 'mwanza_cbd', name: 'CBD', landmarks: ['Rock City Mall', 'Bus Stand'] },
          { id: 'nyamagana', name: 'Nyamagana', landmarks: ['Nyamagana', 'Pasiansi'] },
          { id: 'ilemela', name: 'Ilemela', landmarks: ['Ilemela', 'Bugarika'] },
          { id: 'capri_point', name: 'Capri Point', landmarks: ['Capri Point', 'Yacht Club'] },
        ],
      },
    ],
  },
  mbeya: {
    name: 'Mbeya',
    districts: [
      {
        id: 'mbeya_city',
        name: 'Mbeya City',
        wards: [
          { id: 'mbeya_cbd', name: 'CBD', landmarks: ['Market', 'Bus Stand'] },
          { id: 'iyunga', name: 'Iyunga', landmarks: ['Iyunga', 'Mbeya University'] },
          { id: 'forest', name: 'Forest', landmarks: ['Forest Area', 'Sisimba'] },
        ],
      },
    ],
  },
};

/**
 * Get all cities with their areas flattened for search
 */
export function getAllAreas() {
  const results = [];
  for (const [cityId, city] of Object.entries(AREAS)) {
    for (const district of city.districts) {
      for (const ward of district.wards) {
        results.push({
          cityId,
          cityName: city.name,
          districtId: district.id,
          districtName: district.name,
          wardId: ward.id,
          wardName: ward.name,
          landmarks: ward.landmarks,
          searchText: `${ward.name} ${ward.landmarks.join(' ')} ${district.name} ${city.name}`.toLowerCase(),
        });
      }
    }
  }
  return results;
}

/**
 * Search areas by text (ward name, landmark, district, city)
 */
export function searchAreas(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return getAllAreas()
    .filter(a => a.searchText.includes(q))
    .slice(0, 10);
}

/**
 * Get districts for a city
 */
export function getDistrictsForCity(cityId) {
  return AREAS[cityId]?.districts || [];
}

/**
 * Get wards for a district
 */
export function getWardsForDistrict(cityId, districtId) {
  const district = AREAS[cityId]?.districts.find(d => d.id === districtId);
  return district?.wards || [];
}

export default AREAS;
