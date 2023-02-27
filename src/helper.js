export const getFormattedDate = (inputDate) => {
  const date = new Date(inputDate);

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const driverDetailsHandler = (props, driverId, year) => {
  props.history.push(`/drivers/${driverId}?year=${year}`);
};

export const constructorDetailsHandler = (props, constructorId, year) => {
  props.history.push(`/constructors/${constructorId}?year=${year}`);
};

export const raceDetailsHandler = (props, raceId, year) => {
  props.history.push(`/races/${raceId}?year=${year}`);
};

export const sumPoints = (firstDriver, secondDriver) => {
  return Number(firstDriver) + Number(secondDriver);
};

export const driversFilter = (driverStandings, query) => {
  const filteredDriverStandings = driverStandings.filter((driver) => {
    const driverInfo =
      `${driver.Driver.givenName} ${driver.Driver.familyName} ${driver.Driver.nationality} ${driver.Constructors[0].name}`.toLowerCase();
    return driverInfo.includes(query.toLowerCase());
  });
  return filteredDriverStandings;
};

export const constructorsFilter = (constructorStandings, query) => {
  const filteredConstructorStandings = constructorStandings.filter((constructor) => {
    const constructorInfo =
      `${constructor.Constructor.name} ${constructor.Constructor.nationality}`.toLowerCase();
    return constructorInfo.includes(query.toLowerCase());
  });
  return filteredConstructorStandings;
};

export const racesFilter = (races, query) => {
  const filteredRaces = races.filter((race) => {
    const raceInfo =
      `${race.Results[0].Driver.givenName} ${race.Results[0].Driver.familyName} ${race.Results[0].Constructor.name}`.toLowerCase();
    return raceInfo.includes(query.toLowerCase());
  });
  return filteredRaces;
};

export const nationalityToCountryCodeConverter = (countryList, nationality) => {
  const filteredCountry = countryList.find((country) =>
    country.nationality
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .includes(nationality.toLowerCase())
  );
  return filteredCountry ? filteredCountry.alpha_2_code : '';
};
