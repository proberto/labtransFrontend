// Locais e salas pré-cadastradas para evitar erros de digitação

export interface Location {
  id: string
  name: string
  rooms: string[]
}

export const LOCATIONS: Location[] = [
  {
    id: 'sede',
    name: 'Sede',
    rooms: [
      'Sala 101',
      'Sala 102',
      'Sala 103',
      'Sala 201',
      'Sala 202',
      'Sala 203',
      'Auditório Principal',
      'Sala de Reunião A',
      'Sala de Reunião B',
      'Sala de Reunião C',
    ],
  },
  {
    id: 'filial-1',
    name: 'Filial 1',
    rooms: [
      'Sala 10',
      'Sala 11',
      'Sala 12',
      'Sala 20',
      'Sala 21',
      'Sala de Reunião D',
    ],
  },
  {
    id: 'filial-2',
    name: 'Filial 2',
    rooms: [
      'Sala 1',
      'Sala 2',
      'Sala 3',
      'Sala 4',
      'Sala de Reunião E',
    ],
  },
  {
    id: 'torre-1',
    name: 'Torre 1',
    rooms: [
      'Sala 301',
      'Sala 302',
      'Sala 303',
      'Sala 401',
      'Sala 402',
      'Auditório Torre 1',
    ],
  },
  {
    id: 'torre-2',
    name: 'Torre 2',
    rooms: [
      'Sala 501',
      'Sala 502',
      'Sala 503',
      'Sala 601',
      'Sala 602',
      'Auditório Torre 2',
    ],
  },
]

// Função auxiliar para obter salas de um local específico
export const getRoomsByLocation = (locationName: string): string[] => {
  const location = LOCATIONS.find((loc) => loc.name === locationName)
  return location?.rooms || []
}

// Função auxiliar para obter todos os nomes de locais
export const getLocationNames = (): string[] => {
  return LOCATIONS.map((loc) => loc.name)
}

