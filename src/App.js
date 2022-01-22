import { useState, useEffect} from 'react';
import { Card, FormControl, MenuItem, Select, CardContent

} from '@mui/material';
import CovidInfo from './CovidInfo';
import Table from './CountriesTable';
import './App.css';
import { sortData } from './sortData';

function App() {

  // Track the status of variables
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Global")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([]);

  //Get global totals
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data)
    } )
  }, [])

  // Get global totals per country
  useEffect(() => {
     
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));
        
        const sortedData = sortData(data)
        setTableData(sortedData)
        setCountries(countries)
      })
    }

    getCountriesData();
      
  }, [])

  // Display default or user selection
  const onSelectCountry = async (e) => {
      const countryCode = e.target.value;

      const url = countryCode === 'Countries' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

      await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode)
        setCountryInfo(data)
      })

  };

  return (
    
    <div className="app">
        <div className="header">
          
          <div className="top">
              <h1 style={{padding: 10}}>COVID TRACKER</h1>

              <FormControl>
                  <Select variant='outlined' value={country} onChange={onSelectCountry}>
                    <MenuItem value='Global'>Global</MenuItem>
                      {/* Loop through the list of countries and show a drop down */}
                      {countries.map((country) => (
                        <MenuItem value={country.value}>{country.name}</MenuItem>
                      ))}
                  </Select>
              </FormControl>
          </div>

          <div className="bottom">
              <p>COVID-19 is caused by a coronavirus called SARS-CoV-2. Older adults and people who have severe underlying medical conditions like heart or lung disease or diabetes seem to be at higher risk for developing more serious complications from COVID-19 illness.</p>
              <br />
              <p>Get more information on Covid-19 Preventions, Symptoms, Testing and Vaccines from <a href="https://www.cdc.gov/" target="_blank">Center for Disease Control</a></p>
          </div>
      
      </div>   
            
      <div className="app__stats">
          {/* Cards */}
          <CovidInfo headText='Covid-19 Cases' cases={countryInfo.todayCases} total={countryInfo.cases}/>

          <CovidInfo headText='Recovered' cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>

          <CovidInfo headText='Deaths' cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>

      </div>  

      <Card>
           <CardContent>
              <h3>Total Cases Per Country (Desc)</h3>
              <Table countries={tableData}/>
           </CardContent>    
      </Card>

    </div>

  );

}

export default App;
