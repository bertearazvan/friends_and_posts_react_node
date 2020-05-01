exports.seed = function (knex) {
  return knex('users').insert([
    {
      username: 'anders@me.com',
      password: '$2b$10$.4cXctESTDCJfTvOZcXe/OHM1VpW93b/OgCdB.xJNeKSyHxDmw9vy',
      first_name: 'Anders',
      last_name: 'Latif',
    },
    {
      username: 'stefandrei123@gmail.com',
      password: '$2b$10$.4cXctESTDCJfTvOZcXe/OHM1VpW93b/OgCdB.xJNeKSyHxDmw9vy',
      first_name: 'Stefan-Andrei',
      last_name: 'Atudorei',
    },
    {
      username: 'cassandratiltack@me.com',
      password: '$2b$10$.4cXctESTDCJfTvOZcXe/OHM1VpW93b/OgCdB.xJNeKSyHxDmw9vy',
      first_name: 'Cassandra',
      last_name: 'Tiltack',
    },
    {
      username: 'alin@me.com',
      password: '$2b$10$.4cXctESTDCJfTvOZcXe/OHM1VpW93b/OgCdB.xJNeKSyHxDmw9vy',
      first_name: 'Alin',
      last_name: 'Chiosa',
    },
  ]);
};
