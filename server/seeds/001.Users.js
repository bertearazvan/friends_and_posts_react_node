exports.seed = function (knex) {
  return knex('users').insert([
    {
      username: 'anders@me.com',
      password: '$2b$10$.4cXctESTDCJfTvOZcXe/OHM1VpW93b/OgCdB.xJNeKSyHxDmw9vy',
      first_name: 'Anders',
      last_name: 'Latif',
    },
    {
      username: 'razvan@me.com',
      password: '$2b$10$.4cXctESTDCJfTvOZcXe/OHM1VpW93b/OgCdB.xJNeKSyHxDmw9vy',
      first_name: 'Razvan',
      last_name: 'Bertea',
    },
    {
      username: 'stefandrei123@gmail.com',
      password: '$2b$10$.4cXctESTDCJfTvOZcXe/OHM1VpW93b/OgCdB.xJNeKSyHxDmw9vy',
      first_name: 'Stefan-Andrei',
      last_name: 'Atudorei',
      image_url: "/static/andrei.jpg"
    },
    {
      username: 'cassandratiltack@me.com',
      password: '$2b$10$.4cXctESTDCJfTvOZcXe/OHM1VpW93b/OgCdB.xJNeKSyHxDmw9vy',
      first_name: 'Cassandra',
      image_url: "/static/cass.jpg",
      last_name: 'Tiltack',
    },
    {
      username: 'alin@me.com',
      password: '$2b$10$.4cXctESTDCJfTvOZcXe/OHM1VpW93b/OgCdB.xJNeKSyHxDmw9vy',
      first_name: 'Alin',
      image_url: "/static/alin.jpg",
      last_name: 'Chiosa',
    },
  ]);
};
